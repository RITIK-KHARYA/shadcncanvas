import type { VariantProps } from "class-variance-authority"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  CalendarDays,
  Inbox,
  MousePointerClick,
  Settings,
  Users,
} from "lucide-react"

import {
  Bubble,
  BubbleHeader,
  BubbleTimestamp,
} from "@/components/ui/bubble"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Message,
  MessageAvatar,
  MessageBody,
  MessageContent,
} from "@/components/ui/message"
import { MessageScroller } from "@/components/ui/message-scroller"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DirectionProvider } from "@/components/ui/direction"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Marker } from "@/components/ui/marker"
import { NativeSelect } from "@/components/ui/native-select"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Badge, type badgeVariants } from "@/components/ui/badge"
import { Button, type buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { NodeSizeMode, NodeState } from "@/types/graph"

type FormField = {
  name: string
  type: string
  required?: boolean
  placeholder?: string
}

type NodePreviewProps = {
  componentType: string
  props: Record<string, unknown>
  state: NodeState
  sizeMode?: NodeSizeMode
  onOutputChange?: (
    outputKey: string,
    value: boolean | string | number,
  ) => void
  onOutputsChange?: (outputs: NodeState) => void
}

function fieldClass(sizeMode: NodeSizeMode | undefined, extra?: string) {
  return cn(
    sizeMode === "custom" ? "w-full" : "w-auto max-w-full",
    extra,
  )
}

function wiredBoolean(
  props: Record<string, unknown>,
  state: NodeState,
  key: string,
  fallback = false,
): boolean {
  if (props[key] !== undefined) return Boolean(props[key])
  if (state[key] !== undefined) return Boolean(state[key])
  return fallback
}

export function NodePreview({
  componentType,
  props,
  state,
  sizeMode = "default",
  onOutputChange,
  onOutputsChange,
}: NodePreviewProps) {
  const disabled = wiredBoolean(props, state, "disabled")
  const active = wiredBoolean(props, state, "active", true)
  const isCustom = sizeMode === "custom"

  const emit = (key: string, value: boolean | string | number) => {
    onOutputChange?.(key, value)
  }

  const emitMany = (outputs: NodeState) => {
    onOutputsChange?.(outputs)
  }

  switch (componentType) {
    case "button":
      return (
        <Button
          variant={props.variant as VariantProps<typeof buttonVariants>["variant"]}
          size={props.size as VariantProps<typeof buttonVariants>["size"]}
          disabled={disabled}
          className={isCustom ? "w-full" : undefined}
          aria-pressed={Boolean(state.pressed)}
          onClick={() => emit("pressed", !Boolean(state.pressed))}
        >
          {String(props.label ?? "Button")}
        </Button>
      )

    case "input":
      return (
        <Input
          type={String(props.inputType ?? "text")}
          placeholder={String(props.placeholder ?? "")}
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? undefined : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => emit("value", e.target.value)}
        />
      )

    case "textarea":
      return (
        <Textarea
          placeholder={String(props.placeholder ?? "")}
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? "min-h-20" : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => emit("value", e.target.value)}
        />
      )

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={disabled}
            checked={Boolean(state.checked)}
            onCheckedChange={(checked) => emit("checked", checked === true)}
          />
          <span className="text-sm">{String(props.label ?? "Checkbox")}</span>
        </div>
      )

    case "switch":
      return (
        <div className="flex items-center gap-2">
          <Switch
            disabled={disabled}
            checked={Boolean(state.checked)}
            onCheckedChange={(checked) => emit("checked", checked === true)}
          />
          <span className="text-sm">{String(props.label ?? "Switch")}</span>
        </div>
      )

    case "select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Option 1", "Option 2"]
      return (
        <Select
          disabled={disabled}
          value={String(state.value ?? "")}
          onValueChange={(value) => emit("value", value)}
        >
          <SelectTrigger className={fieldClass(sizeMode, isCustom ? undefined : "w-48")}>
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
      )
    }

    case "card":
      return (
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
      )

    case "badge":
      return (
        <Badge
          variant={
            props.variant as VariantProps<typeof badgeVariants>["variant"]
          }
        >
          {String(props.label ?? "Badge")}
        </Badge>
      )

    case "label":
      return <Label>{String(props.text ?? "Label")}</Label>

    case "form": {
      const fields = Array.isArray(props.fields)
        ? (props.fields as FormField[])
        : [{ name: "email", type: "email", placeholder: "Email" }]

      return (
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
                />
              ))}
              <Button
                type="button"
                size="sm"
                disabled={!active}
                onClick={() => {
                  const isValid = fields.every(
                    (field) => !field.required || Boolean(field.name),
                  )
                  emitMany({ submitted: true, isValid })
                }}
              >
                Submit
              </Button>
            </fieldset>
          </CardContent>
        </Card>
      )
    }

    case "tabs":
      return (
        <Tabs defaultValue="tab-1" className={isCustom ? "w-full" : "w-56"}>
          <TabsList>
            <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-1" className="text-xs text-muted-foreground">
            Tab one content
          </TabsContent>
          <TabsContent value="tab-2" className="text-xs text-muted-foreground">
            Tab two content
          </TabsContent>
        </Tabs>
      )

    case "separator":
      return <Separator className={isCustom ? "w-full" : "w-48"} />

    case "skeleton":
      return (
        <Skeleton
          style={{
            width: String(props.width ?? "12rem"),
            height: String(props.height ?? "2.5rem"),
          }}
        />
      )

    case "button-group":
      return (
        <ButtonGroup>
          <Button variant="outline">Copy</Button>
          <Button variant="outline">Paste</Button>
          <ButtonGroupSeparator />
          <ButtonGroupText className="text-xs">
            <Kbd>⌘</Kbd>
            <Kbd>V</Kbd>
          </ButtonGroupText>
        </ButtonGroup>
      )

    case "calendar":
      return (
        <Calendar
          disabled={disabled}
          className={cn("rounded-md border bg-background p-2", isCustom && "w-full")}
          mode="single"
          selected={
            typeof state.value === "string" ? new Date(state.value) : undefined
          }
          onSelect={(date) => emit("value", date?.toISOString() ?? "")}
        />
      )

    case "field": {
      const error = String(props.error ?? "")
      return (
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
      )
    }

    case "native-select": {
      const options = Array.isArray(props.options)
        ? (props.options as string[])
        : ["Apple", "Banana", "Cherry"]
      return (
        <NativeSelect
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? undefined : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => {
            const target = e.target as HTMLSelectElement
            const value =
              target.selectedIndex === 0 ? "" : options[target.selectedIndex - 1]
            emit("value", value)
          }}
        >
          <option value="">{String(props.placeholder ?? "Select…")}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </NativeSelect>
      )
    }

    case "carousel": {
      const slideCount = Math.max(
        2,
        Math.min(10, Number(props.slides ?? 4) || 4),
      )
      return (
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
      )
    }

    case "item":
      return (
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
              <Switch checked onCheckedChange={() => undefined} aria-label="Toggle" />
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
      )

    case "dialog":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{String(props.triggerLabel ?? "Open Dialog")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{String(props.title ?? "Dialog")}</DialogTitle>
              <DialogDescription>
                {String(props.description ?? "")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => emit("confirmed", false)}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={() => emit("confirmed", true)}>Confirm</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

    case "drawer":
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">{String(props.triggerLabel ?? "Open Drawer")}</Button>
          </DrawerTrigger>
          <DrawerContent>
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
      )

    case "hover-card":
      return (
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
      )

    case "command":
      return (
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
              {["Calendar", "Search Emoji", "Calculator"].map((item) => (
                <CommandItem
                  key={item}
                  onSelect={() => emit("selected", item)}
                >
                  <CalendarDays aria-hidden="true" />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Settings">
              <CommandItem onSelect={() => emit("selected", "Profile")}>
                <Users aria-hidden="true" />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      )

    case "bubble": {
      const bubbleVariant =
        props.variant === "sent" ? "sent" : "received"
      return (
        <Bubble variant={bubbleVariant} className={cn(isCustom && "max-w-full")}>
          {String(props.text ?? "")}
        </Bubble>
      )
    }

    case "message": {
      const messageVariant = props.variant === "sent" ? "sent" : "received"
      return (
        <Message className={cn(messageVariant === "sent" && "flex-row-reverse", isCustom && "w-full")}>
          <MessageAvatar name={String(props.role ?? "A")} />
          <MessageContent variant={messageVariant}>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {String(props.role ?? "User")}
            </span>
            <MessageBody variant={messageVariant} className={cn(isCustom && "max-w-full")}>
              {String(props.text ?? "")}
            </MessageBody>
          </MessageContent>
        </Message>
      )
    }

    case "message-scroller":
      return (
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
      )

    case "empty":
      return (
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
      )

    case "chart": {
      const chartData = [
        { month: "Jan", desktop: 186, mobile: 80 },
        { month: "Feb", desktop: 305, mobile: 200 },
        { month: "Mar", desktop: 237, mobile: 120 },
        { month: "Apr", desktop: 173, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
      ]
      const chartConfig = {
        desktop: { label: "Desktop", color: "var(--chart-1)" },
        mobile: { label: "Mobile", color: "var(--chart-2)" },
      }
      return (
        <ChartContainer
          config={chartConfig}
          className={cn("aspect-video w-64", isCustom && "w-full")}
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      )
    }

    case "kbd":
      return (
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
      )

    case "marker": {
      const text = String(props.text ?? "")
      const highlight = String(props.highlight ?? "").toLowerCase()
      if (!highlight || !text.toLowerCase().includes(highlight)) {
        return <p className="max-w-56 text-sm leading-relaxed">{text}</p>
      }
      const startIndex = text.toLowerCase().indexOf(highlight)
      const endIndex = startIndex + highlight.length
      return (
        <p className={cn("max-w-56 text-sm leading-relaxed", isCustom && "max-w-none")}>
          {text.slice(0, startIndex)}
          <Marker>{text.slice(startIndex, endIndex)}</Marker>
          {text.slice(endIndex)}
        </p>
      )
    }

    case "direction":
      return (
        <DirectionProvider dir={props.dir === "rtl" ? "rtl" : "ltr"}>
          <div
            dir={props.dir === "rtl" ? "rtl" : "ltr"}
            className="flex items-center gap-2 rounded-md border px-3 py-2"
          >
            <Badge variant="secondary">{props.dir === "rtl" ? "RTL" : "LTR"}</Badge>
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
      )

    case "toast": {
      const message = String(props.message ?? "")
      const isError = props.variant === "error"
      const trigger = Boolean(props.trigger ?? state.trigger)
      const fire = () => {
        if (isError) toast.error(message || "Something went wrong")
        else toast.success(message || "Changes saved")
        emit("fired", true)
      }

      // Fire on the rising edge of a wired trigger signal.
      const prevTrigger = useRef(trigger)
      useEffect(() => {
        if (trigger && !prevTrigger.current) {
          fire()
        }
        prevTrigger.current = trigger
        // eslint-disable-next-line react-hooks/exhaustive-deps -- fire is stable per render inputs
      }, [trigger])

      return (
        <Button size="sm" variant={isError ? "destructive" : "outline"} disabled={disabled} onClick={fire}>
          {trigger && !isError ? "Firing…" : isError ? "Fire error" : "Fire toast"}
        </Button>
      )
    }

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Unknown: {componentType}
        </div>
      )
  }
}
