import type { VariantProps } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import {
  CalendarDays,
  Inbox,
  MousePointerClick,
  Settings,
  Users,
} from "lucide-react";

import { Bubble, BubbleHeader, BubbleTimestamp } from "@/components/ui/bubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Message,
  MessageAvatar,
  MessageBody,
  MessageContent,
} from "@/components/ui/message";
import { MessageScroller } from "@/components/ui/message-scroller";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Marker } from "@/components/ui/marker";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button, type buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { NodeSizeMode, NodeState } from "@/types/graph";
import type { FormField, NodePreviewProps } from "./types";
import { nodeStyleToCss } from "@/theme/style-utils";


  
function fieldClass(sizeMode: NodeSizeMode | undefined, extra?: string) {
  return cn(sizeMode === "custom" ? "w-full" : "w-auto max-w-full", extra);
}

function wiredBoolean(
  props: Record<string, unknown>,
  state: NodeState,
  key: string,
  fallback = false,
): boolean {
  if (props[key] !== undefined) return Boolean(props[key]);
  if (state[key] !== undefined) return Boolean(state[key]);
  return fallback;
}

export function NodePreview({
  componentType,
  props,
  state,
  sizeMode = "default",
  style,
  onOutputChange,
  onOutputsChange,
}: NodePreviewProps) {
  const disabled = wiredBoolean(props, state, "disabled");
  const active = wiredBoolean(props, state, "active", true);
  const isCustom = sizeMode === "custom";
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const styleOverride = nodeStyleToCss(style);

  const emit = (key: string, value: boolean | string | number) => {
    onOutputChange?.(key, value);
  };

  const emitMany = (outputs: NodeState) => {
    onOutputsChange?.(outputs);
  };

  const wrap = (el: React.ReactNode) => {
    if (!style || Object.keys(styleOverride).length === 0) return el;
    return <div style={styleOverride}>{el}</div>;
  };

  let content: React.ReactNode = null;
  switch (componentType) {
    case "button":
      content = (
        <Button
          variant={
            props.variant as VariantProps<typeof buttonVariants>["variant"]
          }
          size={props.size as VariantProps<typeof buttonVariants>["size"]}
          disabled={disabled}
          className={isCustom ? "w-full" : undefined}
          aria-pressed={Boolean(state.pressed)}
          onClick={() => emit("pressed", !state.pressed)}
        >
          {String(props.label ?? "Button")}
        </Button>
      );
      break;

    case "input":
      content = (
        <Input
          type={String(props.inputType ?? "text")}
          placeholder={String(props.placeholder ?? "")}
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? undefined : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => emit("value", e.target.value)}
        />
      );
      break;

    case "textarea":
      content = (
        <Textarea
          placeholder={String(props.placeholder ?? "")}
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? "min-h-20" : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => emit("value", e.target.value)}
        />
      );
      break;

    case "checkbox":
      content = (
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={disabled}
            checked={Boolean(state.checked)}
            onCheckedChange={(checked) => emit("checked", checked === true)}
          />
          <span className="text-sm">{String(props.label ?? "Checkbox")}</span>
        </div>
      );
      break;

    case "switch":
      content = (
        <div className="flex items-center gap-2">
          <Switch
            disabled={disabled}
            checked={Boolean(state.checked)}
            onCheckedChange={(checked) => emit("checked", checked === true)}
          />
          <span className="text-sm">{String(props.label ?? "Switch")}</span>
        </div>
      );
      break;

    case "select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Option 1", "Option 2"];
      content = (
        <Select
          disabled={disabled}
          value={String(state.value ?? "")}
          onValueChange={(value) => emit("value", value)}
        >
          <SelectTrigger
            className={fieldClass(sizeMode, isCustom ? undefined : "w-48")}
          >
            <SelectValue placeholder={String(props.placeholder ?? "Select")} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      break;
    }

    case "card":
      content = (
        <Card className={cn("py-4", isCustom ? "w-full" : "w-56")}>
          <CardHeader className="px-4 pb-2">
            <CardTitle className="text-base">
              {String(props.title ?? "Card Title")}
            </CardTitle>
            <CardDescription>
              {String(props.description ?? "Card description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-0 text-xs text-muted-foreground">
            Card content
          </CardContent>
        </Card>
      );
      break;

    case "badge":
      content = (
        <Badge
          variant={
            props.variant as VariantProps<typeof badgeVariants>["variant"]
          }
        >
          {String(props.label ?? "Badge")}
        </Badge>
      );
      break;

    case "label":
      content = <Label>{String(props.text ?? "Label")}</Label>;
      break;

    case "form": {
      const fields = Array.isArray(props.fields)
        ? (props.fields as FormField[])
        : [{ name: "email", type: "email", placeholder: "Email" }];

      content = (
        <Card
          className={cn(
            "py-4",
            isCustom ? "w-full" : "w-60",
            !active && "opacity-50",
          )}
        >
          <CardHeader className="px-4 pb-2">
            <CardTitle className="text-base">
              {String(props.title ?? "Untitled Form")}
            </CardTitle>
            <CardDescription>
              {active ? "Form ready" : "Form inactive"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <fieldset disabled={!active} className="space-y-2 border-0 p-0">
              {fields.map((field) => (
                <Input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder ?? field.name}
                  required={field.required}
                  className="w-full"
                  value={formValues[field.name] ?? ""}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                />
              ))}
              <Button
                type="button"
                size="sm"
                disabled={!active}
                onClick={() => {
                  const isValid = fields.every(
                    (field) =>
                      !field.required ||
                      Boolean(formValues[field.name]?.trim()),
                  );
                  const payload = JSON.stringify(formValues);
                  emitMany({ submitted: true, isValid, payload });
                }}
              >
                Submit
              </Button>
            </fieldset>
          </CardContent>
        </Card>
      );
      break;
    }

    case "tabs": {
      const tabs = Array.isArray(props.tabs)
        ? (props.tabs as { id: string; label: string }[])
        : [
            { id: "tab-1", label: "Tab 1" },
            { id: "tab-2", label: "Tab 2" },
          ];
      const defaultValue = String(props.defaultValue ?? tabs[0]?.id ?? "tab-1");
      content = (
        <Tabs defaultValue={defaultValue} className={isCustom ? "w-full" : "w-56"}>
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.id} value={t.id} className="text-xs text-muted-foreground">
              {t.label} content
            </TabsContent>
          ))}
        </Tabs>
      );
      break;
    }

    case "separator":
      content = <Separator className={isCustom ? "w-full" : "w-48"} />;
      break;

    case "skeleton":
      content = (
        <Skeleton
          style={{
            width: String(props.width ?? "12rem"),
            height: String(props.height ?? "2.5rem"),
          }}
        />
      );
      break;

    case "button-group":
      content = (
        <ButtonGroup>
          <Button variant="outline">Copy</Button>
          <Button variant="outline">Paste</Button>
          <ButtonGroupSeparator />
          <ButtonGroupText className="text-xs">
            <Kbd>⌘</Kbd>
            <Kbd>V</Kbd>
          </ButtonGroupText>
        </ButtonGroup>
      );
      break;

    case "calendar":
      content = (
        <Calendar
          disabled={disabled}
          className={cn(
            "rounded-md border bg-background p-2",
            isCustom && "w-full",
          )}
          mode="single"
          selected={
            typeof state.value === "string" ? new Date(state.value) : undefined
          }
          onSelect={(date) => emit("value", date?.toISOString() ?? "")}
        />
      );
      break;

    case "field": {
      const error = String(props.error ?? "");
      content = (
        <div className={cn("w-56", isCustom && "w-full")}>
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor="preview-field-input">
              {String(props.label ?? "Username")}
            </FieldLabel>
            <Input
              id="preview-field-input"
              placeholder="ada@lovelace.dev"
              className="h-8"
              aria-invalid={Boolean(error)}
              value={String(state.value ?? "")}
              onChange={(e) => emit("value", e.target.value)}
            />
            {error ? (
              <FieldError>{error}</FieldError>
            ) : (
              <FieldDescription>
                {String(props.description ?? "")}
              </FieldDescription>
            )}
          </Field>
        </div>
      );
      break;
    }

    case "native-select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Apple", "Banana", "Cherry"];
      content = (
        <NativeSelect
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? undefined : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => {
            const target = e.target as HTMLSelectElement;
            const value =
              target.selectedIndex === 0
                ? ""
                : options[target.selectedIndex - 1];
            emit("value", value);
          }}
        >
          <option value="">{String(props.placeholder ?? "Select…")}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </NativeSelect>
      );
      break;
    }

    case "carousel": {
      const slideCount = Math.max(1, Number(props.slides) || 4);
      content = (
        <Carousel
          className={cn("w-full max-w-[240px]", isCustom && "max-w-none")}
        >
          <CarouselContent>
            {Array.from({ length: slideCount }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="flex aspect-video items-center justify-center rounded-md border bg-muted text-sm font-medium">
                  Slide {index + 1}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );
      break;
    }

    case "item":
      content = (
        <ItemGroup className={cn(isCustom ? "w-full" : "w-60")}>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Users aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{String(props.title ?? "Permissions")}</ItemTitle>
              <ItemDescription>
                {String(props.description ?? "")}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Switch
                checked
                onCheckedChange={() => undefined}
                aria-label="Toggle"
              />
            </ItemActions>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Settings aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>General settings</ItemTitle>
              <ItemDescription>Name, icon and defaults.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <MousePointerClick className="size-4 text-muted-foreground" />
            </ItemActions>
          </Item>
        </ItemGroup>
      );
      break;

    case "dialog": {
      const openWired =
        props.open !== undefined || state.open !== undefined;
      const openVal = wiredBoolean(props, state, "open", false);
      // controlled when wired, uncontrolled otherwise
      const dialogOpenProps = openWired
        ? {
            open: openVal,
            onOpenChange: (v: boolean) => {
              emit("open", v);
              emit("confirmed", v);
            },
          }
        : {};
      content = (
        <Dialog {...dialogOpenProps}>
          <DialogTrigger asChild>
            <Button variant="outline">
              {String(props.triggerLabel ?? "Open Dialog")}
            </Button>
          </DialogTrigger>
          <DialogContent style={Object.keys(styleOverride).length ? styleOverride : undefined}>
            <DialogHeader>
              <DialogTitle>{String(props.title ?? "Dialog")}</DialogTitle>
              <DialogDescription>
                {String(props.description ?? "")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => emit("confirmed", false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => emit("confirmed", true)}>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      break;
    }

    case "drawer": {
      const openWired =
        props.open !== undefined || state.open !== undefined;
      const openVal = wiredBoolean(props, state, "open", false);
      const drawerOpenProps = openWired
        ? {
            open: openVal,
            onOpenChange: (v: boolean) => emit("open", v),
          }
        : {};
      content = (
        <Drawer {...drawerOpenProps}>
          <DrawerTrigger asChild>
            <Button variant="outline">
              {String(props.triggerLabel ?? "Open Drawer")}
            </Button>
          </DrawerTrigger>
          <DrawerContent style={Object.keys(styleOverride).length ? styleOverride : undefined}>
            <DrawerHeader>
              <DrawerTitle>{String(props.title ?? "Drawer")}</DrawerTitle>
              <DrawerDescription>
                {String(props.description ?? "")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      );
      break;
    }

    case "hover-card":
      content = (
        <HoverCard>
          <HoverCardTrigger
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-sm font-medium underline decoration-dashed underline-offset-4"
          >
            {String(props.trigger ?? "@shadcn")}
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold">
                  {String(props.heading ?? "shadcn/ui")}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {String(props.bio ?? "")}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      );
      break;

    case "command": {
      const items = Array.isArray(props.items)
        ? (props.items as { id: string; label: string }[])
        : [
            { id: "calendar", label: "Calendar" },
            { id: "search", label: "Search Emoji" },
            { id: "settings", label: "Settings" },
          ];
      content = (
        <Command
          className={cn(
            "w-64 rounded-lg border shadow-none",
            isCustom && "w-full",
          )}
        >
          <CommandInput placeholder={String(props.placeholder ?? "Search…")} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {items.map((item) => (
                <CommandItem key={item.id} onSelect={() => emit("selected", item.label)}>
                  <CalendarDays aria-hidden="true" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      );
      break;
    }

    case "bubble": {
      const bubbleVariant = props.variant === "sent" ? "sent" : "received";
      content = (
        <Bubble
          variant={bubbleVariant}
          className={cn(isCustom && "max-w-full")}
        >
          {String(props.text ?? "")}
        </Bubble>
      );
      break;
    }

    case "message": {
      const messageVariant = props.variant === "sent" ? "sent" : "received";
      content = (
        <Message
          className={cn(
            messageVariant === "sent" && "flex-row-reverse",
            isCustom && "w-full",
          )}
        >
          <MessageAvatar name={String(props.role ?? "A")} />
          <MessageContent variant={messageVariant}>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {String(props.role ?? "User")}
            </span>
            <MessageBody
              variant={messageVariant}
              className={cn(isCustom && "max-w-full")}
            >
              {String(props.text ?? "")}
            </MessageBody>
          </MessageContent>
        </Message>
      );
      break;
    }

    case "message-scroller":
      content = (
        <div
          className={cn(
            "rounded-lg border bg-background",
            isCustom ? "w-full" : "w-64",
          )}
        >
          <MessageScroller>
            <Message>
              <MessageAvatar name="Ada" />
              <MessageContent variant="received">
                <MessageBody variant="received">
                  Morning! The new tokens landed.
                </MessageBody>
              </MessageContent>
            </Message>
            <Message className="flex-row-reverse">
              <MessageAvatar name="You" />
              <MessageContent variant="sent">
                <MessageBody variant="sent">Reviewing now.</MessageBody>
              </MessageContent>
            </Message>
            <Message>
              <MessageAvatar name="Ada" />
              <MessageContent variant="received">
                <MessageBody variant="received">
                  Also added the chart palette. 🎨
                </MessageBody>
                <BubbleTimestamp>09:42 AM</BubbleTimestamp>
              </MessageContent>
            </Message>
          </MessageScroller>
          <BubbleHeader className="justify-end border-t px-3 py-2 text-[10px]">
            Auto-scrolled to latest
          </BubbleHeader>
        </div>
      );
      break;

    case "empty": {
      const visible = wiredBoolean(props, state, "visible", true);
      if (!visible) return null;
      content = (
        <Empty className={cn(isCustom ? "w-full" : "w-56")}>
          <EmptyHeader>
            <EmptyMedia>
              <Inbox aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>{String(props.title ?? "No results")}</EmptyTitle>
            <EmptyDescription>
              {String(props.description ?? "")}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" variant="outline">
              Reset filters
            </Button>
          </EmptyContent>
        </Empty>
      );
      break;
    }

    case "chart": {
      const chartType = String(props.chartType ?? "bar") as "bar" | "line" | "pie";
      const dataMode = String(props.dataMode ?? "static");
      const staticRaw = String(props.staticData ?? "");
      let staticData: Record<string, unknown>[] = [
        { month: "Jan", desktop: 186, mobile: 80 },
        { month: "Feb", desktop: 305, mobile: 200 },
        { month: "Mar", desktop: 237, mobile: 120 },
        { month: "Apr", desktop: 173, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
      ];
      if (staticRaw) {
        try {
          const parsed = JSON.parse(staticRaw);
          if (Array.isArray(parsed) && parsed.length) staticData = parsed;
        } catch {}
      }
      const wiredRaw = (props.data ?? state.data) as unknown;
      let chartData = staticData;
      if (dataMode === "bound" && wiredRaw != null && String(wiredRaw).trim() !== "") {
        try {
          const parsed = JSON.parse(String(wiredRaw));
          if (Array.isArray(parsed)) chartData = parsed;
          else if (parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).data)) {
            chartData = (parsed as Record<string, unknown>).data as Record<string, unknown>[];
          } else if (parsed && typeof parsed === "object") {
            // single object wrapped
            chartData = [parsed as Record<string, unknown>];
          }
        } catch {
          // keep static if parse fails
        }
      }
      const chartConfig = {
        desktop: { label: "Desktop", color: "var(--chart-1)" },
        mobile: { label: "Mobile", color: "var(--chart-2)" },
      };
      const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
      content = (
        <ChartContainer
          config={chartConfig}
          className={cn("aspect-video w-64", isCustom && "w-full")}
        >
          {chartType === "line" ? (
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
            </LineChart>
          ) : chartType === "pie" ? (
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie data={chartData} dataKey="desktop" nameKey="month" cx="50%" cy="50%" outerRadius={60} label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={8} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          )}
        </ChartContainer>
      );
      break;
    }

    case "kbd":
      content = (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Press
          <KbdGroup>
            {String(props.keys ?? "Ctrl K")
              .split(/\s+/)
              .map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
          </KbdGroup>
          to open
        </div>
      );
      break;

    case "marker": {
      const text = String(props.text ?? "");
      const highlight = String(props.highlight ?? "").toLowerCase();
      if (!highlight || !text.toLowerCase().includes(highlight)) {
        content = <p className="max-w-56 text-sm leading-relaxed">{text}</p>;
      break;
      }
      const startIndex = text.toLowerCase().indexOf(highlight);
      const endIndex = startIndex + highlight.length;
      content = (
        <p
          className={cn(
            "max-w-56 text-sm leading-relaxed",
            isCustom && "max-w-none",
          )}
        >
          {text.slice(0, startIndex)}
          <Marker>{text.slice(startIndex, endIndex)}</Marker>
          {text.slice(endIndex)}
        </p>
      );
      break;
    }

    case "direction":
      content = (
        <DirectionProvider dir={props.dir === "rtl" ? "rtl" : "ltr"}>
          <div
            dir={props.dir === "rtl" ? "rtl" : "ltr"}
            className="flex items-center gap-2 rounded-md border px-3 py-2"
          >
            <Badge variant="secondary">
              {props.dir === "rtl" ? "RTL" : "LTR"}
            </Badge>
            <ButtonGroup>
              <Button variant="outline" size="sm">
                First
              </Button>
              <Button variant="outline" size="sm">
                Second
              </Button>
            </ButtonGroup>
          </div>
        </DirectionProvider>
      );
      break;

    case "toast": {
      const baseMessage = String(props.message ?? "");
      const successMessage = String(props.successMessage ?? baseMessage ?? "Success!");
      const errorMessage = String(props.errorMessage ?? baseMessage ?? "Something went wrong");
      const defaultIsError = props.variant === "error";
      const statusVariant = String(props.statusVariant ?? "auto");
      const trigger = Boolean(props.trigger ?? state.trigger);
      const statusStr = String(props.status ?? state.status ?? "");
      const isSuccessWired = Boolean(props.isSuccess ?? state.isSuccess);
      const isErrorWired = Boolean(props.isError ?? state.isError);

      const resolveVariant = (isSuccess: boolean, isError: boolean, status: string): { isError: boolean; message: string } => {
        if (statusVariant === "success") return { isError: false, message: successMessage || baseMessage };
        if (statusVariant === "error") return { isError: true, message: errorMessage || baseMessage };
        if (statusVariant === "info") return { isError: false, message: baseMessage };
        // auto: prioritise explicit error/success signals
        if (isError || status === "error") return { isError: true, message: errorMessage || baseMessage };
        if (isSuccess || status === "success") return { isError: false, message: successMessage || baseMessage };
        return { isError: defaultIsError, message: baseMessage };
      };

      const fireWith = (isSuccess: boolean, isError: boolean, status: string) => {
        const { isError: err, message } = resolveVariant(isSuccess, isError, status);
        if (err) toast.error(message || "Something went wrong");
        else toast.success(message || "Done");
        emit("fired", true);
      };

      // Manual trigger (generic wiring)
      const prevTrigger = useRef(trigger);
      useEffect(() => {
        if (trigger && !prevTrigger.current) {
          fireWith(isSuccessWired, isErrorWired, statusStr);
        }
        prevTrigger.current = trigger;
        // eslint-disable-next-line react-hooks/exhaustive-deps -- fire is stable per render inputs
      }, [trigger]);

      // Status-driven auto firing (when Form → apiCall → Toast status/isSuccess/isError wired)
      const prevSuccess = useRef(isSuccessWired);
      const prevError = useRef(isErrorWired);
      const prevStatus = useRef(statusStr);
      useEffect(() => {
        if (isSuccessWired && !prevSuccess.current) fireWith(true, false, statusStr);
        if (isErrorWired && !prevError.current) fireWith(false, true, statusStr);
        if (statusStr !== prevStatus.current) {
          if (statusStr === "success" && !isSuccessWired) fireWith(true, false, statusStr);
          if (statusStr === "error" && !isErrorWired) fireWith(false, true, statusStr);
        }
        prevSuccess.current = isSuccessWired;
        prevError.current = isErrorWired;
        prevStatus.current = statusStr;
        // eslint-disable-next-line react-hooks/exhaustive-deps -- fireWith is stable
      }, [isSuccessWired, isErrorWired, statusStr]);

      // Display variant with color combination: respect statusVariant and live status
      const display = resolveVariant(isSuccessWired, isErrorWired, statusStr);
      const displayIsError = display.isError;
      const displayLabel = statusStr === "success" ? successMessage : statusStr === "error" ? errorMessage : displayIsError ? "Fire error" : "Fire toast";
      const buttonVariant: VariantProps<typeof buttonVariants>["variant"] = displayIsError ? "destructive" : statusVariant === "info" ? "secondary" : "outline";

      content = (
        <div className={cn("space-y-1", isCustom && "w-full")}>
          <Button size="sm" variant={buttonVariant} disabled={disabled} onClick={() => fireWith(isSuccessWired, isErrorWired, statusStr)}>
            {trigger && !displayIsError ? "Firing…" : displayLabel}
          </Button>
          {(statusStr === "success" || statusStr === "error") && (
            <div className={cn("text-[10px] font-medium", statusStr === "success" ? "text-green-600" : "text-red-600")}>
              {statusStr === "success" ? successMessage : errorMessage}
            </div>
          )}
        </div>
      );
      break;
    }

    case "apiCall": {
      const status = (state.status as string) ?? "idle";
      const statusColor =
        {
          idle: "bg-muted text-muted-foreground",
          loading: "bg-blue-100 text-blue-700",
          success: "bg-green-100 text-green-700",
          error: "bg-red-100 text-red-700",
        }[status] ?? "bg-muted";

      content = (
        <div
          className={cn(
            "w-56 space-y-1.5 rounded-lg border bg-card p-3",
            isCustom && "w-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase">
              {String(props.method ?? "POST")}
            </span>
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium",
                statusColor,
              )}
            >
              {status}
            </span>
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {String(props.url ?? "") || "No URL set"}
          </div>
        </div>
      );
      break;
    }

    default:
      content = (
        <div className="text-xs text-muted-foreground">
          Unknown: {componentType}
        </div>
      );
      break;
  }
  return wrap(content as React.ReactNode);
}