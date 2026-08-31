import type { Edge, Node } from "@xyflow/react"

export type PortType = "boolean" | "string" | "number"

export type NodeState = Record<string, boolean | string | number | undefined>

export type NodeSizeMode = "default" | "custom"

export type NodeLayout = {
  sizeMode: NodeSizeMode
  customWidth?: number
  customHeight?: number
  rotation?: number
  aspectLocked?: boolean
}

export type NodeStyleOverride = {
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
  borderStyle?: "solid" | "dashed" | "dotted" | "none"
  backgroundColor?: string
  textColor?: string
  fontFamily?: "sans" | "serif" | "mono" | "inherit"
  fontSize?: number
  fontWeight?: "normal" | "medium" | "semibold" | "bold"
  padding?: number
  shadow?: "none" | "sm" | "md" | "lg"
  opacity?: number
}

export type GraphNodeData = {
  componentType: string
  props: Record<string, unknown>
  state: NodeState
  layout: NodeLayout
  name?: string
  style?: NodeStyleOverride
}

export type CanvasNode = Node<GraphNodeData, "baseNode">
export type CanvasEdge = Edge

export type TransformType = "passthrough" | "invert" | "negate" | "isLoading" | "isError" | "isSuccess"
