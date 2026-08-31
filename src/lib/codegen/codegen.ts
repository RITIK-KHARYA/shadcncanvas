import type { CanvasEdge, CanvasNode } from "@/types/graph";
import type { ThemeTokens } from "@/store/theme-store";
import { themeTokensToStyle } from "@/store/theme-store";
import { nodeRegistry, UI_COMPONENTS } from "@/lib/registry";
import type { FormField } from "@/types/registry";
import { buildPropsString, indent } from "./helpers";
import { buildWiringBlock } from "./wiring";
import { buildImports } from "./imports";
import { nodeStyleToCss } from "@/theme/style-utils";
import type { NodeStyleOverride } from "@/types/graph";

function buildThemeBlock(theme?: ThemeTokens): string {
  if (!theme) return "";
  const vars = themeTokensToStyle(theme);
  const css = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `\n/* Canvas theme tokens */\n/*
:root {
${css}
}
*/\n`;
}

function buildInlineStyleAttr(style?: NodeStyleOverride): string {
  const css = nodeStyleToCss(style as NodeStyleOverride)
  const entries = Object.entries(css).filter(([, v]) => v !== undefined)
  if (entries.length === 0) return ""
  const styleObj = entries
    .map(([k, v]) => `${k}: ${typeof v === "string" ? `"${String(v).replace(/"/g, '\\"')}"` : String(v)}`)
    .join(", ")
  return ` style={{ ${styleObj} }}`
}

