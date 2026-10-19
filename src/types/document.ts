/**
 * Design document model — a flat node graph (like Figma's) where every node
 * lives in `nodes` and hierarchy is expressed via `parentId`/`childIds`.
 * Pages hold ordered `rootIds` for top-level layers.
 */
export type DesignNodeType =
  | "frame"
  | "rect"
  | "ellipse"
  | "line"
  | "text"
  | "image"
  | "group"

export type ShadowStyle = "none" | "sm" | "md" | "lg"

export type DesignNodeStyle = {
  fills: string[]
  strokeColor: string | null
  strokeWidth: number
  radius: number
  opacity: number
  shadow: ShadowStyle
}

export type DesignTextStyle = {
  content: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  align: "left" | "center" | "right"
  color: string
}

export type DesignNode = {
  id: string
  type: DesignNodeType
  name: string
  parentId: string | null
  childIds: string[]
  x: number
  y: number
  width: number
  height: number
  rotation: number
  visible: boolean
  locked: boolean
  style: DesignNodeStyle
  text?: DesignTextStyle
  image?: string
}

/**
 * A page is a named canvas with an ordered list of root layer IDs.
 * Order in `rootIds` is bottom-to-top z-order.
 */

export type DesignPage = {
  id: string
  name: string
  rootIds: string[]
}

export type DesignDocument = {
  version: 1
  pages: DesignPage[]
  currentPageId: string
  nodes: Record<string, DesignNode>
}
