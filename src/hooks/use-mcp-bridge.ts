import { useEffect, useRef } from "react"

import type { Connection } from "@/lib/connection-engine"
import { useGraphStore } from "@/store/graph-store"
import type { CanvasEdge, CanvasNode } from "@/types/graph"

type BridgeSnapshot = {
  nodes?: CanvasNode[]
  edges?: CanvasEdge[]
  connections?: Connection[]
}

function resolveNodeId(
  nodes: CanvasNode[],
  componentType: string,
  preferred?: string,
): string | undefined {
  if (preferred && nodes.some((node) => node.id === preferred)) return preferred
  for (let i = nodes.length - 1; i >= 0; i -= 1) {
    if (nodes[i].data.componentType === componentType) return nodes[i].id
  }
  return undefined
}

function connectionToEdge(
  connection: Connection,
  nodes: CanvasNode[],
): CanvasEdge | null {
  const source = resolveNodeId(
    nodes,
    connection.sourceId,
    connection.sourceNodeId,
  )
  const target = resolveNodeId(
    nodes,
    connection.targetId,
    connection.targetNodeId,
  )
  if (!source || !target) return null

  return {
    id: `mcp-${connection.id}`,
    source,
    target,
    sourceHandle: connection.sourcePort,
    targetHandle: connection.targetPort,
    animated: true,
    data: { transform: connection.transform ?? "passthrough" },
  }
}

function materializeConnections(connections: Connection[]) {
  const store = useGraphStore.getState()
  const mapped = connections
    .map((connection) => connectionToEdge(connection, store.nodes))
    .filter((edge): edge is CanvasEdge => edge !== null)
  if (mapped.length > 0) store.mergeRemoteEdges(mapped)
}

/**
 * Subscribes the browser canvas to the dev server's MCP bridge. The server
 * store is authoritative for components created through the MCP tools; this
 * hook merges those nodes/connections into the client store and renders the
 * type-level connections as React Flow edges.
 */
export function useMcpBridge() {
  const remoteConnections = useRef<Connection[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return
    }

    const events = new EventSource("/api/events")

    const onSnapshot = (event: Event) => {
      const snapshot = JSON.parse((event as MessageEvent).data) as BridgeSnapshot
      remoteConnections.current = snapshot.connections ?? []

      const store = useGraphStore.getState()
      store.mergeRemoteNodes(snapshot.nodes ?? [])
      store.mergeRemoteConnections(snapshot.connections ?? [])
      store.mergeRemoteEdges(snapshot.edges ?? [])
      materializeConnections(remoteConnections.current)
    }

    const onNodeAdded = (event: Event) => {
      const node = JSON.parse((event as MessageEvent).data) as CanvasNode
      useGraphStore.getState().mergeRemoteNodes([node])
      materializeConnections(remoteConnections.current)
    }

    const onConnectionAdded = (event: Event) => {
      const connection = JSON.parse((event as MessageEvent).data) as Connection
      if (!remoteConnections.current.some((item) => item.id === connection.id)) {
        remoteConnections.current = [...remoteConnections.current, connection]
      }
      useGraphStore.getState().mergeRemoteConnections([connection])
      materializeConnections(remoteConnections.current)
    }

    events.addEventListener("snapshot", onSnapshot)
    events.addEventListener("node.added", onNodeAdded)
    events.addEventListener("connection.added", onConnectionAdded)

    return () => {
      events.removeEventListener("snapshot", onSnapshot)
      events.removeEventListener("node.added", onNodeAdded)
      events.removeEventListener("connection.added", onConnectionAdded)
      events.close()
    }
  }, [])
}