export function generateNodeCode(
  node: CanvasNode,
  triggerOverrides?: Map<string, string>,
  propOverrides?: Map<string, Map<string, string>>,
): string {
  const { componentType, props } = node.data;
  const ui = UI_COMPONENTS[componentType];

  if (!ui || !nodeRegistry[componentType]) {
    return `{/* Unknown node: ${componentType} */}`;
  }

  const nodeProps = propOverrides?.get(node.id);
  const filteredProps = nodeProps
    ? Object.fromEntries(
        Object.entries(props as Record<string, unknown>).filter(
          ([k]) => !nodeProps.has(k),
        ),
      )
    : (props as Record<string, unknown>);
  const propsString = buildPropsString(filteredProps);
  const dynamicProps = nodeProps
    ? " " +
      [...nodeProps.entries()]
        .map(([k, expr]) => `${k}={${expr}}`)
        .join(" ")
    : "";
  const styleAttr = buildInlineStyleAttr(node.data.style as NodeStyleOverride);

  switch (componentType) {
    case "button": {
      const override = triggerOverrides?.get(node.id);
      const onClickAttr = override ? ` onClick={() => ${override}}` : "";
      return `<Button${propsString ? ` ${propsString}` : ""}${dynamicProps}${styleAttr}${onClickAttr}>${String(props.label ?? "Button")}</Button>`;
    }

    case "label":
      return `<Label${propsString ? ` ${propsString}` : ""}${styleAttr}>${String(props.text ?? "Label")}</Label>`;

    case "badge":
      return `<Badge${propsString ? ` ${propsString}` : ""}${styleAttr}>${String(props.label ?? "Badge")}</Badge>`;

    case "select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Option 1"];
      return `<Select${styleAttr}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="${String(props.placeholder ?? "Select")}" />
  </SelectTrigger>
  <SelectContent>
${options.map((o) => `    <SelectItem value="${o}">${o}</SelectItem>`).join("\n")}
  </SelectContent>
</Select>`;
    }

    case "form": {
      const fields = Array.isArray(props.fields)
        ? (props.fields as FormField[])
        : [{ name: "field1", type: "text", placeholder: "Field 1" }];
      const activeExpr =
        propOverrides?.get(node.id)?.get("active") ??
        (props.active !== undefined ? String(Boolean(props.active)) : "true");
      const override = triggerOverrides?.get(node.id);
      const submitAttr = override ? ` onClick={() => ${override}}` : "";
      return `<Card className="p-4"${styleAttr}>
  <CardHeader>
    <CardTitle>${String(props.title ?? "Untitled Form")}</CardTitle>
  </CardHeader>
  <CardContent>
    <fieldset disabled={!(${activeExpr})} className="space-y-2">
${fields
  .map(
    (f) =>
      `      <Input name="${f.name}" type="${f.type}" placeholder="${f.placeholder ?? f.name}"${f.required ? " required" : ""} value={formValues["${f.name}"] ?? ""} onChange={(e) => setFormValues((prev) => ({ ...prev, ["${f.name}"]: e.target.value }))} />`,
  )
  .join("\n")}
      <Button type="button"${submitAttr}>Submit</Button>
    </fieldset>
  </CardContent>
</Card>`;
    }

    case "card":
      return `<Card className="p-4"${styleAttr}>
  <CardHeader>
    <CardTitle>${String(props.title ?? "Card Title")}</CardTitle>
    <CardDescription>${String(props.description ?? "")}</CardDescription>
  </CardHeader>
</Card>`;

    case "tabs": {
      const tabs = Array.isArray(props.tabs)
        ? (props.tabs as { id: string; label: string }[])
        : [
            { id: "tab-1", label: "Tab 1" },
            { id: "tab-2", label: "Tab 2" },
          ];
      const dv = String(props.defaultValue ?? tabs[0]?.id ?? "tab-1");
      return `<Tabs defaultValue="${dv}" className="w-56"${styleAttr}>
  <TabsList>
${tabs.map((t) => `    <TabsTrigger value="${t.id}">${t.label}</TabsTrigger>`).join("\n")}
  </TabsList>
${tabs.map((t) => `  <TabsContent value="${t.id}">${t.label} content</TabsContent>`).join("\n")}
</Tabs>`;
    }

    case "separator":
      return `<Separator className="my-2"${styleAttr} />`;

    case "skeleton":
      return `<Skeleton className="h-10 w-48"${styleAttr} />`;

    case "bubble":
      return `<Bubble variant="${String(props.variant ?? "received")}"${styleAttr}>
  ${String(props.text ?? "")}
</Bubble>`;

    case "message":
      return `<Message${styleAttr}>
  <MessageAvatar name="${String(props.role ?? "User")}" />
  <MessageContent variant="${String(props.variant ?? "received")}">
    <MessageBody variant="${String(props.variant ?? "received")}">${String(props.text ?? "")}</MessageBody>
  </MessageContent>
</Message>`;

    case "message-scroller":
      return `<MessageScroller${styleAttr}>
  {/* Message components */}
</MessageScroller>`;

    case "empty": {
      const visibleExpr = nodeProps?.get("visible") ?? (props.visible !== undefined ? String(Boolean(props.visible)) : "true");
      const emptyJsx = `<Empty${styleAttr}>
  <EmptyHeader>
    <EmptyMedia variant="icon">Inbox</EmptyMedia>
    <EmptyTitle>${String(props.title ?? "No results")}</EmptyTitle>
    <EmptyDescription>${String(props.description ?? "")}</EmptyDescription>
  </EmptyHeader>
</Empty>`;
      if (visibleExpr === "false") return `{/* Empty hidden (visible=false) */}`;
      if (visibleExpr !== "true") return `{${visibleExpr} ? (${emptyJsx}) : null}`;
      return emptyJsx;
    }

    case "input": {
      const dis = nodeProps?.get("disabled") ? ` disabled={${nodeProps.get("disabled")}}` : "";
      return `<Input placeholder="${String(props.placeholder ?? "Enter text")}" type="${String(props.inputType ?? "text")}"${dis}${styleAttr} />`;
    }

    case "textarea": {
      const dis = nodeProps?.get("disabled") ? ` disabled={${nodeProps.get("disabled")}}` : "";
      return `<Textarea placeholder="${String(props.placeholder ?? "Enter message")}"${dis}${styleAttr} />`;
    }

    case "checkbox": {
      const dis = nodeProps?.get("disabled") ? ` disabled={${nodeProps.get("disabled")}}` : "";
      return `<div className="flex items-center gap-2"${styleAttr}><Checkbox${dis} /><span className="text-sm">${String(props.label ?? "Checkbox")}</span></div>`;
    }

    case "switch": {
      const dis = nodeProps?.get("disabled") ? ` disabled={${nodeProps.get("disabled")}}` : "";
      return `<div className="flex items-center gap-2"${styleAttr}><Switch${dis} /><span className="text-sm">${String(props.label ?? "Switch")}</span></div>`;
    }

    case "kbd":
      return `<KbdGroup${styleAttr}>
${String(props.keys ?? "Ctrl K")
  .split(/\s+/)
  .map((key) => `  <Kbd>${key}</Kbd>`)
  .join("\n")}
</KbdGroup>`;

    case "marker": {
      const text = String(props.text ?? "");
      const highlight = String(props.highlight ?? "");
      const index = highlight
        ? text.toLowerCase().indexOf(highlight.toLowerCase())
        : -1;
      if (index === -1) return text;
      return `${text.slice(0, index)}<Marker>${text.slice(index, index + highlight.length)}</Marker>${text.slice(index + highlight.length)}`;
    }

    case "field":
      return `<Field${styleAttr}>
  <FieldLabel>${String(props.label ?? "Label")}</FieldLabel>
  <Input placeholder="..." />
  ${props.error ? `<FieldError>${String(props.error)}</FieldError>` : `<FieldDescription>${String(props.description ?? "")}</FieldDescription>`}
</Field>`;

    case "native-select":
      return `<NativeSelect defaultValue=""${styleAttr}>
  <option value="" disabled>${String(props.placeholder ?? "Select…")}</option>
</NativeSelect>`;

    case "carousel":
      return `<Carousel className="w-full max-w-xs"${styleAttr}>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

    case "item":
      return `<Item variant="outline"${styleAttr}>
  <ItemMedia variant="icon">Icon</ItemMedia>
  <ItemContent>
    <ItemTitle>${String(props.title ?? "Title")}</ItemTitle>
    <ItemDescription>${String(props.description ?? "")}</ItemDescription>
  </ItemContent>
  <ItemActions>{/* controls */}</ItemActions>
