import { useMemo, useState } from "react"

import { CommentsPanel } from "@/components/inspector/CommentsPanel"
import { PrototypePanel } from "@/components/inspector/PrototypePanel"
import { PropertiesPanel } from "@/components/inspector/properties/PropertiesPanel"
import { SidebarHeader } from "@/components/inspector/SidebarHeader"
import { SidebarTabs, type SidebarTab } from "@/components/inspector/SidebarTabs"
import { ThemePanel } from "@/components/inspector/ThemePanel"
import { useGraphStore } from "@/store/graphStore"

export function EditorSidebar() {
  const [tab, setTab] = useState<SidebarTab>("design")

  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId)
  const selectedNodeIds = useGraphStore((s) => s.selectedNodeIds)
  const selectedEdgeId = useGraphStore((s) => s.selectedEdgeId)

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  )

  // When only a wire is selected, use its source node as the wiring context.
  const activeWireNode = useMemo(() => {
    if (selectedNode) return selectedNode
    if (!selectedEdge) return null
    return nodes.find((node) => node.id === selectedEdge.source) ?? null
  }, [selectedNode, selectedEdge, nodes])

  const commentTargetId = selectedNode?.id ?? "page"
  const multiSelected = selectedNodeIds.length > 1

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-sidebar text-sidebar-foreground">
      <SidebarHeader node={selectedNode} selectedCount={selectedNodeIds.length} />
      <SidebarTabs value={tab} onChange={setTab} />

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto">
        {tab === "design" &&
          (selectedNode && !multiSelected ? (
            <PropertiesPanel node={selectedNode} />
          ) : multiSelected ? (
            <p className="px-4 py-16 text-center text-xs text-muted-foreground">
              Select a single object to edit its properties.
            </p>
          ) : (
            <ThemePanel />
          ))}

        {tab === "prototype" && <PrototypePanel node={activeWireNode} />}

        {tab === "comments" && <CommentsPanel targetId={commentTargetId} />}
      </div>
    </aside>
  )
}
