import { nodeRegistry } from "@/lib/nodeRegistry"
import type { CanvasEdge, CanvasNode } from "@/types/graph"

const UI_COMPONENTS: Record<
  string,
  { exportName: string; importPath: string; tag?: string }
> = {
  button: { exportName: "Button", importPath: "button" },
  input: { exportName: "Input", importPath: "input" },
  textarea: { exportName: "Textarea", importPath: "textarea" },
  checkbox: { exportName: "Checkbox", importPath: "checkbox" },
  switch: { exportName: "Switch", importPath: "switch" },
  select: { exportName: "Select", importPath: "select" },
  label: { exportName: "Label", importPath: "label" },
  badge: { exportName: "Badge", importPath: "badge" },
  card: { exportName: "Card", importPath: "card" },
  form: { exportName: "Card", importPath: "card", tag: "form" },
}

function formatJsxProp(key: string, value: unknown): string {
  if (typeof value === "string") {
    return `${key}="${value.replace(/"/g, '\\"')}"`
  }
  if (typeof value === "boolean") {
    return value ? key : `${key}={false}`
  }
  return `${key}={${JSON.stringify(value)}}`
}

function buildPropsString(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => formatJsxProp(key, value))
    .join(" ")
}

export function generateNodeCode(node: CanvasNode): string {
  const { componentType, props } = node.data
  const config = nodeRegistry[componentType]
  const ui = UI_COMPONENTS[componentType]

  if (!config || !ui) {
    return `{/* Unknown node: ${componentType} */}`
  }

  const propsString = buildPropsString(props as Record<string, unknown>)

  if (componentType === "button") {
    return `<Button${propsString ? ` ${propsString}` : ""}>${String(props.label ?? "Button")}</Button>`
  }

  if (componentType === "label") {
    return `<Label${propsString ? ` ${propsString}` : ""}>${String(props.text ?? "Label")}</Label>`
  }

  if (componentType === "badge") {
    return `<Badge${propsString ? ` ${propsString}` : ""}>${String(props.label ?? "Badge")}</Badge>`
  }

  if (componentType === "form") {
    return `<Card className="p-4">
  <CardHeader>
    <CardTitle>${String(props.title ?? "Untitled Form")}</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Field 1" />
  </CardContent>
</Card>`
  }

  if (componentType === "card") {
    return `<Card className="p-4">
  <CardHeader>
    <CardTitle>${String(props.title ?? "Card Title")}</CardTitle>
    <CardDescription>${String(props.description ?? "")}</CardDescription>
  </CardHeader>
</Card>`
  }

  return `<${ui.exportName}${propsString ? ` ${propsString}` : ""} />`
}

export function generateFullCode(
  nodes: CanvasNode[],
  edges: CanvasEdge[],
): string {
  const types = [...new Set(nodes.map((n) => n.data.componentType))]

  const importLines = types
    .map((type) => {
      const ui = UI_COMPONENTS[type]
      if (!ui) return null
      const names =
        type === "card" || type === "form"
          ? "Card, CardContent, CardDescription, CardHeader, CardTitle"
          : ui.exportName
      return `import { ${names} } from "@/components/ui/${ui.importPath}"`
    })
    .filter(Boolean)

  const uniqueImports = [...new Set(importLines)]

  const componentsCode = nodes
    .map((node) => `      ${generateNodeCode(node).replace(/\n/g, "\n      ")}`)
    .join("\n")

  const wiringComments =
    edges.length > 0
      ? `\n      {/* Wiring:\n${edges
          .map(
            (e) =>
              `         ${e.source}.${e.sourceHandle} → ${e.target}.${e.targetHandle}${e.data?.transform ? ` (${e.data.transform})` : ""}`,
          )
          .join("\n")}\n      */}`
      : ""

  return `${uniqueImports.join("\n")}

export default function GeneratedComponent() {
  return (
    <div className="space-y-4 p-4">${wiringComments}
${componentsCode}
    </div>
  )
}
`
}
