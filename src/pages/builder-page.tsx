import { Box, Copy, Download, Redo2, Trash2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Canvas } from "@/components/canvas/Canvas";
import { EditorSidebar } from "@/components/inspector/EditorSidebar";
import { ComponentLibrary } from "@/components/sidebar/ComponentLibrary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateFullCode, generateNodeCode } from "@/lib/codegen";
import { exportProjectZip } from "@/lib/exportZip";
import { loadProject, saveProject } from "@/lib/persistence";
import { useGraphStore } from "@/store/graphStore";
import { useEditorStore } from "@/store/editor-store";
import { applyThemeToElement } from "@/utils/apply-theme";

export function BuilderPage() {
  const themeState = useEditorStore((s) => s.themeState);
  const activeMode = themeState.currentMode;
  const activeStyles = themeState.styles[activeMode];

  const tokens = useMemo(
    () => ({
      primary: activeStyles.primary,
      secondary: activeStyles.secondary,
      background: activeStyles.background,
      radius: activeStyles.radius,
    }),
    [activeStyles],
  );

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      applyThemeToElement(themeState, containerRef.current);
    }
  }, [themeState]);

  const hydrated = useRef(false);

  const [projectName, setProjectName] = useState("Untitled shadcn canvas");
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const canUndo = useGraphStore((s) => s.canUndo);
  const canRedo = useGraphStore((s) => s.canRedo);
  const undo = useGraphStore((s) => s.undo);
  const redo = useGraphStore((s) => s.redo);
  const clearCanvas = useGraphStore((s) => s.clearCanvas);
  const hydrate = useGraphStore((s) => s.hydrate);

  const hasCanvasContent = nodes.length > 0 || edges.length > 0;

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  useEffect(() => {
    const saved = loadProject();
    if (saved) {
      hydrate(saved.nodes, saved.edges);
      if (saved.theme) {
        useEditorStore.setState((prev) => {
          const nextStyles = { ...prev.themeState.styles };
          const mode = prev.themeState.currentMode;
          nextStyles[mode] = {
            ...nextStyles[mode],
            primary: saved.theme.primary || nextStyles[mode].primary,
            secondary: saved.theme.secondary || nextStyles[mode].secondary,
            background: saved.theme.background || nextStyles[mode].background,
            radius: saved.theme.radius || nextStyles[mode].radius,
          };
          return {
            ...prev,
            themeState: {
              ...prev.themeState,
              styles: nextStyles,
            },
          };
        });
      }
      setProjectName(saved.projectName);
      setLastSaved(saved.savedAt);
    }
    hydrated.current = true;
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated.current) return;

    const timer = window.setTimeout(() => {
      const payload = saveProject({
        projectName,
        nodes,
        edges,
        theme: tokens,
      });
      setLastSaved(payload.savedAt);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [nodes, edges, tokens, projectName]);

  const handleClearCanvas = useCallback(() => {
    if (!hasCanvasContent) return;

    clearCanvas();
    toast.success("Canvas cleared");
  }, [clearCanvas, hasCanvasContent]);

  const handleCopyCode = useCallback(async () => {
    const code = selectedNode
      ? generateNodeCode(selectedNode)
      : generateFullCode(nodes, edges, tokens);

    if (!code.trim()) {
      toast.error("Nothing to copy — add nodes to the canvas first");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success(
        selectedNode
          ? "Node code copied to clipboard"
          : "Full code copied to clipboard",
      );
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy — check browser permissions");
    }
  }, [edges, nodes, selectedNode, tokens]);

  const handleExportZip = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error("Nothing to export — add nodes to the canvas first");
      return;
    }

    try {
      await exportProjectZip({ nodes, edges, theme: tokens, projectName });
      toast.success("ZIP exported");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed");
    }
  }, [edges, nodes, projectName, tokens]);

  return (
    <main className="flex h-screen min-h-[720px] flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card/60 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Box
            className="size-5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="h-8 max-w-72 border-transparent bg-background/70 font-medium"
          />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {lastSaved
              ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
              : "Saving…"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Undo"
            disabled={!canUndo}
            onClick={undo}
          >
            <Undo2 aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Redo"
            disabled={!canRedo}
            onClick={redo}
          >
            <Redo2 aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove all components from canvas"
            title="Remove all components from canvas"
            className="text-destructive hover:text-destructive"
            disabled={!hasCanvasContent}
            onClick={handleClearCanvas}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy aria-hidden="true" />
            Copy Code
          </Button>
          <Button size="sm" onClick={handleExportZip}>
            <Download aria-hidden="true" />
            Export ZIP
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[250px_minmax(540px,1fr)_300px]">
        <aside className="flex min-h-0 flex-col border-r bg-sidebar text-sidebar-foreground">
          <ComponentLibrary />
        </aside>

        <section
          ref={containerRef}
          className="canvas-theme relative h-full min-h-0 overflow-hidden bg-background text-foreground"
        >
          <Canvas />
        </section>

        <aside className="flex min-h-0 flex-col border-l bg-sidebar text-sidebar-foreground">
          <EditorSidebar />
        </aside>
      </div>
    </main>
  );
}
