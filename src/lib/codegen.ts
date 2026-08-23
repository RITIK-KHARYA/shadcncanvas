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
  "button-group": { exportName: "ButtonGroup", importPath: "button-group" },
  calendar: { exportName: "Calendar", importPath: "calendar" },
  field: { exportName: "Field", importPath: "field" },
  "native-select": {
    exportName: "NativeSelect",
    importPath: "native-select",
  },
  carousel: { exportName: "Carousel", importPath: "carousel" },
  item: { exportName: "Item", importPath: "item" },
  dialog: { exportName: "Dialog", importPath: "dialog" },
  drawer: { exportName: "Drawer", importPath: "drawer" },
  "hover-card": { exportName: "HoverCard", importPath: "hover-card" },
  command: { exportName: "Command", importPath: "command" },
  bubble: { exportName: "Bubble", importPath: "bubble" },
  message: { exportName: "Message", importPath: "message" },
  "message-scroller": {
    exportName: "MessageScroller",
    importPath: "message-scroller",
  },
  empty: { exportName: "Empty", importPath: "empty" },
  chart: { exportName: "ChartContainer", importPath: "chart" },
  kbd: { exportName: "Kbd", importPath: "kbd" },
  marker: { exportName: "Marker", importPath: "marker" },
  direction: { exportName: "DirectionProvider", importPath: "direction" },
  toast: { exportName: "Button", importPath: "button" },
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

    case "bubble":
      return `<Bubble variant="${String(props.variant ?? "received")}">
  ${String(props.text ?? "")}
</Bubble>`

    case "message":
      return `<Message>
  <MessageAvatar name="${String(props.role ?? "User")}" />
  <MessageContent variant="${String(props.variant ?? "received")}">
    <MessageBody variant="${String(props.variant ?? "received")}">${String(props.text ?? "")}</MessageBody>
  </MessageContent>
</Message>`

    case "message-scroller":
      return `<MessageScroller>
  {/* Message components */}
</MessageScroller>`

    case "empty":
      return `<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">Inbox</EmptyMedia>
    <EmptyTitle>${String(props.title ?? "No results")}</EmptyTitle>
    <EmptyDescription>${String(props.description ?? "")}</EmptyDescription>
  </EmptyHeader>
</Empty>`

    case "kbd":
      return `<KbdGroup>
${String(props.keys ?? "Ctrl K")
  .split(/\s+/)
  .map((key) => `  <Kbd>${key}</Kbd>`)
  .join("\n")}
</KbdGroup>`

    case "marker": {
      const text = String(props.text ?? "")
      const highlight = String(props.highlight ?? "")
      const index = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1
      if (index === -1) return text
      return `${text.slice(0, index)}<Marker>${text.slice(index, index + highlight.length)}</Marker>${text.slice(index + highlight.length)}`
    }

    case "field":
      return `<Field>
  <FieldLabel>${String(props.label ?? "Label")}</FieldLabel>
  <Input placeholder="..." />
  ${props.error ? `<FieldError>${String(props.error)}</FieldError>` : `<FieldDescription>${String(props.description ?? "")}</FieldDescription>`}
</Field>`

    case "native-select":
      return `<NativeSelect defaultValue="">
  <option value="" disabled>${String(props.placeholder ?? "Select…")}</option>
</NativeSelect>`

    case "carousel":
      return `<Carousel className="w-full max-w-xs">
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

    case "item":
      return `<Item variant="outline">
  <ItemMedia variant="icon">Icon</ItemMedia>
  <ItemContent>
    <ItemTitle>${String(props.title ?? "Title")}</ItemTitle>
    <ItemDescription>${String(props.description ?? "")}</ItemDescription>
  </ItemContent>
  <ItemActions>{/* controls */}</ItemActions>
</Item>`

    case "dialog":
      return `<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">${String(props.triggerLabel ?? "Open Dialog")}</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>${String(props.title ?? "Dialog")}</DialogTitle>
      <DialogDescription>${String(props.description ?? "")}</DialogDescription>
    </DialogHeader>
    <DialogFooter>{/* actions */}</DialogFooter>
  </DialogContent>
</Dialog>`

    case "drawer":
      return `<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">${String(props.triggerLabel ?? "Open Drawer")}</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>${String(props.title ?? "Drawer")}</DrawerTitle>
      <DrawerDescription>${String(props.description ?? "")}</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`

    case "hover-card":
      return `<HoverCard>
  <HoverCardTrigger href="#">${String(props.trigger ?? "@trigger")}</HoverCardTrigger>
  <HoverCardContent>${String(props.heading ?? "")} — ${String(props.bio ?? "")}</HoverCardContent>
</HoverCard>`

    case "command":
      return `<Command className="rounded-lg border shadow-none">
  <CommandInput placeholder="${String(props.placeholder ?? "Type a command...")}" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`

    case "chart":
      return `<ChartContainer config={chartConfig} className="aspect-video">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  </BarChart>
</ChartContainer>`

    case "toast":
      return `{/* import { toast } from "sonner" — fires on wired trigger or click */}
<Button variant="${props.variant === "error" ? "destructive" : "outline"}" onClick={() => toast.${props.variant === "error" ? "error" : "success"}("${String(props.message ?? "")}")}>
  Fire toast
</Button>`

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
