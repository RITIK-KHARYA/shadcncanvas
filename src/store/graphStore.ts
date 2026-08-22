import {
  addEdge as addFlowEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react"
import { create } from "zustand"

import { evalTransform } from "@/lib/graphUtils"
import { nodeRegistry } from "@/lib/nodeRegistry"
import type { CanvasEdge, CanvasNode, NodeLayout, NodeState } from "@/types/graph"

type GraphStore = {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  addNode: (node: CanvasNode) => void
  addEdge: (connection: Connection) => void
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void
  onEdgesChange: (changes: EdgeChange<CanvasEdge>[]) => void
  setSelectedNodeId: (id: string | null) => void
  setSelectedEdgeId: (id: string | null) => void
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void
  updateNodeLayout: (nodeId: string, layout: Partial<NodeLayout>) => void
  updateNodeState: (nodeId: string, newState: NodeState) => void
  updateEdgeTransform: (edgeId: string, transform: string) => void
  propagate: (
    nodeId: string,
    outputKey: string,
    value: boolean | string | number,
  ) => void
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  addEdge: (connection) => {
    if (!connection.source || !connection.target) return

    const newEdge: CanvasEdge = {
      id: crypto.randomUUID(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      data: { transform: "passthrough" },
    }

    set({
      edges: addFlowEdge(newEdge, get().edges),
    })

    const sourceNode = get().nodes.find((n) => n.id === connection.source)
    if (!sourceNode || !connection.sourceHandle) return

    const sourceConfig = nodeRegistry[sourceNode.data.componentType]
    const outputDef = sourceConfig?.outputs.find(
      (output) => output.key === connection.sourceHandle,
    )

    const rawValue = sourceNode.data.state[connection.sourceHandle]
    const value =
      rawValue !== undefined
        ? rawValue
        : outputDef?.type === "boolean"
          ? false
          : undefined

    if (
      value !== undefined &&
      (typeof value === "boolean" ||
        typeof value === "string" ||
        typeof value === "number")
    ) {
      get().propagate(connection.source, connection.sourceHandle, value)
    }
  },

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),

  updateNodeProps: (nodeId, props) =>
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                props: { ...node.data.props, ...props },
              },
            }
          : node,
      ),
    }),

  updateNodeLayout: (nodeId, layout) =>
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                layout: { ...node.data.layout, ...layout },
              },
            }
          : node,
      ),
    }),

  updateNodeState: (nodeId, newState) =>
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                state: { ...node.data.state, ...newState },
              },
            }
          : node,
      ),
    }),

  updateEdgeTransform: (edgeId, transform) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, transform } }
          : edge,
      ),
    })

    const edge = get().edges.find((e) => e.id === edgeId)
    if (!edge?.source || !edge.sourceHandle) return

    const sourceNode = get().nodes.find((n) => n.id === edge.source)
    if (!sourceNode) return

    const value = sourceNode.data.state[edge.sourceHandle]
    if (value !== undefined && (typeof value === "boolean" || typeof value === "string" || typeof value === "number")) {
      get().propagate(edge.source, edge.sourceHandle, value)
    }
  },

  propagate: (nodeId, outputKey, value) => {
    const { edges } = get()
    const relevantEdges = edges.filter(
      (edge) => edge.source === nodeId && edge.sourceHandle === outputKey,
    )

    for (const edge of relevantEdges) {
      if (!edge.target || !edge.targetHandle) continue

      const transformed = edge.data?.transform
        ? evalTransform(String(edge.data.transform), value)
        : value

      set({
        nodes: get().nodes.map((node) =>
          node.id === edge.target
            ? {
                ...node,
                data: {
                  ...node.data,
                  props: {
                    ...node.data.props,
                    [edge.targetHandle!]: transformed,
                  },
                  state: {
                    ...node.data.state,
                    [edge.targetHandle!]: transformed,
                  },
                },
              }
            : node,
        ),
      })
    }
  },
}))
