import { describe, expect, it } from "vitest";
import { buildTemplateGraph, DASHBOARD_TEMPLATES } from "@/lib/dashboard-templates";

describe("DASHBOARD_TEMPLATES", () => {
  it("contains templates with required fields", () => {
    for (const template of DASHBOARD_TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.components.length).toBeGreaterThan(0);
      expect(Array.isArray(template.links)).toBe(true);
    }
  });
});

describe("buildTemplateGraph", () => {
  it("builds nodes and edges for a template", () => {
    const template = DASHBOARD_TEMPLATES[0];
    const graph = buildTemplateGraph(template);

    expect(graph.nodes.length).toBe(template.components.length);
    expect(graph.edges.length).toBe(template.links.length);

    for (const node of graph.nodes) {
      expect(node.type).toBe("baseNode");
      expect(typeof node.id).toBe("string");
      expect(node.id.length).toBeGreaterThan(0);
    }

    for (const edge of graph.edges) {
      expect(typeof edge.id).toBe("string");
      expect(graph.nodes.some((node) => node.id === edge.source)).toBe(true);
      expect(graph.nodes.some((node) => node.id === edge.target)).toBe(true);
    }
  });

  it("spreads component props into node data", () => {
    const template = DASHBOARD_TEMPLATES.find((item) => item.id === "settings-panel")!;
    const graph = buildTemplateGraph(template);
    const labelNode = graph.nodes.find((node) => node.data.componentType === "label");

    expect(labelNode).toBeTruthy();
    expect(labelNode!.data.props).toEqual(
      expect.objectContaining({
        text: "Email notifications",
      }),
    );
  });
});
