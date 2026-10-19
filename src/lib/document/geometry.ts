import type { DesignDocument, DesignNode } from "@/types/document"

export type Vec = { x: number; y: number }
export type Rect = { x: number; y: number; width: number; height: number }

export const MIN_SIZE = 1

export const RESIZE_DIRS = {
  nw: [-1, -1],
  n: [0, -1],
  ne: [1, -1],
  e: [1, 0],
  se: [1, 1],
  s: [0, 1],
  sw: [-1, 1],
  w: [-1, 0],
} as const

export type ResizeDir = keyof typeof RESIZE_DIRS

/** Absolute (page-space) top-left rect of a node, walking up its parent chain. */
export function absoluteRect(
  doc: DesignDocument,
  node: DesignNode,
): Rect {
  let x = node.x
  let y = node.y
  let parentId = node.parentId
  while (parentId) {
    const parent = doc.nodes[parentId]
    if (!parent) break
    x += parent.x
    y += parent.y
    parentId = parent.parentId
  }
  return { x, y, width: node.width, height: node.height }
}

function rotateVec(v: Vec, radians: number): Vec {
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos }
}

/**
 * Rotation-aware resize. `worldDelta` is the pointer delta in parent space.
 * The anchor (opposite corner/edge) is kept fixed in world space by rotating
 * the anchor vector around the node center before and after the size change,
 * then solving for the new center position.
 */
export function resizeNode(
  node: DesignNode,
  dir: ResizeDir,
  worldDelta: Vec,
): { x: number; y: number; width: number; height: number } {
  const [sx, sy] = RESIZE_DIRS[dir]
  const radians = (node.rotation * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  const localX = worldDelta.x * cos + worldDelta.y * sin
  const localY = -worldDelta.x * sin + worldDelta.y * cos

  const width = Math.max(MIN_SIZE, node.width + sx * localX)
  const height = Math.max(MIN_SIZE, node.height + sy * localY)

  const anchorBeforeX = sx === -1 ? node.width : 0
  const anchorBeforeY = sy === -1 ? node.height : 0
  const anchorAfterX = sx === -1 ? width : 0
  const anchorAfterY = sy === -1 ? height : 0

  const center0 = { x: node.x + node.width / 2, y: node.y + node.height / 2 }
  const anchorLocal0 = rotateVec(
    { x: anchorBeforeX - node.width / 2, y: anchorBeforeY - node.height / 2 },
    radians,
  )
  const fixedWorld = {
    x: center0.x + anchorLocal0.x,
    y: center0.y + anchorLocal0.y,
  }

  const anchorLocal1 = rotateVec(
    { x: anchorAfterX - width / 2, y: anchorAfterY - height / 2 },
    radians,
  )
  const center1 = {
    x: fixedWorld.x - anchorLocal1.x,
    y: fixedWorld.y - anchorLocal1.y,
  }

  return {
    x: center1.x - width / 2,
    y: center1.y - height / 2,
    width,
    height,
  }
}

export function angleFromCenter(center: Vec, point: Vec): number {
  return (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI
}
