import { Handle, Position, type NodeProps } from "@xyflow/react"

import { nodeRegistry } from "@/lib/nodeRegistry"
import { useGraphStore } from "@/store/graphStore"
import type { CanvasNode, NodeLayout, NodeState } from "@/types/graph"
import { cn } from "@/lib/utils"

import { NodePreview } from "./NodePreview"

const handleClass =
  "!h-3 !w-3 !border-2 !border-primary !bg-background hover:!bg-primary hover:!scale-110 transition-transform"

function resolveLayout(layout?: NodeLayout): NodeLayout {
  return layout ?? { sizeMode: "default" }
}

export function BaseNode({ id, data, selected }: NodeProps<CanvasNode>) {
  const updateNodeState = useGraphStore((s) => s.updateNodeState)
  const propagate = useGraphStore((s) => s.propagate)
  const config = nodeRegistry[data.componentType]
  const layout = resolveLayout(data.layout)

  const emitOutput = (outputKey: string, value: boolean | string | number) => {
    updateNodeState(id, { [outputKey]: value })
    propagate(id, outputKey, value)
  }

  if (!config) {
    return (
      <div className="rounded-lg border-2 border-destructive bg-background p-3">
        Unknown type: {data.componentType}
      </div>
    )
  }

  const inputCount = config.inputs.length
  const outputCount = config.outputs.length
  const handleCount = Math.max(inputCount, outputCount, 1)
  const isCustom = layout.sizeMode === "custom"

  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card p-3 shadow-sm",
        isCustom ? "overflow-hidden" : "w-fit",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
      style={
        isCustom
          ? {
              width: layout.customWidth ?? 240,
              minHeight: layout.customHeight ?? 80,
            }
          : undefined
      }
    >
      {config.inputs.map((input, i) => (
        <Handle
          key={input.key}
          type="target"
          position={Position.Left}
          id={input.key}
          title={`${input.label} (${input.type})`}
          className={handleClass}
          style={{ top: `${((i + 1) / (handleCount + 1)) * 100}%` }}
        />
      ))}

      <div className="nodrag nopan nowheel">
        <NodePreview
          componentType={data.componentType}
          props={data.props}
          state={data.state}
          sizeMode={layout.sizeMode}
          onOutputChange={emitOutput}
        />
      </div>

      {config.outputs.map((output, i) => (
        <Handle
          key={output.key}
          type="source"
          position={Position.Right}
          id={output.key}
          title={`${output.label} (${output.type})`}
          className={handleClass}
          style={{ top: `${((i + 1) / (handleCount + 1)) * 100}%` }}
        />
      ))}
    </div>
  )
}
