import type { VariantProps } from "class-variance-authority"

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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { NodeSizeMode, NodeState } from "@/types/graph"

type NodePreviewProps = {
  componentType: string
  props: Record<string, unknown>
  state: NodeState
  sizeMode?: NodeSizeMode
  onOutputChange?: (
    outputKey: string,
    value: boolean | string | number,
  ) => void
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
}: NodePreviewProps) {
  const disabled = wiredBoolean(props, state, "disabled")
  const active = wiredBoolean(props, state, "active", true)
  const isCustom = sizeMode === "custom"

  switch (componentType) {
    case "button":
      return (
        <Button
          variant={props.variant as VariantProps<typeof buttonVariants>["variant"]}
          size={props.size as VariantProps<typeof buttonVariants>["size"]}
          disabled={disabled}
          className={isCustom ? "w-full" : undefined}
          aria-pressed={Boolean(state.pressed)}
          data-state={state.pressed ? "on" : "off"}
          onClick={() => {
            const newPressed = !Boolean(state.pressed)
            onOutputChange?.("pressed", newPressed)
          }}
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
          onChange={(e) => onOutputChange?.("value", e.target.value)}
        />
      )

    case "textarea":
      return (
        <Textarea
          placeholder={String(props.placeholder ?? "")}
          disabled={disabled}
          className={fieldClass(sizeMode, isCustom ? "min-h-20" : "w-48")}
          value={String(state.value ?? "")}
          onChange={(e) => onOutputChange?.("value", e.target.value)}
        />
      )

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            disabled={disabled}
            checked={Boolean(state.checked)}
            onCheckedChange={(checked) =>
              onOutputChange?.("checked", checked === true)
            }
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
            onCheckedChange={(checked) =>
              onOutputChange?.("checked", checked === true)
            }
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
          onValueChange={(value) => onOutputChange?.("value", value)}
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

    case "form":
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
              {active ? "Form fields preview" : "Form inactive"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-0">
            <fieldset disabled={!active} className="space-y-2 border-0 p-0">
              <Input placeholder="Field 1" className="w-full" />
            </fieldset>
          </CardContent>
        </Card>
      )

    default:
      return (
        <div className="text-xs text-muted-foreground">
          Unknown: {componentType}
        </div>
      )
  }
}
