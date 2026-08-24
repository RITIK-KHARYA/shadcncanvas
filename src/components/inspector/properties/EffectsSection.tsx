import { CollapsibleSection } from "@/components/inspector/CollapsibleSection"
import type { NodeConfig } from "@/lib/nodeRegistry"
import type { CanvasNode } from "@/types/graph"
import { cn } from "@/lib/utils"

const TYPE_DOT: Record<string, string> = {
  boolean: "bg-orange-500",
  string: "bg-green-500",
  number: "bg-blue-500",
}

export function EffectsSection({
  node,
  config,
}: {
  node: CanvasNode
  config: NodeConfig
}) {
  if (config.inputs.length === 0 && config.outputs.length === 0) return null

  return (
    <CollapsibleSection id="effects" title="Wiring">
      <div className="space-y-1.5">
        {[...config.inputs, ...config.outputs].map((port) => (
          <div
            key={`${port.type}-${port.key}`}
            className="flex items-center justify-between gap-2 text-[11px]"
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  TYPE_DOT[port.type] ?? "bg-muted-foreground",
                )}
                aria-hidden="true"
              />
              <span className="truncate text-muted-foreground">{port.label}</span>
            </span>
            <span className="shrink-0 font-mono text-foreground">
              {String(node.data.state[port.key] ?? "—")}
            </span>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
