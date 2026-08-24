import {
  addEdge as addFlowEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "@xyflow/react";
import { create } from "zustand";

import { evalTransform } from "@/lib/graphUtils";
import { nodeRegistry } from "@/lib/nodeRegistry";
import type {
  CanvasEdge,
  CanvasNode,
  NodeLayout,
  NodeState,
} from "@/types/graph";

type Snapshot = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
};

const MAX_HISTORY = 40;

type GraphStore = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeId: string | null;
  history: Snapshot[];
  future: Snapshot[];
  canUndo: boolean;
  canRedo: boolean;
  hydrate: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  addNode: (node: CanvasNode) => void;
  addEdge: (connection: Connection) => void;
  clearCanvas: () => void;
  onNodesChange: (changes: NodeChange<CanvasNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CanvasEdge>[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedNodeIds: (ids: string[]) => void;
  setSelectedEdgeId: (id: string | null) => void;
  updateNodeProps: (nodeId: string, props: Record<string, unknown>) => void;
  updateNodeLayout: (nodeId: string, layout: Partial<NodeLayout>) => void;
  updateNodePosition: (
    nodeId: string,
    position: { x?: number; y?: number },
  ) => void;
  renameNode: (nodeId: string, name: string) => void;
  duplicateNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  updateNodeState: (nodeId: string, newState: NodeState) => void;
  updateEdgeTransform: (edgeId: string, transform: string) => void;
  propagate: (
    nodeId: string,
    outputKey: string,
    value: boolean | string | number,
    visited?: Set<string>,
  ) => void;
};

function cloneSnapshot(nodes: CanvasNode[], edges: CanvasEdge[]): Snapshot {
  return structuredClone({ nodes, edges });
}

function syncHistoryFlags(state: { history: Snapshot[]; future: Snapshot[] }) {
  return {
    canUndo: state.history.length > 0,
    canRedo: state.future.length > 0,
  };
}

export const useGraphStore = create<GraphStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedNodeIds: [],
  selectedEdgeId: null,
  history: [],
  future: [],
  canUndo: false,
  canRedo: false,

  hydrate: (nodes, edges) => {
    set({
      nodes,
      edges,
      history: [],
      future: [],
      ...syncHistoryFlags({ history: [], future: [] }),
    });
  },

  pushHistory: () => {
    const { nodes, edges, history } = get();
    const snapshot = cloneSnapshot(nodes, edges);
    const nextHistory = [...history, snapshot].slice(-MAX_HISTORY);
    set({
      history: nextHistory,
      future: [],
      ...syncHistoryFlags({ history: nextHistory, future: [] }),
    });
  },

  undo: () => {
    const { history, future, nodes, edges } = get();
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    const nextHistory = history.slice(0, -1);
    const nextFuture = [cloneSnapshot(nodes, edges), ...future].slice(
      0,
      MAX_HISTORY,
    );

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: nextHistory,
      future: nextFuture,
      selectedNodeId: null,
      selectedEdgeId: null,
      ...syncHistoryFlags({ history: nextHistory, future: nextFuture }),
    });
  },

  redo: () => {
    const { history, future, nodes, edges } = get();
    if (future.length === 0) return;

    const next = future[0];
    const nextFuture = future.slice(1);
    const nextHistory = [...history, cloneSnapshot(nodes, edges)].slice(
      -MAX_HISTORY,
    );

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: nextHistory,
      future: nextFuture,
      selectedNodeId: null,
      selectedEdgeId: null,
      ...syncHistoryFlags({ history: nextHistory, future: nextFuture }),
    });
  },

  addNode: (node) => {
    get().pushHistory();
    set({ nodes: [...get().nodes, node] });
  },

  addEdge: (connection) => {
    if (!connection.source || !connection.target) return;

    get().pushHistory();

    const newEdge: CanvasEdge = {
      id: crypto.randomUUID(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      data: { transform: "passthrough" },
    };

    set({
      edges: addFlowEdge(newEdge, get().edges),
    });

    const sourceNode = get().nodes.find((n) => n.id === connection.source);
    if (!sourceNode || !connection.sourceHandle) return;

    const sourceConfig = nodeRegistry[sourceNode.data.componentType];
    const outputDef = sourceConfig?.outputs.find(
      (output) => output.key === connection.sourceHandle,
    );

    const rawValue = sourceNode.data.state[connection.sourceHandle];
    const value =
      rawValue !== undefined
        ? rawValue
        : outputDef?.type === "boolean"
          ? false
          : undefined;

    if (
      value !== undefined &&
      (typeof value === "boolean" ||
        typeof value === "string" ||
        typeof value === "number")
    ) {
      get().propagate(connection.source, connection.sourceHandle, value);
    }
  },

  clearCanvas: () => {
    const { nodes, edges } = get();
    if (nodes.length === 0 && edges.length === 0) return;

    get().pushHistory();
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },

  onNodesChange: (changes) => {
    const shouldRecord = changes.some(
      (change) => change.type === "remove" || change.type === "add",
    );
    if (shouldRecord) get().pushHistory();
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    const shouldRecord = changes.some((change) => change.type === "remove");
    if (shouldRecord) get().pushHistory();
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),

  updateNodeProps: (nodeId, props) => {
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
    });
  },

  updateNodeLayout: (nodeId, layout) => {
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
    });
  },

  updateNodePosition: (nodeId, position) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              position: {
                x: position.x ?? node.position.x,
                y: position.y ?? node.position.y,
              },
            }
          : node,
      ),
    });
  },

  renameNode: (nodeId, name) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, name } } : node,
      ),
    });
  },

  duplicateNode: (nodeId) => {
    const source = get().nodes.find((node) => node.id === nodeId);
    if (!source) return;

    get().pushHistory();

    const clone: CanvasNode = structuredClone({
      ...source,
      id: crypto.randomUUID(),
      position: { x: source.position.x + 24, y: source.position.y + 24 },
      selected: false,
    });

    set({
      nodes: [...get().nodes, clone],
      selectedNodeId: clone.id,
      selectedNodeIds: [clone.id],
    });
  },

  deleteNode: (nodeId) => {
    get().pushHistory();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
      selectedNodeId: null,
      selectedNodeIds: [],
    });
  },

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
    get().pushHistory();
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, transform } }
          : edge,
      ),
    });

    const edge = get().edges.find((e) => e.id === edgeId);
    if (!edge?.source || !edge.sourceHandle) return;

    const sourceNode = get().nodes.find((n) => n.id === edge.source);
    if (!sourceNode) return;

    const value = sourceNode.data.state[edge.sourceHandle];
    if (
      value !== undefined &&
      (typeof value === "boolean" ||
        typeof value === "string" ||
        typeof value === "number")
    ) {
      get().propagate(edge.source, edge.sourceHandle, value);
    }
  },

  propagate: (nodeId, outputKey, value, visited = new Set()) => {
    const hopKey = `${nodeId}:${outputKey}:${String(value)}`;
    if (visited.has(hopKey)) return;
    visited.add(hopKey);

    const { edges } = get();
    const relevantEdges = edges.filter(
      (edge) => edge.source === nodeId && edge.sourceHandle === outputKey,
    );

    for (const edge of relevantEdges) {
      if (!edge.target || !edge.targetHandle) continue;

      const transformed = edge.data?.transform
        ? evalTransform(String(edge.data.transform), value)
        : value;

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
      });

      const targetNode = get().nodes.find((n) => n.id === edge.target);
      const targetConfig = targetNode
        ? nodeRegistry[targetNode.data.componentType]
        : null;

      for (const output of targetConfig?.outputs ?? []) {
        const outValue = get().nodes.find((n) => n.id === edge.target)?.data
          .state[output.key];
        if (
          outValue !== undefined &&
          (typeof outValue === "boolean" ||
            typeof outValue === "string" ||
            typeof outValue === "number")
        ) {
          get().propagate(edge.target, output.key, outValue, visited);
        }
      }
    }
  },
}));

export function recordNodeDragHistory() {
  useGraphStore.getState().pushHistory();
}
