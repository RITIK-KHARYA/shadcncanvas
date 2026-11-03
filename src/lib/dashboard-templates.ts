import { nodeRegistry } from "@/lib/registry/node-registry";
import type { CanvasEdge, CanvasNode } from "@/types/graph";

export type DashboardTemplateComponent = {
  type: string;
  x: number;
  y: number;
  props?: Record<string, unknown>;
};

export type DashboardTemplateLink = {
  source: number;
  sourcePort: string;
  target: number;
  targetPort: string;
};

export type DashboardTemplate = {
  id: string;
  name: string;
  tag: string;
  description: string;
  components: DashboardTemplateComponent[];
  links: DashboardTemplateLink[];
};

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: "contact-form",
    name: "Contact form",
    tag: "Form",
    description:
      "A form with a submit button that disables while the submission is in flight.",
    components: [
      { type: "form", x: 120, y: 120 },
      {
        type: "button",
        x: 560,
        y: 160,
        props: { label: "Send message" },
      },
    ],
    links: [
      {
        source: 0,
        sourcePort: "submitted",
        target: 1,
        targetPort: "disabled",
      },
    ],
  },
  {
    id: "settings-panel",
    name: "Settings panel",
    tag: "Preferences",
    description:
      "A compact preferences surface with switches, a checkbox, and supporting labels.",
    components: [
      { type: "card", x: 120, y: 120 },
      { type: "switch", x: 560, y: 160 },
      { type: "checkbox", x: 560, y: 260 },
      {
        type: "label",
        x: 560,
        y: 360,
        props: { text: "Email notifications" },
      },
    ],
    links: [],
  },
  {
    id: "analytics-panel",
    name: "Analytics panel",
    tag: "Data",
    description:
      "A chart-led analytics surface with a live badge, summary card, and divider.",
    components: [
      { type: "chart", x: 120, y: 120 },
      { type: "card", x: 620, y: 120 },
      { type: "badge", x: 120, y: 60, props: { label: "Live" } },
      { type: "separator", x: 620, y: 320 },
    ],
    links: [],
  },
];

export function buildTemplateGraph(template: DashboardTemplate) {
  const nodes: CanvasNode[] = template.components.map((component) => {
    const config = nodeRegistry[component.type];
    return {
      id: crypto.randomUUID(),
      type: "baseNode",
      position: { x: component.x, y: component.y },
      data: {
        componentType: component.type,
        props: {
          ...config?.defaultProps,
          ...component.props,
        },
        state: {},
        layout: { sizeMode: "default" },
      },
    };
  });

  const edges: CanvasEdge[] = template.links.map((link) => ({
    id: crypto.randomUUID(),
    source: nodes[link.source].id,
    target: nodes[link.target].id,
    sourceHandle: link.sourcePort,
    targetHandle: link.targetPort,
    data: { transform: "passthrough" },
  }));

  return { nodes, edges };
}