</Item>`;

    case "dialog": {
      const openExpr = nodeProps?.get("open");
      const openAttr = openExpr
        ? (() => {
            const base = openExpr.replace(/^!/, "").match(/^[a-zA-Z0-9_]+/)?.[0] ?? "open";
            const setter = `set${base.charAt(0).toUpperCase()}${base.slice(1)}`;
            return ` open={${openExpr}} onOpenChange={${setter}}`;
          })()
        : "";
      return `<Dialog${openAttr}>
  <DialogTrigger asChild>
    <Button variant="outline">${String(props.triggerLabel ?? "Open Dialog")}</Button>
  </DialogTrigger>
  <DialogContent${styleAttr}>
    <DialogHeader>
      <DialogTitle>${String(props.title ?? "Dialog")}</DialogTitle>
      <DialogDescription>${String(props.description ?? "")}</DialogDescription>
    </DialogHeader>
    <DialogFooter>{/* actions */}</DialogFooter>
  </DialogContent>
</Dialog>`;
    }

    case "drawer": {
      const openExpr = nodeProps?.get("open");
      const openAttr = openExpr
        ? (() => {
            const base = openExpr.replace(/^!/, "").match(/^[a-zA-Z0-9_]+/)?.[0] ?? "open";
            const setter = `set${base.charAt(0).toUpperCase()}${base.slice(1)}`;
            return ` open={${openExpr}} onOpenChange={${setter}}`;
          })()
        : "";
      return `<Drawer${openAttr}>
  <DrawerTrigger asChild>
    <Button variant="outline">${String(props.triggerLabel ?? "Open Drawer")}</Button>
  </DrawerTrigger>
  <DrawerContent${styleAttr}>
    <DrawerHeader>
      <DrawerTitle>${String(props.title ?? "Drawer")}</DrawerTitle>
      <DrawerDescription>${String(props.description ?? "")}</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`;
    }

    case "hover-card":
      return `<HoverCard${styleAttr}>
  <HoverCardTrigger href="#">${String(props.trigger ?? "@trigger")}</HoverCardTrigger>
  <HoverCardContent>${String(props.heading ?? "")} — ${String(props.bio ?? "")}</HoverCardContent>
