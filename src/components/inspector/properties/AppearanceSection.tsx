import { ColorField } from "@/components/inspector/ColorField"
import { CollapsibleSection } from "@/components/inspector/CollapsibleSection"
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
import { getFieldErrors } from "@/lib/nodeSchemas"
import type { NodeConfig } from "@/lib/nodeRegistry"
import { useGraphStore } from "@/store/graphStore"
import type { CanvasNode } from "@/types/graph"
import { cn } from "@/lib/utils"

export function AppearanceSection({
  node,
  config,
}: {
  node: CanvasNode
  config: NodeConfig
}) {
  const updateNodeProps = useGraphStore((s) => s.updateNodeProps)

  if (config.configurableProps.length === 0) return null

  const fieldErrors = getFieldErrors(node.data.componentType, node.data.props)
  const setProp = (key: string, value: unknown) => {
    updateNodeProps(node.id, { [key]: value })
  }

  return (
    <CollapsibleSection id="appearance" title="Appearance">
      <div className="space-y-2">
        {config.configurableProps.map((propDef) => {
          const value = node.data.props[propDef.key]
          const error = fieldErrors[propDef.key]

          return (
            <div
              key={propDef.key}
              className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-2 gap-y-1"
            >
              <Label
                htmlFor={`prop-${propDef.key}`}
                className="truncate text-[11px] font-normal text-muted-foreground"
              >
                {propDef.label}
              </Label>

              {propDef.inputType === "text" && (
                <Input
                  id={`prop-${propDef.key}`}
                  className={cn(
                    "h-7 bg-background text-xs shadow-none",
                    error && "border-destructive",
                  )}
                  value={String(value ?? "")}
                  onChange={(e) => setProp(propDef.key, e.target.value)}
                />
              )}

              {propDef.inputType === "select" && (
                <Select
                  value={String(value ?? propDef.default)}
                  onValueChange={(next) => setProp(propDef.key, next)}
                >
                  <SelectTrigger
                    id={`prop-${propDef.key}`}
                    className={cn(
                      "h-7 w-full bg-background text-xs shadow-none",
                      error && "border-destructive",
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(propDef.options ?? []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {propDef.inputType === "boolean" && (
                <Switch
                  id={`prop-${propDef.key}`}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => setProp(propDef.key, checked)}
                  className="justify-self-start"
                />
              )}

              {propDef.inputType === "number" && (
                <Input
                  id={`prop-${propDef.key}`}
                  type="number"
                  className={cn(
                    "h-7 bg-background text-xs shadow-none",
                    error && "border-destructive",
                  )}
                  value={Number(value ?? 0)}
                  onChange={(e) => setProp(propDef.key, Number(e.target.value))}
                />
              )}

              {propDef.inputType === "color" && (
                <ColorField
                  id={`prop-${propDef.key}`}
                  label=""
                  value={String(value ?? propDef.default ?? "oklch(0.145 0 0)")}
                  onChange={(next) => setProp(propDef.key, next)}
                />
              )}

              {error && (
                <p className="col-start-2 text-[11px] text-destructive">{error}</p>
              )}
            </div>
          )
        })}
      </div>
    </CollapsibleSection>
  )
}
