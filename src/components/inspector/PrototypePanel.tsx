import { Cable } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EDGE_TRANSFORMS } from "@/lib/graphUtils"
import { nodeRegistry } from "@/lib/nodeRegistry"
import { useGraphStore } from "@/store/graphStore"
import type { CanvasNode } from "@/types/graph"

export function PrototypePanel({ node }: { node: CanvasNode | null }) {
  const edges = useGraphStore((s) => s.edges)
  const nodes = useGraphStore((s) => s.nodes)
  const updateEdgeTransform = useGraphStore((s) => s.updateEdgeTransform)

  const relatedEdges = node
    ? edges.filter((edge) => edge.source === node.id || edge.target === node.id)
    : []

  if (!node) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
        <Cable className="size-5 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Select an object to see
          <br />
          its interactions.
        </p>
      </div>
    )
  }

  if (relatedEdges.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs text-muted-foreground">
        No wires connected to this node yet.
      </p>
    )
  }

  return (
    <div className="space-y-1 py-2">
      {relatedEdges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source)
        const targetNode = nodes.find((n) => n.id === edge.target)
        const sourceConfig = sourceNode
          ? nodeRegistry[sourceNode.data.componentType]
          : null
        const targetConfig = targetNode
          ? nodeRegistry[targetNode.data.componentType]
          : null
        const sourcePort = sourceConfig?.outputs.find(
          (o) => o.key === edge.sourceHandle,
        )
        const targetPort = targetConfig?.inputs.find(
          (i) => i.key === edge.targetHandle,
        )
        const transform = String(edge.data?.transform ?? "passthrough")
        const direction = edge.source === node.id ? "out" : "in"

        return (
          <div key={edge.id} className="border-t px-4 py-2.5">
            <p className="flex items-center gap-1.5 truncate text-xs font-medium">
              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: direction === "out" ? "#22c55e" : "#3b82f6",
                }}
                aria-hidden="true"
              />
              {sourceConfig?.label ?? edge.source}.{sourcePort?.label ?? edge.sourceHandle}
              {" → "}
              {targetConfig?.label ?? edge.target}.{targetPort?.label ?? edge.targetHandle}
            </p>
            <Select
              value={transform}
              onValueChange={(value) => updateEdgeTransform(edge.id, value)}
            >
              <SelectTrigger className="mt-2 h-7 w-full bg-background text-xs shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EDGE_TRANSFORMS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      })}
    </div>
  )
}
