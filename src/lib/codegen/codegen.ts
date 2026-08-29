import type { CanvasEdge, CanvasNode } from "@/types/graph";
import type { ThemeTokens } from "@/store/theme-store";
import { themeTokensToStyle } from "@/store/theme-store";
import { nodeRegistry, UI_COMPONENTS } from "@/lib/registry";
import type { FormField } from "@/types/registry";
import { buildPropsString, indent } from "./helpers";
import { buildWiringBlock } from "./wiring";
import { buildImports } from "./imports";

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

export function generateNodeCode(
  node: CanvasNode,
  triggerOverrides?: Map<string, string>,
): string {
  const { componentType, props } = node.data;
  const ui = UI_COMPONENTS[componentType];

  if (!ui || !nodeRegistry[componentType]) {
    return `{/* Unknown node: ${componentType} */}`;
  }

  const propsString = buildPropsString(props as Record<string, unknown>);

  switch (componentType) {
    case "button": {
      const override = triggerOverrides?.get(node.id);
      const onClickAttr = override ? ` onClick={() => ${override}}` : "";
      return `<Button${propsString ? ` ${propsString}` : ""}${onClickAttr}>${String(props.label ?? "Button")}</Button>`;
    }

    case "label":
      return `<Label${propsString ? ` ${propsString}` : ""}>${String(props.text ?? "Label")}</Label>`;

    case "badge":
      return `<Badge${propsString ? ` ${propsString}` : ""}>${String(props.label ?? "Badge")}</Badge>`;

    case "select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Option 1"];
      return `<Select>
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
      const active = props.active !== undefined ? Boolean(props.active) : true;
      const override = triggerOverrides?.get(node.id);
      const submitAttr = override ? ` onClick={() => ${override}}` : "";
      return `<Card className="p-4">
  <CardHeader>
    <CardTitle>${String(props.title ?? "Untitled Form")}</CardTitle>
  </CardHeader>
  <CardContent>
    <fieldset disabled={${!active}} className="space-y-2">
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
      return `<Card className="p-4">
  <CardHeader>
    <CardTitle>${String(props.title ?? "Card Title")}</CardTitle>
    <CardDescription>${String(props.description ?? "")}</CardDescription>
  </CardHeader>
</Card>`;

    case "tabs":
      return `<Tabs defaultValue="tab-1" className="w-56">
  <TabsList>
    <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">Tab one content</TabsContent>
  <TabsContent value="tab-2">Tab two content</TabsContent>
</Tabs>`;

    case "separator":
      return `<Separator className="my-2" />`;

    case "skeleton":
      return `<Skeleton className="h-10 w-48" />`;

    case "bubble":
      return `<Bubble variant="${String(props.variant ?? "received")}">
  ${String(props.text ?? "")}
</Bubble>`;

    case "message":
      return `<Message>
  <MessageAvatar name="${String(props.role ?? "User")}" />
  <MessageContent variant="${String(props.variant ?? "received")}">
    <MessageBody variant="${String(props.variant ?? "received")}">${String(props.text ?? "")}</MessageBody>
  </MessageContent>
</Message>`;

    case "message-scroller":
      return `<MessageScroller>
  {/* Message components */}
</MessageScroller>`;

    case "empty":
      return `<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">Inbox</EmptyMedia>
    <EmptyTitle>${String(props.title ?? "No results")}</EmptyTitle>
    <EmptyDescription>${String(props.description ?? "")}</EmptyDescription>
  </EmptyHeader>
</Empty>`;

    case "input":
      return `<Input placeholder="${String(props.placeholder ?? "Enter text")}" type="${String(props.inputType ?? "text")}" />`;

    case "textarea":
      return `<Textarea placeholder="${String(props.placeholder ?? "Enter message")}" />`;

    case "checkbox":
      return `<div className="flex items-center gap-2"><Checkbox /><span className="text-sm">${String(props.label ?? "Checkbox")}</span></div>`;

    case "switch":
      return `<div className="flex items-center gap-2"><Switch /><span className="text-sm">${String(props.label ?? "Switch")}</span></div>`;

    case "kbd":
      return `<KbdGroup>
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
      return `<Field>
  <FieldLabel>${String(props.label ?? "Label")}</FieldLabel>
  <Input placeholder="..." />
  ${props.error ? `<FieldError>${String(props.error)}</FieldError>` : `<FieldDescription>${String(props.description ?? "")}</FieldDescription>`}
</Field>`;

    case "native-select":
      return `<NativeSelect defaultValue="">
  <option value="" disabled>${String(props.placeholder ?? "Select…")}</option>
</NativeSelect>`;

    case "carousel":
      return `<Carousel className="w-full max-w-xs">
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`;

    case "item":
      return `<Item variant="outline">
  <ItemMedia variant="icon">Icon</ItemMedia>
  <ItemContent>
    <ItemTitle>${String(props.title ?? "Title")}</ItemTitle>
    <ItemDescription>${String(props.description ?? "")}</ItemDescription>
  </ItemContent>
  <ItemActions>{/* controls */}</ItemActions>
</Item>`;

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
</Dialog>`;

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
</Drawer>`;

    case "hover-card":
      return `<HoverCard>
  <HoverCardTrigger href="#">${String(props.trigger ?? "@trigger")}</HoverCardTrigger>
  <HoverCardContent>${String(props.heading ?? "")} — ${String(props.bio ?? "")}</HoverCardContent>
</HoverCard>`;

    case "command":
      return `<Command className="rounded-lg border shadow-none">
  <CommandInput placeholder="${String(props.placeholder ?? "Type a command...")}" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`;

    case "chart":
      return `<ChartContainer config={chartConfig} className="aspect-video">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  </BarChart>
</ChartContainer>`;

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
<div className="text-xs text-muted-foreground">
  {${varBase}Status === "loading" && "Loading..."}
  {${varBase}Status === "error" && ${varBase}Error}
</div>`;
    }

    default:
      return `<${ui.exportName}${propsString ? ` ${propsString}` : ""} />`;
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
    .map((node) => indent(generateNodeCode(node, wiring.triggerOverrides), 6))
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
