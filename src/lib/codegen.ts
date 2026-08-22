import { nodeRegistry } from "@/lib/nodeRegistry"
import type { CanvasEdge, CanvasNode } from "@/types/graph"
import type { ThemeTokens } from "@/store/themeStore"
import { themeTokensToStyle } from "@/store/themeStore"

type FormField = {
  name: string
  type: string
  required?: boolean
  placeholder?: string
}

const UI_COMPONENTS: Record<string, { exportName: string; importPath: string }> = {
  button: { exportName: "Button", importPath: "button" },
  input: { exportName: "Input", importPath: "input" },
  textarea: { exportName: "Textarea", importPath: "textarea" },
  checkbox: { exportName: "Checkbox", importPath: "checkbox" },
  switch: { exportName: "Switch", importPath: "switch" },
  select: { exportName: "Select", importPath: "select" },
  label: { exportName: "Label", importPath: "label" },
  badge: { exportName: "Badge", importPath: "badge" },
  card: { exportName: "Card", importPath: "card" },
  form: { exportName: "Card", importPath: "card" },
  tabs: { exportName: "Tabs", importPath: "tabs" },
  separator: { exportName: "Separator", importPath: "separator" },
  skeleton: { exportName: "Skeleton", importPath: "skeleton" },
}

function formatJsxProp(key: string, value: unknown): string {
  if (key === "options" || key === "fields") return ""
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
    .filter(
      ([key, value]) =>
        value !== undefined && key !== "options" && key !== "fields",
    )
    .map(([key, value]) => formatJsxProp(key, value))
    .join(" ")
}

function indent(code: string, spaces: number) {
  const pad = " ".repeat(spaces)
  return code
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n")
}

export function generateNodeCode(node: CanvasNode): string {
  const { componentType, props } = node.data
  const ui = UI_COMPONENTS[componentType]

  if (!ui || !nodeRegistry[componentType]) {
    return `{/* Unknown node: ${componentType} */}`
  }

  const propsString = buildPropsString(props as Record<string, unknown>)

  switch (componentType) {
    case "button":
      return `<Button${propsString ? ` ${propsString}` : ""}>${String(props.label ?? "Button")}</Button>`

    case "label":
      return `<Label${propsString ? ` ${propsString}` : ""}>${String(props.text ?? "Label")}</Label>`

    case "badge":
      return `<Badge${propsString ? ` ${propsString}` : ""}>${String(props.label ?? "Badge")}</Badge>`

    case "select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Option 1"]
      return `<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="${String(props.placeholder ?? "Select")}" />
  </SelectTrigger>
  <SelectContent>
${options.map((o) => `    <SelectItem value="${o}">${o}</SelectItem>`).join("\n")}
  </SelectContent>
</Select>`
    }

    case "form": {
      const fields = Array.isArray(props.fields)
        ? (props.fields as FormField[])
        : [{ name: "field1", type: "text", placeholder: "Field 1" }]
      const active = props.active !== undefined ? Boolean(props.active) : true
      return `<Card className="p-4">
  <CardHeader>
    <CardTitle>${String(props.title ?? "Untitled Form")}</CardTitle>
  </CardHeader>
  <CardContent>
    <fieldset disabled={${!active}} className="space-y-2">
${fields
  .map(
    (f) =>
      `      <Input name="${f.name}" type="${f.type}" placeholder="${f.placeholder ?? f.name}"${f.required ? " required" : ""} />`,
  )
  .join("\n")}
      <Button type="submit">Submit</Button>
    </fieldset>
  </CardContent>
</Card>`
    }

    case "card":
      return `<Card className="p-4">
  <CardHeader>
    <CardTitle>${String(props.title ?? "Card Title")}</CardTitle>
    <CardDescription>${String(props.description ?? "")}</CardDescription>
  </CardHeader>
</Card>`

    case "tabs":
      return `<Tabs defaultValue="tab-1" className="w-56">
  <TabsList>
    <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">Tab one content</TabsContent>
  <TabsContent value="tab-2">Tab two content</TabsContent>
</Tabs>`

    case "separator":
      return `<Separator className="my-2" />`

    case "skeleton":
      return `<Skeleton className="h-10 w-48" />`

    default:
      return `<${ui.exportName}${propsString ? ` ${propsString}` : ""} />`
  }
}

function buildImports(types: string[]): string {
  const lines = new Set<string>()

  for (const type of types) {
    const ui = UI_COMPONENTS[type]
    if (!ui) continue

    if (type === "card" || type === "form") {
      lines.add(
        `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"`,
      )
      if (type === "form") {
        lines.add(`import { Button } from "@/components/ui/button"`)
        lines.add(`import { Input } from "@/components/ui/input"`)
      }
    } else if (type === "select") {
      lines.add(
        `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`,
      )
    } else if (type === "tabs") {
      lines.add(
        `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"`,
      )
    } else {
      lines.add(
        `import { ${ui.exportName} } from "@/components/ui/${ui.importPath}"`,
      )
    }
  }

  return [...lines].join("\n")
}

function buildWiringBlock(edges: CanvasEdge[], nodes: CanvasNode[]): string {
  if (edges.length === 0) return ""

  const label = (id: string) =>
    nodes.find((n) => n.id === id)?.data.componentType ?? id.slice(0, 8)

  return `\n      {/* Wiring logic (implement in React state):\n${edges
    .map(
      (e) =>
        `         ${label(e.source!)}.${e.sourceHandle} → ${label(e.target!)}.${e.targetHandle}${e.data?.transform ? ` [${e.data.transform}]` : ""}`,
    )
    .join("\n")}\n      */}\n`
}

function buildThemeBlock(theme?: ThemeTokens): string {
  if (!theme) return ""
  const vars = themeTokensToStyle(theme)
  const css = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")
  return `\n/* Canvas theme tokens */\n/*
:root {
${css}
}
*/\n`
}

export function generateFullCode(
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  theme?: ThemeTokens,
): string {
  const types = [...new Set(nodes.map((n) => n.data.componentType))]
  const imports = buildImports(types)
  const componentsCode = nodes
    .map((node) => indent(generateNodeCode(node), 6))
    .join("\n")

  return `${imports}
${buildThemeBlock(theme)}
export default function GeneratedComponent() {
  return (
    <div className="space-y-4 p-4">${buildWiringBlock(edges, nodes)}
${componentsCode}
    </div>
  )
}
`
}
