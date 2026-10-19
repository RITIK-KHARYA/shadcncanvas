export type ThemeMode = "light" | "dark"

export const DEFAULT_THEME_MODE: ThemeMode = "dark"
export const THEME_STORAGE_KEY = "shadcncanvas-theme"

const LEGACY_THEME_STORAGE_KEY = "shadcn-canvas-theme-editor"

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark"
}

export function loadThemeMode(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME_MODE

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isThemeMode(stored) ? stored : DEFAULT_THEME_MODE
  } catch {
    return DEFAULT_THEME_MODE
  }
}

export function saveThemeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch {
    // Storage may be unavailable; the in-memory mode still applies.
  }
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") return
  document.documentElement.classList.toggle("dark", mode === "dark")
}

export function clearLegacyThemeStorage(): void {
  try {
    window.localStorage.removeItem(LEGACY_THEME_STORAGE_KEY)
  } catch {
    // Nothing to clean up.
  }
}
