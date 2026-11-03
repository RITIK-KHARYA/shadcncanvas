import { useEffect, useMemo, useState } from "react";

import { formatRelativeTime } from "@/lib/dashboard";
import { loadProject, type SavedProject } from "@/lib/persistence";
import { nodeRegistry } from "@/lib/registry/node-registry";
import { useGraphStore } from "@/store/graph-store";

const MIX_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export type DashboardMixItem = {
  type: string;
  label: string;
  count: number;
  share: number;
  color: string;
};

export type DashboardActivityItem = {
  id: string;
  title: string;
  detail: string;
  kind: "node" | "connection" | "save";
};

export type DashboardData = {
  savedProject: SavedProject | null;
  projectName: string;
  editorMode: string;
  lastSaved: string | null;
  nodes: number;
  edges: number;
  connections: number;
  wiredNodes: number;
  coverage: number;
  completion: number;
  componentMix: DashboardMixItem[];
  activity: DashboardActivityItem[];
  hasContent: boolean;
};

function componentLabel(componentType: string, name?: string) {
  return (
    name?.trim() ||
    nodeRegistry[componentType]?.label ||
    componentType.replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
  );
}

/**
 * Reads the persisted workspace plus any live graph state left over from the
 * builder, then derives the numbers the dashboard renders. Everything is
 * client-local, which matches how the canvas itself persists.
 */
export function useDashboardData(): DashboardData {
  const [savedProject, setSavedProject] = useState<SavedProject | null>(null);

  useEffect(() => {
    setSavedProject(loadProject());
  }, []);

  const liveNodes = useGraphStore((state) => state.nodes);
  const liveEdges = useGraphStore((state) => state.edges);
  const liveConnections = useGraphStore((state) => state.connections);

  return useMemo(() => {
    const nodes = liveNodes.length > 0 ? liveNodes : (savedProject?.board.nodes ?? []);
    const edges = liveEdges.length > 0 ? liveEdges : (savedProject?.board.edges ?? []);
    const connections = liveConnections;

    const linkedNodeIds = new Set<string>();
    for (const edge of edges) {
      linkedNodeIds.add(edge.source);
      linkedNodeIds.add(edge.target);
    }
    for (const connection of connections) {
      if (connection.sourceNodeId) linkedNodeIds.add(connection.sourceNodeId);
      if (connection.targetNodeId) linkedNodeIds.add(connection.targetNodeId);
    }

    const wiredNodes = nodes.filter((node) => linkedNodeIds.has(node.id)).length;
    const coverage = nodes.length > 0 ? Math.round((wiredNodes / nodes.length) * 100) : 0;
    const completion = Math.min(
      100,
      (nodes.length > 0 ? 55 : 0) +
        (edges.length > 0 ? 25 : 0) +
        (connections.length > 0 ? 20 : 0),
    );

    const counts = new Map<string, number>();
    for (const node of nodes) {
      const type = node.data.componentType;
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }

    const componentMix: DashboardMixItem[] = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count], index) => ({
        type,
        label: componentLabel(type),
        count,
        share: nodes.length > 0 ? Math.round((count / nodes.length) * 100) : 0,
        color: MIX_COLORS[index % MIX_COLORS.length],
      }));

    const activity: DashboardActivityItem[] = [];
    for (const node of [...nodes].slice(-3).reverse()) {
      activity.push({
        id: `node-${node.id}`,
        title: `${componentLabel(node.data.componentType, node.data.name)} on the canvas`,
        detail: "Board canvas",
        kind: "node",
      });
    }
    if (connections.length > 0) {
      activity.push({
        id: "connections",
        title: `${connections.length} connection${connections.length === 1 ? "" : "s"} wired`,
        detail: "Typed port connections",
        kind: "connection",
      });
    }
    if (savedProject?.savedAt) {
      activity.push({
        id: "saved",
        title: "Workspace saved",
        detail: formatRelativeTime(savedProject.savedAt),
        kind: "save",
      });
    }

    return {
      savedProject,
      projectName: savedProject?.projectName ?? "Untitled canvas",
      editorMode: savedProject?.editorMode ?? "board",
      lastSaved: savedProject?.savedAt ?? null,
      nodes: nodes.length,
      edges: edges.length,
      connections: connections.length,
      wiredNodes,
      coverage,
      completion,
      componentMix,
      activity: activity.slice(0, 5),
      hasContent: nodes.length > 0 || edges.length > 0,
    };
  }, [liveNodes, liveEdges, liveConnections, savedProject]);
}
