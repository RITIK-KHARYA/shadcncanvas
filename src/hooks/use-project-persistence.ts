import { useEffect, useState } from "react"
import { loadProject, saveProject } from "@/lib/persistence"
import { useGraphStore } from "@/store/graph-store"
import { useThemeModeStore } from "@/store/theme-mode-store"
import { useEditorModeStore } from "@/store/editor-mode-store"
import { useDocumentStore } from "@/store/document-store"

const AUTOSAVE_DEBOUNCE_MS = 500
const DEFAULT_PROJECT_NAME = "Untitled shadcn canvas"

export type ProjectPersistence = {
  projectName: string
  setProjectName: (name: string) => void
  lastSaved: string | null
}

/**
 * Owns the project's identity (name), theme mode, editor mode and both the
 * board graph and the design document. Restores them from localStorage on
 * mount and writes them back on a debounce whenever anything changes.
 */
export function useProjectPersistence(): ProjectPersistence {
  const mode = useThemeModeStore((s) => s.mode)
  const setMode = useThemeModeStore((s) => s.setMode)

  const editorMode = useEditorModeStore((s) => s.mode)
  const setEditorMode = useEditorModeStore((s) => s.setMode)

  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const hydrate = useGraphStore((s) => s.hydrate)

  const designNodes = useDocumentStore((s) => s.nodes)
  const designPages = useDocumentStore((s) => s.pages)
  const designCurrentPageId = useDocumentStore((s) => s.currentPageId)

  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = loadProject()

    if (saved) {
      hydrate(saved.board.nodes, saved.board.edges)
      setMode(saved.mode)
      setEditorMode(saved.editorMode)
      setProjectName(saved.projectName)
      if (saved.design) {
        useDocumentStore.getState().replaceDocument(saved.design)
        useDocumentStore.temporal.getState().clear()
      }
      setLastSaved(saved.savedAt)
    }

    setHydrated(true)
  }, [hydrate, setMode, setEditorMode])

  useEffect(() => {
    if (!hydrated) return

    const timer = window.setTimeout(() => {
      const payload = saveProject({
        projectName,
        mode,
        editorMode,
        board: { nodes, edges },
        design: useDocumentStore.getState().getDocument(),
      })
      setLastSaved(payload.savedAt)
    }, AUTOSAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [
    hydrated,
    projectName,
    nodes,
    edges,
    mode,
    editorMode,
    designNodes,
    designPages,
    designCurrentPageId,
  ])

  return { projectName, setProjectName, lastSaved }
}