</HoverCard>`;

    case "command":
      return `<Command className="rounded-lg border shadow-none"${styleAttr}>
  <CommandInput placeholder="${String(props.placeholder ?? "Type a command...")}" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`;

    case "chart": {
      const chartType = String(props.chartType ?? "bar");
      const dataMode = String(props.dataMode ?? "static");
      const staticRaw = String(props.staticData ?? "[]");
      let staticArray = "[]";
      try {
        const parsed = JSON.parse(staticRaw);
        staticArray = JSON.stringify(parsed);
      } catch {
        staticArray = "[]";
      }
      const wiredExpr = nodeProps?.get("data");
      let dataExpr = staticArray;
      if (dataMode === "bound" && wiredExpr) {
        dataExpr = `(() => { try { const _r = ${wiredExpr}; const _p = typeof _r === "string" ? JSON.parse(_r as unknown as string) : _r; if (Array.isArray(_p)) return _p; if (_p && typeof _p === "object" && Array.isArray((_p as Record<string, unknown>).data)) return (_p as Record<string, unknown>).data as unknown[]; return ${staticArray}; } catch { return ${staticArray}; } })()`;
      }
      const cfg = `{ desktop: { label: "Desktop", color: "var(--chart-1)" }, mobile: { label: "Mobile", color: "var(--chart-2)" } }`;
      if (chartType === "line") {
        return `<ChartContainer config={${cfg}} className="aspect-video"${styleAttr}>
  <LineChart accessibilityLayer data={${dataExpr}}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
    <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
  </LineChart>
</ChartContainer>`;
      }
      if (chartType === "pie") {
        return `<ChartContainer config={${cfg}} className="aspect-video"${styleAttr}>
  <PieChart>
    <ChartTooltip content={<ChartTooltipContent />} />
    <Pie data={${dataExpr}} dataKey="desktop" nameKey="month" cx="50%" cy="50%" outerRadius={60} label>
      {(${dataExpr} as unknown[]).slice(0,5).map((_: unknown, i: number) => (
        <Cell key={i} fill={\`var(--chart-\${(i % 5) + 1})\`} />
      ))}
    </Pie>
  </PieChart>
</ChartContainer>`;
      }
      return `<ChartContainer config={${cfg}} className="aspect-video"${styleAttr}>
  <BarChart accessibilityLayer data={${dataExpr}}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  </BarChart>
</ChartContainer>`;
    }

    case "toast": {
      // Toast is handled via wiring effects (apiCall -> toast). Render placeholder so node is visible in export.
      const msg = String(props.message ?? "Done");
      const successMsg = String(props.successMessage ?? msg);
      const errorMsg = String(props.errorMessage ?? msg);
      const variant = String(props.variant ?? "success");
      const color = String(props.statusVariant ?? "auto");
      return `{/* Toast (${variant}/${color}): success="${successMsg}" error="${errorMsg}" - via wiring effect */}`;
    }

    case "apiCall": {
      const varBase = `api${node.id.slice(0, 4)}`;
      return `{/* API call node — see generated hook above */}
<div className="text-xs text-muted-foreground"${styleAttr}>
  {${varBase}Status === "loading" && "Loading..."}
  {${varBase}Status === "error" && ${varBase}Error}
</div>`;
    }

    default:
      return `<${ui.exportName}${propsString ? ` ${propsString}` : ""}${dynamicProps}${styleAttr} />`;
  }
}

export function generateFullCode(
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  theme?: ThemeTokens,
): string {
  const types = [...new Set(nodes.map((n) => n.data.componentType))];
  const imports = buildImports(types);
  const wiring = buildWiringBlock(edges, nodes);
  const componentsCode = nodes
    .map((node) => indent(generateNodeCode(node, wiring.triggerOverrides, wiring.propOverrides), 6))
    .join("\n");

  const reactImport = wiring.hasState
    ? `import { useState } from "react"\n`
    : "";
  const wiringBlock = wiring.declarations
    ? `${indent(wiring.declarations, 0)}\n\n`
    : "";

  return `${reactImport}${imports}
${buildThemeBlock(theme)}
export default function GeneratedComponent() {
${wiringBlock}  return (
    <div className="space-y-4 p-4">
${componentsCode}
    </div>
  )
}
`;
}
