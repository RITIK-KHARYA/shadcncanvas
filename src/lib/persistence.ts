import type { CanvasEdge, CanvasNode } from "@/types/graph"
import type { ThemeTokens } from "@/store/themeStore"

const STORAGE_KEY = "shadcncanvas-project-v1"

export type SavedProject = {
  version: 1
  projectName: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
  theme: ThemeTokens
  savedAt: string
}

export function saveProject(data: Omit<SavedProject, "version" | "savedAt">) {
  const payload: SavedProject = {
    version: 1,
    savedAt: new Date().toISOString(),
    ...data,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  return payload
}

export function loadProject(): SavedProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedProject
    if (parsed.version !== 1) return null
    return parsed
  } catch {
    return null
  }
}

export function clearProject() {
  localStorage.removeItem(STORAGE_KEY)
}
