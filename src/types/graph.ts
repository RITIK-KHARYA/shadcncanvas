import type { Edge, Node } from "@xyflow/react"

export type PortType = "boolean" | "string" | "number"

export type NodeState = Record<string, boolean | string | number | undefined>

export type NodeSizeMode = "default" | "custom"

export type NodeLayout = {
  sizeMode: NodeSizeMode
  customWidth?: number
  customHeight?: number
}

export type GraphNodeData = {
  componentType: string
  props: Record<string, unknown>
  state: NodeState
  layout: NodeLayout
}

export type CanvasNode = Node<GraphNodeData, "baseNode">
export type CanvasEdge = Edge
