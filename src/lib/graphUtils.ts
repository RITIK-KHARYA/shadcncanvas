import type { Connection } from "@xyflow/react"

import type { CanvasEdge } from "@/types/graph"

export function wouldCreateCycle(
  connection: Pick<Connection, "source" | "target">,
  edges: CanvasEdge[],
): boolean {
  if (!connection.source || !connection.target) return false
  if (connection.source === connection.target) return true

  const adjacency = new Map<string, string[]>()

  for (const edge of edges) {
    if (!edge.source || !edge.target) continue
    const next = adjacency.get(edge.source) ?? []
    next.push(edge.target)
    adjacency.set(edge.source, next)
  }

  const proposed = adjacency.get(connection.source) ?? []
  proposed.push(connection.target)
  adjacency.set(connection.source, proposed)

  const visited = new Set<string>()
  const stack = [connection.target]

  while (stack.length > 0) {
    const current = stack.pop()!
    if (current === connection.source) return true
    if (visited.has(current)) continue
    visited.add(current)
    for (const next of adjacency.get(current) ?? []) {
      stack.push(next)
    }
  }

  return false
}

export type TransformType = "passthrough" | "invert" | "negate"

export function evalTransform(
  transform: string,
  value: boolean | string | number,
): boolean | string | number {
  switch (transform) {
    case "invert":
      return typeof value === "boolean" ? !value : value
    case "negate":
      return typeof value === "number" ? -value : value
    case "passthrough":
    default:
      return value
  }
}

/** @deprecated use evalTransform */
export const applyTransform = evalTransform

export function edgeStrokeColor(transform?: string): string {
  if (transform === "invert") return "#f97316"
  return "#22c55e"
}

export const EDGE_TRANSFORMS = [
  { value: "passthrough", label: "Passthrough" },
  { value: "invert", label: "Invert" },
  { value: "negate", label: "Negate (numbers)" },
] as const
