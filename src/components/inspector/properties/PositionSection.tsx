import { Lock, Unlock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { CollapsibleSection } from "@/components/inspector/CollapsibleSection"
import { Segmented } from "@/components/inspector/Segmented"
import {
  MIN_NODE_HEIGHT,
  MIN_NODE_WIDTH,
} from "@/components/canvas/NodeTypes/BaseNode"
import { useGraphStore } from "@/store/graph-store"
import type { CanvasNode } from "@/types/graph"

function NumberField({
  label,
  value,
  onChange,
  min,
  step = 1,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
}) {
  return (
    <InputGroup className="h-7">
      <InputGroupAddon align="inline-start" className="pl-2">
        <InputGroupText className="text-[10px]">{label}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        aria-label={label}
        type="number"
        step={step}
        min={min}
        className="h-7 text-xs"
        value={Math.round(value)}
        onChange={(e) => {
          const next = Number(e.target.value)
          if (Number.isFinite(next) && (min === undefined || next >= min)) {
            onChange(next)
          }
        }}
      />
    </InputGroup>
  )
}

export function PositionSection({ node }: { node: CanvasNode }) {
  const updateNodePosition = useGraphStore((s) => s.updateNodePosition)
  const updateNodeLayout = useGraphStore((s) => s.updateNodeLayout)

  const layout = node.data.layout ?? { sizeMode: "default" as const }
  const isCustomSize = layout.sizeMode === "custom"
  const width = layout.customWidth ?? 240
  const height = layout.customHeight ?? 120
  const rotation = layout.rotation ?? 0
  const aspectLocked = layout.aspectLocked ?? false
  const ratio = width / height

  const setWidth = (nextWidth: number) => {
    const clamped = Math.max(MIN_NODE_WIDTH, Math.round(nextWidth))
    updateNodeLayout(node.id, {
      customWidth: clamped,
      ...(aspectLocked
        ? { customHeight: Math.max(MIN_NODE_HEIGHT, Math.round(clamped / ratio)) }
        : {}),
    })
  }

  const setHeight = (nextHeight: number) => {
    const clamped = Math.max(MIN_NODE_HEIGHT, Math.round(nextHeight))
    updateNodeLayout(node.id, {
      customHeight: clamped,
      ...(aspectLocked
        ? { customWidth: Math.max(MIN_NODE_WIDTH, Math.round(clamped * ratio)) }
        : {}),
    })
  }

  return (
    <CollapsibleSection id="position" title="Position & size">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="X"
            value={node.position.x}
            onChange={(x) => updateNodePosition(node.id, { x })}
          />
          <NumberField
            label="Y"
            value={node.position.y}
            onChange={(y) => updateNodePosition(node.id, { y })}
          />
        </div>

        <Segmented
          value={layout.sizeMode}
          options={[
            { value: "default", label: "Auto" },
            { value: "custom", label: "Fixed" },
          ]}
          onChange={(mode) =>
            updateNodeLayout(node.id, {
              sizeMode: mode,
              ...(mode === "custom"
                ? { customWidth: width, customHeight: height }
                : {}),
            })
          }
        />

        {isCustomSize && (
          <div className="flex items-center gap-2">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <NumberField label="W" value={width} min={MIN_NODE_WIDTH} onChange={setWidth} />
              <NumberField label="H" value={height} min={MIN_NODE_HEIGHT} onChange={setHeight} />
            </div>
            <Button
              type="button"
              variant={aspectLocked ? "secondary" : "outline"}
              size="icon-sm"
              aria-label={aspectLocked ? "Unlock aspect ratio" : "Lock aspect ratio"}
              aria-pressed={aspectLocked}
              onClick={() =>
                updateNodeLayout(node.id, { aspectLocked: !aspectLocked })
              }
            >
              {aspectLocked ? (
                <Lock className="size-3.5" aria-hidden="true" />
              ) : (
                <Unlock className="size-3.5" aria-hidden="true" />
              )}
            </Button>
          </div>
        )}

        <NumberField
          label="Rotate"
          value={rotation}
          step={1}
          onChange={(next) =>
            updateNodeLayout(node.id, { rotation: ((next % 360) + 360) % 360 })
          }
        />
      </div>
    </CollapsibleSection>
  )
}
