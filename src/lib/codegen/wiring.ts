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

async function trigger${cap}(payload) {
  set${cap}Status('loading')
  try {
    const res = await fetch(${JSON.stringify(url)}, {
      method: ${JSON.stringify(method)},
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()
    set${cap}Data(json)
    set${cap}Status('success')
  } catch (err) {
    set${cap}Error(String(err))
    set${cap}Status('error')
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
} {
  const names = new Map(nodes.map((n) => [n.id, n.data.name ?? ""]))
  const sourceOccurrence = new Map<string, number>()
  const stateLines: string[] = []
  const wiringComments: string[] = []
  const triggerOverrides = new Map<string, string>()

  const apiCallHooks = nodes
    .filter((n) => n.data.componentType === "apiCall")
    .map((n) => buildApiCallHook(n))

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
      triggerOverrides.set(sourceId, `trigger${cap}(formValues)`)
      wiringComments.push(
        `  // ${sourceType}.${edge.sourceHandle ?? "output"} --[trigger]--> ${targetType}.trigger (calls trigger${cap})`,
      )
      continue
    }

    if (sourceType === "apiCall") {
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

    wiringComments.push(
      `  // ${sourceType}.${edge.sourceHandle ?? "output"} (${stateName}) --[${transform}]--> ${targetType}.${edge.targetHandle ?? "prop"}`,
    )
  }

  const sections = [
    apiCallHooks.join("\n\n"),
    stateLines.join("\n"),
    wiringComments.join("\n"),
  ].filter(Boolean)

  return {
    declarations: sections.join("\n\n"),
    hasState: stateLines.length > 0 || apiCallHooks.length > 0,
    triggerOverrides,
  }
}
