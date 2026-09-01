import type { CanvasEdge, CanvasNode } from "@/types/graph"
import { capitalize, deriveStateName } from "./helpers"

function apiVarBase(nodeId: string): string {
  return `api${nodeId.slice(0, 4)}`
}

function buildApiCallHook(node: CanvasNode): string {
  const varBase = apiVarBase(node.id)
  const cap = capitalize(varBase)
  const url = String(node.data.props.url ?? "")
  const method = String(node.data.props.method ?? "POST")

  return `const [${varBase}Status, set${cap}Status] = useState<'idle'|'loading'|'success'|'error'>('idle')
const [${varBase}Data, set${cap}Data] = useState(null)
const [${varBase}Error, set${cap}Error] = useState('')
const [${varBase}IsLoading, set${cap}IsLoading] = useState(false)
const [${varBase}IsSuccess, set${cap}IsSuccess] = useState(false)
const [${varBase}IsError, set${cap}IsError] = useState(false)

async function trigger${cap}(payload) {
  set${cap}Status('loading')
  set${cap}IsLoading(true)
  set${cap}IsSuccess(false)
  set${cap}IsError(false)
  set${cap}Error('')
  try {
    const raw = payload
    const body = raw == null || raw === "" ? undefined : typeof raw === "string" ? raw : JSON.stringify(raw)
    const res = await fetch(${JSON.stringify(url)}, {
      method: ${JSON.stringify(method)},
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: ${JSON.stringify(method)} === "GET" ? undefined : body,
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const msg = json && typeof json === "object" && "message" in json ? String(json.message) : res.statusText
      throw new Error(\`HTTP \${res.status}: \${msg}\`)
    }
    set${cap}Data(json)
    set${cap}Status('success')
    set${cap}IsLoading(false)
    set${cap}IsSuccess(true)
    set${cap}IsError(false)
  } catch (err) {
    set${cap}Error(String(err))
    set${cap}Status('error')
    set${cap}IsLoading(false)
    set${cap}IsSuccess(false)
    set${cap}IsError(true)
  }
}`
}

