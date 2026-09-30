import { Box, Copy, Download, LogOut, Redo2, Trash2, Undo2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Canvas } from "@/components/canvas/Canvas";
import { EditorSidebar } from "@/components/inspector/EditorSidebar";
import { ComponentLibrary } from "@/components/sidebar/ComponentLibrary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBuilderActions } from "@/hooks/use-builder-actions";
import { useCanvasThemeRef } from "@/hooks/use-canvas-theme";
import { useProjectPersistence } from "@/hooks/use-project-persistence";
import { useGraphStore } from "@/store/graph-store";

export function BuilderPage() {
  const { projectName, setProjectName, lastSaved, tokens } =
    useProjectPersistence();

  const { hasCanvasContent, onClearCanvas, onCopyCode, onExportZip, onLogout } =
    useBuilderActions({ projectName, tokens });

  const containerRef = useCanvasThemeRef();

  const canUndo = useGraphStore((s) => s.canUndo);
  const canRedo = useGraphStore((s) => s.canRedo);
  const undo = useGraphStore((s) => s.undo);
  const redo = useGraphStore((s) => s.redo);

  return (
    <>
      {/* Authenticated, noindex route. A self-referencing canonical and
          JSON-LD would contradict `noindex`, so only share-preview tags and
          the robots directive are set here. Global tags live in index.html. */}
      <Helmet>
        <title>Builder — Shadcn Canvas</title>
        <meta
          name="description"
          content="Create and export shadcn/ui components with the visual builder. Drag components onto canvas, wire logic, and generate production-ready React code."
        />
        <meta name="robots" content="noindex, nofollow" />

        <meta property="og:url" content="https://shadcncanvas.vercel.app/app" />
        <meta property="og:title" content="Builder — Shadcn Canvas" />
        <meta
          property="og:description"
          content="Drag, wire, and export production-ready shadcn/ui React code."
        />

        <meta name="twitter:title" content="Builder — Shadcn Canvas" />
        <meta
          name="twitter:description"
          content="Drag, wire, and export production-ready shadcn/ui React code."
        />
      </Helmet>
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
              onClick={onClearCanvas}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onCopyCode}>
              <Copy aria-hidden="true" />
              Copy Code
            </Button>
            <Button size="sm" onClick={onExportZip}>
              <Download aria-hidden="true" />
              Export ZIP
            </Button>
            <Button size="sm" onClick={onLogout}>
              <LogOut aria-hidden="true" />
              Log Out
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
    </>
  );
}
