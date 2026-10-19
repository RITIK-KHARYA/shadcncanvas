import { create } from "zustand"

/**
 * Tracks which editor surface is active: the wiring-board canvas (default) or
 * the Figma-style design canvas. Persisted across reloads via the project
 * persistence layer.
 */

export type EditorMode = "board" | "design"

type EditorModeStore = {
  mode: EditorMode
  setMode: (mode: EditorMode) => void
  toggle: () => void
}

export const useEditorModeStore = create<EditorModeStore>((set) => ({
  mode: "board",
  setMode: (mode) => set({ mode }),
  toggle: () => set((state) => ({ mode: state.mode === "board" ? "design" : "board" })),
}))
