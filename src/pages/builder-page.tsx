import {
  Box,
  Copy,
  Download,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Redo2,
  Sun,
  Trash2,
  Undo2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Suspense, lazy, useState } from "react";
import { useStore } from "zustand";
import { Canvas } from "@/components/canvas/Canvas";
import { EditorSidebar } from "@/components/inspector/EditorSidebar";
import { ComponentLibrary } from "@/components/sidebar/ComponentLibrary";
import { LayersPanel } from "@/components/design/panels/LayersPanel";
import { DesignInspector } from "@/components/design/panels/DesignInspector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useBuilderActions } from "@/hooks/use-builder-actions";
import { useProjectPersistence } from "@/hooks/use-project-persistence";
import { useGraphStore } from "@/store/graph-store";
import { useThemeModeStore } from "@/store/theme-mode-store";
import { useEditorModeStore, type EditorMode } from "@/store/editor-mode-store";
import { useDocumentStore } from "@/store/document-store";
import {
  downloadDesignCode,
  generateDesignCode,
} from "@/lib/design/codegen";
import { useAuth } from "@/hooks/use-auth";

const DesignSurface = lazy(() =>
  import("@/components/design/DesignSurface").then((module) => ({
    default: module.DesignSurface,
  })),
);

const MODES: EditorMode[] = ["board", "design"];

