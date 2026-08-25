import { MousePointerClick } from "lucide-react";

import { ApiInspector } from "@/components/inspector/ApiInspector";
import { AppearanceSection } from "@/components/inspector/properties/AppearanceSection";
import { ContentSection } from "@/components/inspector/properties/ContentSection";
import { EffectsSection } from "@/components/inspector/properties/EffectsSection";
import { PositionSection } from "@/components/inspector/properties/PositionSection";
import { nodeRegistry } from "@/lib/nodeRegistry";
import type { CanvasNode } from "@/types/graph";

export function PropertiesPanel({ node }: { node: CanvasNode | null }) {
  if (!node) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
        <MousePointerClick
          className="size-5 text-muted-foreground/50"
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Select an object to inspect
          <br />
          its properties.
        </p>
      </div>
    );
  }

  const config = nodeRegistry[node.data.componentType];
  if (!config) {
    return (
      <div className="border-t px-4 py-3">
        <p className="text-xs text-destructive">
          Unknown node type: {node.data.componentType}
        </p>
      </div>
    );
  }

  const isApiCall = node.data.componentType === "apiCall";

  return (
    <div>
      <PositionSection node={node} />
      {isApiCall ? (
        <ApiInspector node={node} />
      ) : (
        <>
          <AppearanceSection node={node} config={config} />
          <ContentSection node={node} />
        </>
      )}
      <EffectsSection node={node} config={config} />
    </div>
  );
}
