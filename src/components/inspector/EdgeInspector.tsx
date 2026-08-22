import { useMemo } from "react"

import { Label } from "@/components/ui/label"
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

export function EdgeInspector() {
  const selectedEdgeId = useGraphStore((s) => s.selectedEdgeId)
  const edges = useGraphStore((s) => s.edges)
  const nodes = useGraphStore((s) => s.nodes)
  const updateEdgeTransform = useGraphStore((s) => s.updateEdgeTransform)

  const edge = useMemo(
    () => edges.find((item) => item.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  )

  if (!edge) return null

  const sourceNode = nodes.find((n) => n.id === edge.source)
  const targetNode = nodes.find((n) => n.id === edge.target)
  const sourceConfig = sourceNode
    ? nodeRegistry[sourceNode.data.componentType]
    : null
  const targetConfig = targetNode
    ? nodeRegistry[targetNode.data.componentType]
    : null

  const sourcePort = sourceConfig?.outputs.find((o) => o.key === edge.sourceHandle)
  const targetPort = targetConfig?.inputs.find((i) => i.key === edge.targetHandle)
  const transform = String(edge.data?.transform ?? "passthrough")

  return (
    <section className="rounded-lg border border-primary/40 bg-background/60 p-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Wire
      </h3>
      <p className="mt-1 text-sm font-medium">
        {sourceConfig?.label ?? edge.source}.{sourcePort?.label ?? edge.sourceHandle}
        {" → "}
        {targetConfig?.label ?? edge.target}.{targetPort?.label ?? edge.targetHandle}
      </p>

      <div className="mt-3 space-y-1.5">
        <Label htmlFor="edge-transform" className="text-xs">
          Transform
        </Label>
        <Select
          value={transform}
          onValueChange={(value) => updateEdgeTransform(edge.id, value)}
        >
          <SelectTrigger id="edge-transform" className="h-8">
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
        <p className="text-[11px] text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" /> Passthrough
          {" · "}
          <span className="inline-block h-2 w-2 rounded-full bg-orange-500" /> Invert
        </p>
      </div>
    </section>
  )
}
