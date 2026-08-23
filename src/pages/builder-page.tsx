import { Box, Copy, Download, Redo2, Undo2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { Canvas } from "@/components/canvas/Canvas"
import { EdgeInspector } from "@/components/inspector/EdgeInspector"
import { Inspector } from "@/components/inspector/Inspector"
import { ThemePanel } from "@/components/inspector/ThemePanel"
import { ComponentLibrary } from "@/components/sidebar/ComponentLibrary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateFullCode, generateNodeCode } from "@/lib/codegen"
import { exportProjectZip } from "@/lib/exportZip"
import { loadProject, saveProject } from "@/lib/persistence"
import { useGraphStore } from "@/store/graphStore"
import {
  themeTokensToStyle,
  useThemeStore,
} from "@/store/themeStore"

export function BuilderPage() {
  const tokens = useThemeStore((s) => s.tokens)
  const themeStyle = themeTokensToStyle(tokens)
  const hydrated = useRef(false)

  const [projectName, setProjectName] = useState("Untitled shadcn canvas")
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId)
  const canUndo = useGraphStore((s) => s.canUndo)
  const canRedo = useGraphStore((s) => s.canRedo)
  const undo = useGraphStore((s) => s.undo)
  const redo = useGraphStore((s) => s.redo)
  const hydrate = useGraphStore((s) => s.hydrate)

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  useEffect(() => {
    const saved = loadProject()
    if (saved) {
      hydrate(saved.nodes, saved.edges)
      useThemeStore.setState({ tokens: saved.theme })
      setProjectName(saved.projectName)
      setLastSaved(saved.savedAt)
    }
    hydrated.current = true
  }, [hydrate])

  useEffect(() => {
    if (!hydrated.current) return

    const timer = window.setTimeout(() => {
      const payload = saveProject({
        projectName,
        nodes,
        edges,
        theme: tokens,
      })
      setLastSaved(payload.savedAt)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [nodes, edges, tokens, projectName])

  const handleCopyCode = useCallback(async () => {
    const code = selectedNode
      ? generateNodeCode(selectedNode)
      : generateFullCode(nodes, edges, tokens)

    if (!code.trim()) {
      toast.error("Nothing to copy — add nodes to the canvas first")
      return
    }

    try {
      await navigator.clipboard.writeText(code)
      toast.success(
        selectedNode
          ? "Node code copied to clipboard"
          : "Full code copied to clipboard",
      )
    } catch (err) {
      console.error("Copy failed:", err)
      toast.error("Failed to copy — check browser permissions")
    }
  }, [edges, nodes, selectedNode, tokens])

  const handleExportZip = useCallback(async () => {
    if (nodes.length === 0) {
      toast.error("Nothing to export — add nodes to the canvas first")
      return
    }

    try {
      await exportProjectZip({ nodes, edges, theme: tokens, projectName })
      toast.success("ZIP exported")
    } catch (err) {
      console.error("Export failed:", err)
      toast.error("Export failed")
    }
  }, [edges, nodes, projectName, tokens])

  return (
    <main className="flex h-screen min-h-[720px] flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card/60 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Box className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="h-8 max-w-72 border-transparent bg-background/70 font-medium"
          />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : "Saving…"}
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
          className="canvas-theme dark relative h-full min-h-0 overflow-hidden bg-background text-foreground"
          style={themeStyle}
        >
          <Canvas />
        </section>

        <aside className="flex min-h-0 flex-col border-l bg-sidebar text-sidebar-foreground">
          <div className="border-b p-4">
            <h2 className="text-sm font-semibold">Inspector</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a node or wire to edit.
            </p>
          </div>
          <div className="scrollbar-thin grid min-h-0 flex-1 gap-4 overflow-y-auto p-4">
            <EdgeInspector />
            <Inspector />
            <ThemePanel />
          </div>
        </aside>
      </div>
    </main>
  )
}
