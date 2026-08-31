import {
  Handle,
  NodeResizer,
  Position,
  type NodeProps,
  type OnResize,
} from "@xyflow/react";
import { useCallback } from "react";

import { nodeRegistry } from "@/lib/registry";
import { useGraphStore, recordNodeDragHistory } from "@/store/graph-store";
import type { CanvasNode, NodeLayout, NodeState } from "@/types/graph";
import { cn } from "@/lib/utils";

import { NodePreview } from "./NodePreview";
import { NodeSkeleton } from "./NodeSkeleton";

const handleClass =
  "!h-3 !w-3 !border-2 !border-primary !bg-background hover:!bg-primary hover:!scale-110 transition-transform";

export const DEFAULT_NODE_WIDTH = 240;
export const DEFAULT_NODE_HEIGHT = 120;
export const MIN_NODE_WIDTH = 120;
export const MIN_NODE_HEIGHT = 48;

function resolveLayout(layout?: NodeLayout): NodeLayout {
  return layout ?? { sizeMode: "default" };
}

export function BaseNode({ id, data, selected }: NodeProps<CanvasNode>) {
  const updateNodeState = useGraphStore((s) => s.updateNodeState);
  const updateNodeLayout = useGraphStore((s) => s.updateNodeLayout);
  const propagate = useGraphStore((s) => s.propagate);
  const config = nodeRegistry[data.componentType];
  const layout = resolveLayout(data.layout);

  const emitOutput = (outputKey: string, value: boolean | string | number) => {
    updateNodeState(id, { [outputKey]: value });
    propagate(id, outputKey, value);
  };

  const emitOutputs = (outputs: NodeState) => {
    updateNodeState(id, outputs);
    for (const [key, value] of Object.entries(outputs)) {
      if (
        value !== undefined &&
        (typeof value === "boolean" ||
          typeof value === "string" ||
          typeof value === "number")
      ) {
        propagate(id, key, value);
      }
    }
  };

  const handleResizeStart = useCallback(() => {
    recordNodeDragHistory();
  }, []);

  const handleResize = useCallback<OnResize>(
    (_event, params) => {
      updateNodeLayout(id, {
        sizeMode: "custom",
        customWidth: Math.max(MIN_NODE_WIDTH, Math.round(params.width)),
        customHeight: Math.max(MIN_NODE_HEIGHT, Math.round(params.height)),
      });
    },
    [id, updateNodeLayout],
  );

  if (!config) {
    return (
      <div className="rounded-lg border-2 border-destructive bg-background p-3">
        Unknown type: {data.componentType}
      </div>
    );
  }

  const inputCount = config.inputs.length;
  const outputCount = config.outputs.length;
  const handleCount = Math.max(inputCount, outputCount, 1);
  const isCustom = layout.sizeMode === "custom";
  // Toast must never be hidden by loading skeleton - it needs to fire even while apiCall is loading
  const isLoading = data.componentType !== "toast" && Boolean(data.props.loading ?? data.state.loading);
  const isEmptyHidden =
    data.componentType === "empty" &&
    (data.props.visible ?? data.state.visible) === false;

  return (
    <>
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_NODE_WIDTH}
        minHeight={MIN_NODE_HEIGHT}
        lineClassName="!border-primary/60"
        handleClassName="!h-2 !w-2 !border-2 !border-primary !bg-background !rounded-sm"
        onResizeStart={handleResizeStart}
        onResize={handleResize}
      />
      <div
        className={cn(
          "rounded-lg border-2 bg-card p-3 shadow-sm",
          isCustom ? "overflow-hidden" : "w-fit",
          selected ? "border-primary ring-2 ring-primary/20" : "border-border",
        )}
        style={{
          ...(isCustom
            ? {
                width: layout.customWidth ?? DEFAULT_NODE_WIDTH,
                height: layout.customHeight ?? DEFAULT_NODE_HEIGHT,
              }
            : undefined),
          ...(layout.rotation
            ? { transform: `rotate(${layout.rotation}deg)` }
            : undefined),
        }}
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
          {isEmptyHidden ? null : isLoading ? (
            <NodeSkeleton componentType={data.componentType} fill={isCustom} style={data.style} props={data.props} />
          ) : (
            <NodePreview
              componentType={data.componentType}
              props={data.props}
              state={data.state}
              sizeMode={layout.sizeMode}
              style={data.style}
              onOutputChange={emitOutput}
              onOutputsChange={emitOutputs}
            />
          )}
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
    </>
  );
}