export function BuilderPage() {
  const { projectName, setProjectName, lastSaved } = useProjectPersistence();
  const { isAuthenticated } = useAuth();

  const { hasCanvasContent, onClearCanvas, onCopyCode, onExportZip, onLogout } =
    useBuilderActions({ projectName });

  const canUndoBoard = useGraphStore((s) => s.canUndo);
  const canRedoBoard = useGraphStore((s) => s.canRedo);
  const undoBoard = useGraphStore((s) => s.undo);
  const redoBoard = useGraphStore((s) => s.redo);

  const canUndoDesign = useStore(
    useDocumentStore.temporal,
    (s) => s.pastStates.length > 0,
  );
  const canRedoDesign = useStore(
    useDocumentStore.temporal,
    (s) => s.futureStates.length > 0,
  );

  const mode = useThemeModeStore((s) => s.mode);
  const toggleMode = useThemeModeStore((s) => s.toggleMode);

  const editorMode = useEditorModeStore((s) => s.mode);
  const setEditorMode = useEditorModeStore((s) => s.setMode);

  const [panelsOpen, setPanelsOpen] = useState(true);
  const [designCopied, setDesignCopied] = useState(false);

  const isDesign = editorMode === "design";
  const canUndo = isDesign ? canUndoDesign : canUndoBoard;
  const canRedo = isDesign ? canRedoDesign : canRedoBoard;

  // Undo/redo route to the correct store depending on the active mode.
  const onUndo = () => {
    if (isDesign) useDocumentStore.temporal.getState().undo();
    else undoBoard();
  };
  const onRedo = () => {
    if (isDesign) useDocumentStore.temporal.getState().redo();
    else redoBoard();
  };

  const onDesignCopy = () => {
    const code = generateDesignCode(useDocumentStore.getState().getDocument());
    if (!code) return;
    void navigator.clipboard.writeText(code);
    setDesignCopied(true);
    window.setTimeout(() => setDesignCopied(false), 1500);
  };

  const onDesignExport = () => {
    const code = generateDesignCode(useDocumentStore.getState().getDocument());
    if (!code) return;
    downloadDesignCode(code, `${projectName.trim() || "Design"}.tsx`);
  };

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
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-hairline bg-card/40 px-4 backdrop-blur-xl">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                panelsOpen ? "Hide side panels" : "Show side panels"
              }
              title={panelsOpen ? "Hide side panels" : "Show side panels"}
              aria-expanded={panelsOpen}
              onClick={() => setPanelsOpen((open) => !open)}
            >
              {panelsOpen ? (
                <PanelLeftClose aria-hidden="true" />
              ) : (
                <PanelLeftOpen aria-hidden="true" />
              )}
            </Button>
            <Box
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              aria-label="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="h-8 max-w-72 border-transparent bg-surface font-medium"
            />
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {lastSaved
                ? `Saved ${new Date(lastSaved).toLocaleTimeString()}`
                : "Saving…"}
            </span>
            <div className="flex shrink-0 items-center rounded-lg border border-hairline bg-surface p-0.5">
              {MODES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={editorMode === item}
                  onClick={() => setEditorMode(item)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs capitalize transition-colors",
                    editorMode === item
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              aria-pressed={mode === "light"}
              onClick={toggleMode}
            >
              {mode === "dark" ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Undo"
              disabled={!canUndo}
              onClick={onUndo}
            >
              <Undo2 aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Redo"
              disabled={!canRedo}
              onClick={onRedo}
            >
              <Redo2 aria-hidden="true" />
            </Button>
            {!isDesign && (
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
            )}
          </div>
          <div className="flex items-center gap-2">
            {isDesign ? (
              <>
                <Button variant="outline" size="sm" onClick={onDesignCopy}>
                  <Copy aria-hidden="true" />
                  {designCopied ? "Copied" : "Copy Code"}
                </Button>
                <Button size="sm" onClick={onDesignExport}>
                  <Download aria-hidden="true" />
                  Download .tsx
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onCopyCode}>
                  <Copy aria-hidden="true" />
                  Copy Code
                </Button>
                <Button size="sm" onClick={onExportZip}>
                  <Download aria-hidden="true" />
                  Export ZIP
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button size="sm" onClick={onLogout}>
                <LogOut aria-hidden="true" />
                Log Out
              </Button>
            )}
          </div>
        </header>

        <div
          className={cn(
            "grid min-h-0 flex-1 transition-[grid-template-columns] duration-300 ease-out",
            panelsOpen
              ? "grid-cols-[272px_minmax(540px,1fr)_272px]"
              : "grid-cols-[0px_minmax(540px,1fr)_0px]",
          )}
        >
          <aside
            className={cn(
              "flex min-h-0 min-w-0 flex-col overflow-hidden transition-[padding] duration-300 ease-out",
              panelsOpen ? "py-3 pl-3" : "p-0",
            )}
          >
            <div
              inert={!panelsOpen}
              className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-hairline/60 bg-sidebar text-sidebar-foreground shadow-sm transition-[opacity,transform] duration-300 ease-out",
                panelsOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-2 opacity-0",
              )}
            >
              <div
                key={editorMode}
                className="flex h-full min-h-0 animate-in flex-col overflow-hidden fade-in duration-300 slide-in-from-left-2"
              >
                {isDesign ? <LayersPanel /> : <ComponentLibrary />}
              </div>
            </div>
          </aside>

          <section className="relative h-full min-h-0 overflow-hidden bg-background text-foreground">
            <div
              key={editorMode}
              className="h-full w-full animate-in fade-in duration-300 zoom-in-95"
            >
              {isDesign ? (
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-[#f1f1f3] text-xs text-muted-foreground">
                      Loading design surface…
                    </div>
                  }
                >
                  <DesignSurface />
                </Suspense>
              ) : (
                <Canvas />
              )}
            </div>
          </section>

          <aside
            className={cn(
              "flex min-h-0 min-w-0 flex-col overflow-hidden transition-[padding] duration-300 ease-out",
              panelsOpen ? "py-3 pr-3" : "p-0",
            )}
          >
            <div
              inert={!panelsOpen}
              className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-hairline/60 bg-sidebar text-sidebar-foreground shadow-sm transition-[opacity,transform] duration-300 ease-out",
                panelsOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-2 opacity-0",
              )}
            >
              <div
                key={editorMode}
                className="flex h-full min-h-0 animate-in flex-col overflow-hidden fade-in duration-300 slide-in-from-right-2"
              >
                {isDesign ? <DesignInspector /> : <EditorSidebar />}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