export function buildWiringBlock(
  edges: CanvasEdge[],
  nodes: CanvasNode[],
): {
  declarations: string
  hasState: boolean
  triggerOverrides: Map<string, string>
  propOverrides: Map<string, Map<string, string>>
} {
  const names = new Map(nodes.map((n) => [n.id, n.data.name ?? ""]))
  const sourceOccurrence = new Map<string, number>()
  const stateLines: string[] = []
  const wiringComments: string[] = []
  const triggerOverrides = new Map<string, string>()
  const propOverrides = new Map<string, Map<string, string>>()

  const apiCallHooks = nodes
    .filter((n) => n.data.componentType === "apiCall")
    .map((n) => buildApiCallHook(n))

  const hasForm = nodes.some((n) => n.data.componentType === "form")
  if (hasForm) {
    stateLines.push(`  const [formValues, setFormValues] = useState<Record<string, string>>({})`)
  }

  const toastEffects: string[] = []

  for (const edge of edges) {
    const sourceId = edge.source
    const targetId = edge.target
    if (!sourceId || !targetId) continue

    const sourceNode = nodes.find((n) => n.id === sourceId)
    const targetNode = nodes.find((n) => n.id === targetId)
    const sourceType = sourceNode?.data.componentType ?? "node"
    const targetType = targetNode?.data.componentType ?? "node"
    const transform = String(edge.data?.transform ?? "passthrough")

    if (targetType === "apiCall" && edge.targetHandle === "trigger") {
      const cap = capitalize(apiVarBase(targetId))
      const sourceNodeForTrigger = nodes.find((n) => n.id === sourceId)
      const hasPayloadEdge = edges.some(
        (e) => e.source === sourceId && e.target === targetId && e.targetHandle === "payload",
      )
      const isFormSource = sourceNodeForTrigger?.data.componentType === "form"
      // If Form emits payload atomically, pass that payload variable
      if (isFormSource && hasPayloadEdge) {
        triggerOverrides.set(sourceId, `trigger${cap}(JSON.stringify(formValues))`)
      } else if (hasPayloadEdge) {
        const payloadStateName = deriveStateName(sourceNodeForTrigger?.data.componentType ?? "node", sourceId, 1, names)
        triggerOverrides.set(sourceId, `trigger${cap}(${payloadStateName})`)
      } else {
        // Direct trigger without payload - check staticBody
        const targetNodeForBody = nodes.find((n) => n.id === targetId)
        const bodyMode = String(targetNodeForBody?.data.props.bodyMode ?? "bound")
        const staticBody = String(targetNodeForBody?.data.props.staticBody ?? "{}")
        if (bodyMode === "static") {
          triggerOverrides.set(sourceId, `trigger${cap}(${JSON.stringify(staticBody)})`)
        } else {
          triggerOverrides.set(sourceId, `trigger${cap}(undefined)`)
        }
      }
      wiringComments.push(
        `  // ${sourceType}.${edge.sourceHandle ?? "output"} --[trigger]--> ${targetType}.trigger (calls trigger${cap})`,
      )
      continue
    }

    if (targetType === "apiCall" && edge.targetHandle === "payload") {
      const transform = String(edge.data?.transform ?? "passthrough")
      wiringComments.push(
        `  // ${sourceType}.${edge.sourceHandle ?? "output"} --[${transform}]--> ${targetType}.payload`,
      )
      continue
    }

    // Toast wiring: apiCall (or any) -> toast.trigger / isSuccess / isError / status
    if (targetType === "toast" && ["trigger", "status", "isSuccess", "isError"].includes(String(edge.targetHandle ?? ""))) {
      const toastNode = targetNode
      const baseMessage = String(toastNode?.data.props.message ?? "Done")
      const successMessage = String(toastNode?.data.props.successMessage ?? baseMessage)
      const errorMessage = String(toastNode?.data.props.errorMessage ?? baseMessage)
      const targetHandle = String(edge.targetHandle ?? "trigger")
      let condition = ""
      let dep = ""
      let toastCall = `toast.success(${JSON.stringify(baseMessage)})`

      if (sourceType === "apiCall") {
        const varBase = apiVarBase(sourceId)
        const srcHandle = String(edge.sourceHandle ?? "")
        // Pick message/color based on source handle + target handle
        const isErrorSrc = srcHandle === "isError" || targetHandle === "isError" || (srcHandle === "status" && transform === "isError")
        const isSuccessSrc = srcHandle === "isSuccess" || targetHandle === "isSuccess" || (srcHandle === "status" && transform === "isSuccess")
        if (isErrorSrc) {
          toastCall = `toast.error(${JSON.stringify(errorMessage)})`
        } else if (isSuccessSrc) {
          toastCall = `toast.success(${JSON.stringify(successMessage)})`
        } else {
          // trigger generic - infer from variant
          const variant = String(toastNode?.data.props.variant ?? "success")
          toastCall = variant === "error" ? `toast.error(${JSON.stringify(errorMessage || baseMessage)})` : `toast.success(${JSON.stringify(successMessage || baseMessage)})`
        }

        if (srcHandle === "isSuccess") {
          condition = `${varBase}IsSuccess`
          dep = `${varBase}IsSuccess`
        } else if (srcHandle === "isError") {
          condition = `${varBase}IsError`
          dep = `${varBase}IsError`
        } else if (srcHandle === "isLoading") {
          condition = `${varBase}IsLoading`
          dep = `${varBase}IsLoading`
        } else if (srcHandle === "status") {
          if (transform === "isSuccess") { condition = `${varBase}Status === "success"`; dep = `${varBase}Status` }
          else if (transform === "isError") { condition = `${varBase}Status === "error"`; dep = `${varBase}Status` }
          else if (transform === "isLoading") { condition = `${varBase}Status === "loading"`; dep = `${varBase}Status` }
          else {
            // direct status string -> infer from target handle
            if (targetHandle === "isError") { condition = `${varBase}IsError`; dep = `${varBase}IsError` }
            else { condition = `${varBase}IsSuccess`; dep = `${varBase}IsSuccess` }
          }
        } else {
          condition = `${varBase}IsSuccess`
          dep = `${varBase}IsSuccess`
        }
      } else {
        // Generic source (form, button, checkbox etc) -> boolean trigger
        const occ = (sourceOccurrence.get(sourceId) ?? 0) + 1
        const stateName = deriveStateName(sourceType, sourceId, occ, names)
        if (!stateLines.some((l) => l.includes(`[${stateName},`))) {
          stateLines.push(`  const [${stateName}, set${capitalize(stateName)}] = useState(false)`)
          sourceOccurrence.set(sourceId, occ)
        }
        const variant = String(toastNode?.data.props.variant ?? "success")
        toastCall = variant === "error" ? `toast.error(${JSON.stringify(errorMessage || baseMessage)})` : `toast.success(${JSON.stringify(successMessage || baseMessage)})`
        condition = stateName
        dep = stateName
      }

      toastEffects.push(`  useEffect(() => {
    if (${condition}) ${toastCall}
  }, [${dep}])`)
      wiringComments.push(
        `  // ${sourceType}.${edge.sourceHandle ?? "output"} --[${transform}]--> ${targetType}.${targetHandle} (toast)`,
      )
      continue
    }

    if (sourceType === "apiCall") {
      const varBase = apiVarBase(sourceId)
      const sh = String(edge.sourceHandle ?? "")
      let expr = `${varBase}Data`
      if (sh === "data") expr = `${varBase}Data`
      else if (sh === "status") expr = `${varBase}Status`
      else if (sh === "error") expr = `${varBase}Error`
      else if (sh === "isLoading") expr = `${varBase}IsLoading`
      else if (sh === "isSuccess") expr = `${varBase}IsSuccess`
      else if (sh === "isError") expr = `${varBase}IsError`
      else if (sh === "payload") expr = `${varBase}Data`
      if (edge.targetHandle) {
        let finalExpr = expr
        if (transform === "invert") finalExpr = `!${expr}`
        else if (transform === "isSuccess" && sh === "status") finalExpr = `${varBase}Status === "success"`
        else if (transform === "isError" && sh === "status") finalExpr = `${varBase}Status === "error"`
        else if (transform === "isLoading" && sh === "status") finalExpr = `${varBase}Status === "loading"`
        if (!propOverrides.has(targetId)) propOverrides.set(targetId, new Map())
        propOverrides.get(targetId)!.set(edge.targetHandle, finalExpr)
      }
      wiringComments.push(
        `  // ${sourceType}.${edge.sourceHandle ?? "output"} --[${transform}]--> ${targetType}.${edge.targetHandle ?? "prop"}`,
      )
      continue
    }

    const occurrence = (sourceOccurrence.get(sourceId) ?? 0) + 1
    sourceOccurrence.set(sourceId, occurrence)

    const stateName = deriveStateName(sourceType, sourceId, occurrence, names)

    if (occurrence === 1) {
      stateLines.push(
        `  const [${stateName}, set${capitalize(stateName)}] = useState(false)`,
      )
    }

    if (edge.targetHandle) {
      const expr =
        transform === "invert"
          ? `!${stateName}`
          : transform === "isLoading"
            ? `${stateName} === "loading"`
            : transform === "isError"
              ? `${stateName} === "error"`
              : transform === "isSuccess"
                ? `${stateName} === "success"`
                : stateName
      if (!propOverrides.has(targetId)) propOverrides.set(targetId, new Map())
      propOverrides.get(targetId)!.set(edge.targetHandle, expr)
      if (!triggerOverrides.has(sourceId)) {
        triggerOverrides.set(sourceId, `set${capitalize(stateName)}(!${stateName})`)
      }
    }

    wiringComments.push(
      `  // ${sourceType}.${edge.sourceHandle ?? "output"} (${stateName}) --[${transform}]--> ${targetType}.${edge.targetHandle ?? "prop"}`,
    )
  }

  const sections = [
    apiCallHooks.join("\n\n"),
    stateLines.join("\n"),
    toastEffects.join("\n\n"),
    wiringComments.join("\n"),
  ].filter(Boolean)

  return {
    declarations: sections.join("\n\n"),
    hasState: stateLines.length > 0 || apiCallHooks.length > 0,
    triggerOverrides,
    propOverrides,
  }
}
