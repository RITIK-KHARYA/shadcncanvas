import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type NodeTypes,
} from "@xyflow/react"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { BaseNode } from "@/components/canvas/NodeTypes/BaseNode"
import { cn } from "@/lib/utils"
import { getComponentDragData } from "@/lib/dnd"
import { edgeStrokeColor, wouldCreateCycle } from "@/lib/graphUtils"
import { nodeRegistry } from "@/lib/nodeRegistry"
import { useGraphStore, recordNodeDragHistory } from "@/store/graphStore"
import type { CanvasEdge, CanvasNode } from "@/types/graph"

const nodeTypes: NodeTypes = {
  baseNode: BaseNode,
}

function CanvasFlow() {
  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const onNodesChange = useGraphStore((s) => s.onNodesChange)
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange)
  const addNode = useGraphStore((s) => s.addNode)
  const addEdge = useGraphStore((s) => s.addEdge)
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId)
  const setSelectedEdgeId = useGraphStore((s) => s.setSelectedEdgeId)
  const { screenToFlowPosition } = useReactFlow()
  const [isDragOver, setIsDragOver] = useState(false)

  const styledEdges = useMemo(
    () =>
      edges.map((edge: CanvasEdge) => ({
        ...edge,
        animated: true,
        style: {
          strokeWidth: 2,
          stroke: edgeStrokeColor(String(edge.data?.transform ?? "passthrough")),
        },
      })),
    [edges],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragOver(false)

      const componentType = getComponentDragData(event.dataTransfer)
      if (!componentType) {
        toast.error("Drop failed — no component data")
        return
      }

      const config = nodeRegistry[componentType]
      if (!config) {
        toast.error(`Unknown component: ${componentType}`)
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: CanvasNode = {
        id: crypto.randomUUID(),
        type: "baseNode",
        position,
        data: {
          componentType,
          props: { ...config.defaultProps },
          state: {},
          layout: { sizeMode: "default" },
        },
      }

      addNode(newNode)
    },
    [addNode, screenToFlowPosition],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      const { nodes: currentNodes } = useGraphStore.getState()
      const sourceNode = currentNodes.find((n) => n.id === connection.source)
      const targetNode = currentNodes.find((n) => n.id === connection.target)

      if (
        !sourceNode ||
        !targetNode ||
        !connection.sourceHandle ||
        !connection.targetHandle
      ) {
        return
      }

      const sourceConfig = nodeRegistry[sourceNode.data.componentType]
      const targetConfig = nodeRegistry[targetNode.data.componentType]

      const outputDef = sourceConfig?.outputs.find(
        (output) => output.key === connection.sourceHandle,
      )
      const inputDef = targetConfig?.inputs.find(
        (input) => input.key === connection.targetHandle,
      )

      if (!outputDef || !inputDef) {
        toast.error("Invalid connection handles")
        return
      }

      if (outputDef.type !== inputDef.type) {
        toast.error(
          `Type mismatch: ${outputDef.type} cannot connect to ${inputDef.type}`,
        )
        return
      }

      if (wouldCreateCycle(connection, edges)) {
        toast.error("Circular connection not allowed")
        return
      }

      addEdge(connection)
    },
    [addEdge, edges],
  )

  const onSelectionChange = useCallback(
    ({
      nodes: selectedNodes,
      edges: selectedEdges,
    }: {
      nodes: CanvasNode[]
      edges: CanvasEdge[]
    }) => {
      setSelectedNodeId(selectedNodes[0]?.id ?? null)
      setSelectedEdgeId(selectedEdges[0]?.id ?? null)
    },
    [setSelectedEdgeId, setSelectedNodeId],
  )

  return (
    <ReactFlow
      className={cn(
        "h-full w-full bg-background transition-all duration-200",
        isDragOver && "ring-2 ring-primary/40 ring-inset bg-accent/25"
      )}
      nodes={nodes}
      edges={styledEdges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onSelectionChange={onSelectionChange}
      onNodeDragStop={() => recordNodeDragHistory()}
      connectionRadius={24}
      snapToGrid={false}
      fitView
      minZoom={0.1}
      maxZoom={2.5}
      panOnDrag
      zoomOnScroll
      zoomOnPinch
      panOnScroll={false}
      selectionOnDrag={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={20} size={1} color="var(--border)" />
      <Controls
        showInteractive={false}
        className="!border-border !bg-card !shadow-md [&>button]:!border-border [&>button]:!bg-card [&>button]:!fill-foreground"
      />
    </ReactFlow>
  )
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <div className="relative h-full w-full">
        <div className="canvas-grid pointer-events-none absolute inset-0 z-0 opacity-40" />
        <div className="relative z-10 h-full w-full">
          <CanvasFlow />
        </div>
      </div>
    </ReactFlowProvider>
  )
}
