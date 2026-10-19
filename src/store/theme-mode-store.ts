import { create } from "zustand"

import {
  applyThemeMode,
  clearLegacyThemeStorage,
  loadThemeMode,
  saveThemeMode,
  type ThemeMode,
} from "@/lib/theme"

type ThemeModeStore = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const initialMode = loadThemeMode()

applyThemeMode(initialMode)
clearLegacyThemeStorage()

export const useThemeModeStore = create<ThemeModeStore>((set, get) => ({
  mode: initialMode,
  setMode: (mode) => {
    saveThemeMode(mode)
    applyThemeMode(mode)
    set({ mode })
  },
  toggleMode: () => {
    get().setMode(get().mode === "dark" ? "light" : "dark")
  },
}))
