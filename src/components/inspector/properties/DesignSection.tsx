import { RotateCcw } from "lucide-react"

import { CollapsibleSection } from "@/components/inspector/CollapsibleSection"
import { ColorField } from "@/components/inspector/ColorField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { NodeConfig } from "@/lib/registry"
import { useGraphStore } from "@/store/graph-store"
import type { CanvasNode } from "@/types/graph"
import type { NodeStyleOverride } from "@/types/graph"

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-6 shrink-0"
      onClick={onClick}
      aria-label="Reset"
    >
      <RotateCcw className="size-3" />
    </Button>
  )
}

function ControlRow({
  label,
  hasOverride,
  onReset,
  children,
}: {
  label: string
  hasOverride: boolean
  onReset: () => void
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)_24px] items-center gap-x-2 gap-y-1">
      <Label className="truncate text-[11px] font-normal text-muted-foreground">{label}</Label>
      <div className="min-w-0">{children}</div>
      <div className="flex justify-end">
        {hasOverride ? <ResetButton onClick={onReset} /> : <span className="size-6" />}
      </div>
    </div>
  )
}

export function DesignSection({ node, config }: { node: CanvasNode; config: NodeConfig }) {
  const updateNodeStyle = useGraphStore((s) => s.updateNodeStyle)
  const resetNodeStyle = useGraphStore((s) => s.resetNodeStyle)
  const style = (node.data.style ?? {}) as NodeStyleOverride

  const set = (patch: Partial<NodeStyleOverride>) => updateNodeStyle(node.id, patch)
  const reset = (key: keyof NodeStyleOverride) => resetNodeStyle(node.id, key)
  const has = (key: keyof NodeStyleOverride) => style[key] !== undefined
  const hasAny = Object.keys(style).length > 0

  const isTextBearing = config.configurableProps.some((p) =>
    ["label", "text", "title", "triggerLabel", "heading", "description", "placeholder", "keys"].includes(p.key),
  )

  return (
    <CollapsibleSection
      id="design"
      title="Design"
      defaultExpanded={false}
      action={
        hasAny ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px]"
            onClick={() => resetNodeStyle(node.id)}
          >
            Reset all
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {/* Shape */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">Shape</p>

          <ControlRow label="Roundness" hasOverride={has("borderRadius")} onReset={() => reset("borderRadius")}>
            <div className="flex items-center gap-2">
              <Slider
                min={0}
                max={32}
                step={1}
                value={[style.borderRadius ?? 0]}
                onValueChange={([v]) => set({ borderRadius: v })}
                className="flex-1"
              />
              <Input
                type="number"
                className="h-7 w-14 bg-background text-xs shadow-none"
                value={style.borderRadius ?? 0}
                min={0}
                max={32}
                onChange={(e) => set({ borderRadius: Number(e.target.value) })}
              />
            </div>
          </ControlRow>

          <ControlRow label="Border width" hasOverride={has("borderWidth")} onReset={() => reset("borderWidth")}>
            <Slider
              min={0}
              max={8}
              step={1}
              value={[style.borderWidth ?? 0]}
              onValueChange={([v]) => set({ borderWidth: v })}
            />
          </ControlRow>

          <ControlRow label="Border style" hasOverride={has("borderStyle")} onReset={() => reset("borderStyle")}>
            <Select
              value={String(style.borderStyle ?? "solid")}
              onValueChange={(v) => set({ borderStyle: v as NodeStyleOverride["borderStyle"] })}
            >
              <SelectTrigger className="h-7 w-full bg-background text-xs shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["solid", "dashed", "dotted", "none"] as const).map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ControlRow>

          <ControlRow label="Border color" hasOverride={has("borderColor")} onReset={() => reset("borderColor")}>
            <ColorField
              id={`design-borderColor`}
              label=""
              value={String(style.borderColor ?? "oklch(0.922 0 0)")}
              onChange={(v) => set({ borderColor: v })}
            />
          </ControlRow>
        </div>

        {/* Fill */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">Fill</p>
          <ControlRow label="Background" hasOverride={has("backgroundColor")} onReset={() => reset("backgroundColor")}>
            <div className="space-y-1.5">
              <ColorField
                id="design-backgroundColor"
                label=""
                value={String(style.backgroundColor ?? "oklch(1 0 0)")}
                onChange={(v) => set({ backgroundColor: v })}
              />
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={style.backgroundColor === undefined}
                  onChange={(e) => {
                    if (e.target.checked) reset("backgroundColor")
                    else set({ backgroundColor: "oklch(0.985 0 0)" })
                  }}
                />
                Use theme default
              </label>
            </div>
          </ControlRow>
        </div>

        {/* Typography */}
        {isTextBearing && (
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground">Typography</p>

            <ControlRow label="Font family" hasOverride={has("fontFamily")} onReset={() => reset("fontFamily")}>
              <Select
                value={String(style.fontFamily ?? "inherit")}
                onValueChange={(v) => set({ fontFamily: v as NodeStyleOverride["fontFamily"] })}
              >
                <SelectTrigger className="h-7 w-full bg-background text-xs shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inherit">Inherit</SelectItem>
                  <SelectItem value="sans">Sans</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">Mono</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label="Font size" hasOverride={has("fontSize")} onReset={() => reset("fontSize")}>
              <Slider
                min={10}
                max={32}
                step={1}
                value={[style.fontSize ?? 14]}
                onValueChange={([v]) => set({ fontSize: v })}
              />
            </ControlRow>

            <ControlRow label="Font weight" hasOverride={has("fontWeight")} onReset={() => reset("fontWeight")}>
              <Select
                value={String(style.fontWeight ?? "normal")}
                onValueChange={(v) => set({ fontWeight: v as NodeStyleOverride["fontWeight"] })}
              >
                <SelectTrigger className="h-7 w-full bg-background text-xs shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="semibold">Semibold</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </ControlRow>

            <ControlRow label="Text color" hasOverride={has("textColor")} onReset={() => reset("textColor")}>
              <ColorField
                id="design-textColor"
                label=""
                value={String(style.textColor ?? "oklch(0.145 0 0)")}
                onChange={(v) => set({ textColor: v })}
              />
            </ControlRow>
          </div>
        )}

        {/* Spacing & Effects */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground">Spacing & Effects</p>

          <ControlRow label="Padding" hasOverride={has("padding")} onReset={() => reset("padding")}>
            <Slider
              min={0}
              max={32}
              step={1}
              value={[style.padding ?? 0]}
              onValueChange={([v]) => set({ padding: v })}
            />
          </ControlRow>

          <ControlRow label="Shadow" hasOverride={has("shadow")} onReset={() => reset("shadow")}>
            <Select
              value={String(style.shadow ?? "none")}
              onValueChange={(v) => set({ shadow: v as NodeStyleOverride["shadow"] })}
            >
              <SelectTrigger className="h-7 w-full bg-background text-xs shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
              </SelectContent>
            </Select>
          </ControlRow>

          <ControlRow label="Opacity" hasOverride={has("opacity")} onReset={() => reset("opacity")}>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[style.opacity ?? 100]}
              onValueChange={([v]) => set({ opacity: v })}
            />
          </ControlRow>
        </div>
      </div>
    </CollapsibleSection>
  )
}
