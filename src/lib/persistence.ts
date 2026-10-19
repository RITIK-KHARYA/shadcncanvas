import type { CanvasEdge, CanvasNode } from "@/types/graph"
import type { DesignDocument } from "@/types/document"
import type { EditorMode } from "@/store/editor-mode-store"
import { DEFAULT_THEME_MODE, isThemeMode, type ThemeMode } from "@/lib/theme"

const STORAGE_KEY = "shadcncanvas-project-v1"

export type BoardSnapshot = {
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

export type SavedProject = {
  version: 3
  projectName: string
  mode: ThemeMode
  editorMode: EditorMode
  board: BoardSnapshot
  design: DesignDocument | null
  savedAt: string
}

type StoredProject = {
  version?: number
  projectName?: string
  mode?: unknown
  theme?: unknown
  editorMode?: unknown
  board?: Partial<BoardSnapshot>
  design?: unknown
  nodes?: CanvasNode[]
  edges?: CanvasEdge[]
  savedAt?: string
}

function isEditorMode(value: unknown): value is EditorMode {
  return value === "board" || value === "design"
}

function isDesignDocument(value: unknown): value is DesignDocument {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<DesignDocument>
  return (
    typeof candidate.currentPageId === "string" &&
    Array.isArray(candidate.pages) &&
    Boolean(candidate.nodes) &&
    typeof candidate.nodes === "object"
  )
}

export function saveProject(
  data: Omit<SavedProject, "version" | "savedAt">,
): SavedProject {
  const payload: SavedProject = {
    version: 3,
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

    const parsed = JSON.parse(raw) as StoredProject
    if (
      parsed.version !== 1 &&
      parsed.version !== 2 &&
      parsed.version !== 3
    ) {
      return null
    }

    const board: BoardSnapshot = parsed.board
      ? { nodes: parsed.board.nodes ?? [], edges: parsed.board.edges ?? [] }
      : { nodes: parsed.nodes ?? [], edges: parsed.edges ?? [] }

    return {
      version: 3,
      projectName: parsed.projectName ?? "Untitled shadcn canvas",
      mode: isThemeMode(parsed.mode) ? parsed.mode : DEFAULT_THEME_MODE,
      editorMode: isEditorMode(parsed.editorMode) ? parsed.editorMode : "board",
      board,
      design: isDesignDocument(parsed.design) ? parsed.design : null,
      savedAt: parsed.savedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function clearProject() {
  localStorage.removeItem(STORAGE_KEY)
}
