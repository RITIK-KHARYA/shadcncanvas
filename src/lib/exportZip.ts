import { saveAs } from "file-saver";
import JSZip from "jszip";

import { generateFullCode } from "@/lib/codegen";
import type { CanvasEdge, CanvasNode } from "@/types/graph";
import type { ThemeTokens } from "@/store/theme-store";

export async function exportProjectZip(options: {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  theme: ThemeTokens;
  projectName: string;
}) {
  const { nodes, edges, theme, projectName } = options;
  const code = generateFullCode(nodes, edges, theme);
  const safeName = projectName.trim() || "shadcncanvas";

  const zip = new JSZip();
  zip.file("GeneratedComponent.tsx", code);
  zip.file("graph.json", JSON.stringify({ nodes, edges }, null, 2));
  zip.file("theme.json", JSON.stringify(theme, null, 2));
  zip.file(
    "README.txt",
    `Exported from shadcn-canvas\nProject: ${safeName}\n\nFiles:\n- GeneratedComponent.tsx — React JSX\n- graph.json — canvas graph\n- theme.json — theme tokens\n`,
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${safeName.replace(/\s+/g, "-").toLowerCase()}.zip`);
}
