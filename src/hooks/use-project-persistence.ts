import { useEffect, useState } from "react"
import { loadProject, saveProject } from "@/lib/persistence"
import { useEditorStore } from "@/store/editor-store"
import { useGraphStore } from "@/store/graph-store"
import { mergeThemeTokens } from "@/theme/merge-tokens"
import { useThemeTokens } from "./use-theme-tokens"

const AUTOSAVE_DEBOUNCE_MS = 500
const DEFAULT_PROJECT_NAME = "Untitled shadcn canvas"

export type ProjectPersistence = {
  projectName: string
  setProjectName: (name: string) => void
  lastSaved: string | null
  tokens: ReturnType<typeof useThemeTokens>
}

/**
 * Owns the project's identity (name), restoring it from localStorage on mount
 * and writing it back on a debounce whenever the graph or theme changes.
 */
export function useProjectPersistence(): ProjectPersistence {
  const tokens = useThemeTokens()

  const nodes = useGraphStore((s) => s.nodes)
  const edges = useGraphStore((s) => s.edges)
  const hydrate = useGraphStore((s) => s.hydrate)

  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Restore the saved project into the stores once, on mount.
  useEffect(() => {
    const saved = loadProject()

    if (saved) {
      hydrate(saved.nodes, saved.edges)

      if (saved.theme) {
        useEditorStore.setState((prev) => ({
          ...prev,
          themeState: mergeThemeTokens(prev.themeState, saved.theme),
        }))
      }

      setProjectName(saved.projectName)
      setLastSaved(saved.savedAt)
    }

    setHydrated(true)
  }, [hydrate])

  // Autosave, debounced. `hydrated` is a dependency rather than a ref read so
  // the first write can only ever run against the post-hydration graph — a ref
  // flipped during the load would be observed as `true` here and schedule a
  // save from the stale pre-hydration nodes/edges closure.
  useEffect(() => {
    if (!hydrated) return

    const timer = window.setTimeout(() => {
      const payload = saveProject({ projectName, nodes, edges, theme: tokens })
      setLastSaved(payload.savedAt)
    }, AUTOSAVE_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [hydrated, projectName, nodes, edges, tokens])

  return { projectName, setProjectName, lastSaved, tokens }
}
