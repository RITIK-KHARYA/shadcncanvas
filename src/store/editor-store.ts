import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ThemeEditorState, ThemeHistoryEntry, ThemeStyles, themeStylesSchema } from "@/types/theme"
import { defaultThemeState, defaultLightThemeStyles, defaultDarkThemeStyles } from "@/config/theme"

export const THEME_PRESETS: Record<string, ThemeStyles> = {
  default: {
    light: defaultLightThemeStyles,
    dark: defaultDarkThemeStyles,
  },
  emerald: {
    light: {
      ...defaultLightThemeStyles,
      primary: "oklch(0.627 0.194 149.21)",
      "primary-foreground": "oklch(0.985 0 0)",
      accent: "oklch(0.962 0.018 147.26)",
      "accent-foreground": "oklch(0.205 0 0)",
    },
    dark: {
      ...defaultDarkThemeStyles,
      primary: "oklch(0.627 0.194 149.21)",
      "primary-foreground": "oklch(0.145 0 0)",
      accent: "oklch(0.254 0.049 143.98)",
      "accent-foreground": "oklch(0.985 0 0)",
    },
  },
  violet: {
    light: {
      ...defaultLightThemeStyles,
      primary: "oklch(0.505 0.213 275.12)",
      "primary-foreground": "oklch(0.985 0 0)",
      accent: "oklch(0.951 0.026 283.73)",
      "accent-foreground": "oklch(0.205 0 0)",
    },
    dark: {
      ...defaultDarkThemeStyles,
      primary: "oklch(0.582 0.23 274.62)",
      "primary-foreground": "oklch(0.145 0 0)",
      accent: "oklch(0.231 0.07 273.15)",
      "accent-foreground": "oklch(0.985 0 0)",
    },
  },
  rose: {
    light: {
      ...defaultLightThemeStyles,
      primary: "oklch(0.601 0.22 17.65)",
      "primary-foreground": "oklch(0.985 0 0)",
      accent: "oklch(0.957 0.021 16.58)",
      "accent-foreground": "oklch(0.205 0 0)",
    },
    dark: {
      ...defaultDarkThemeStyles,
      primary: "oklch(0.608 0.22 17.65)",
      "primary-foreground": "oklch(0.145 0 0)",
      accent: "oklch(0.227 0.05 16.58)",
      "accent-foreground": "oklch(0.985 0 0)",
    },
  },
}

const HISTORY_OVERRIDE_THRESHOLD_MS = 300
const MAX_HISTORY_COUNT = 50

export interface EditorStore {
  themeState: ThemeEditorState
  themeCheckpoint: ThemeEditorState | null
  history: ThemeHistoryEntry[]
  future: ThemeHistoryEntry[]

  setThemeState: (
    updater: ThemeEditorState | ((prev: ThemeEditorState) => ThemeEditorState)
  ) => void
  applyThemePreset: (presetName: string) => void
  saveThemeCheckpoint: () => void
  undo: () => void
  redo: () => void
  hasUnsavedChanges: () => boolean
  resetTheme: () => void
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: { ...defaultThemeState },
      themeCheckpoint: { ...defaultThemeState },
      history: [],
      future: [],

      setThemeState: (updater) => {
        const currentState = get().themeState
        const nextState = typeof updater === "function" ? updater(currentState) : updater

        // Runtime validation using Zod
        const validation = themeStylesSchema.safeParse(nextState.styles)
        if (!validation.success) {
          console.error("Theme validation failed:", validation.error)
          return
        }

        // Compare style content and adjustments (ignoring mode or preset name only)
        const stylesChanged =
          JSON.stringify(currentState.styles) !== JSON.stringify(nextState.styles) ||
          JSON.stringify(currentState.hslAdjustments) !== JSON.stringify(nextState.hslAdjustments)

        if (!stylesChanged) {
          set({ themeState: nextState })
          return
        }

        const now = Date.now()
        const history = [...get().history]
        const lastEntry = history[history.length - 1]

        const shouldPushNew = !lastEntry || now - lastEntry.timestamp > HISTORY_OVERRIDE_THRESHOLD_MS

        let newHistory = history
        if (shouldPushNew) {
          newHistory.push({
            styles: currentState.styles,
            hslAdjustments: currentState.hslAdjustments,
            timestamp: now,
          })
          if (newHistory.length > MAX_HISTORY_COUNT) {
            newHistory.shift()
          }
        }

        set({
          themeState: nextState,
          history: newHistory,
          future: [],
        })
      },

      applyThemePreset: (presetName) => {
        const presetStyles = THEME_PRESETS[presetName]
        if (!presetStyles) return

        const currentState = get().themeState
        const updatedState: ThemeEditorState = {
          ...currentState,
          preset: presetName,
          styles: presetStyles,
          hslAdjustments: { hueShift: 0, saturationScale: 1, lightnessScale: 1 },
        }

        const validation = themeStylesSchema.safeParse(presetStyles)
        if (!validation.success) {
          console.error("Preset validation failed:", validation.error)
          return
        }

        const now = Date.now()
        const history = [...get().history]
        history.push({
          styles: currentState.styles,
          hslAdjustments: currentState.hslAdjustments,
          timestamp: now,
        })
        if (history.length > MAX_HISTORY_COUNT) {
          history.shift()
        }

        set({
          themeState: updatedState,
          themeCheckpoint: updatedState,
          history,
          future: [],
        })
      },

      saveThemeCheckpoint: () => {
        set({
          themeCheckpoint: JSON.parse(JSON.stringify(get().themeState)),
        })
      },

      undo: () => {
        const history = [...get().history]
        if (history.length === 0) return

        const prevEntry = history.pop()!
        const currentState = get().themeState

        const nextState: ThemeEditorState = {
          ...currentState,
          styles: prevEntry.styles,
          hslAdjustments: prevEntry.hslAdjustments,
        }

        const future = [...get().future]
        future.push({
          styles: currentState.styles,
          hslAdjustments: currentState.hslAdjustments,
          timestamp: Date.now(),
        })

        set({
          themeState: nextState,
          history,
          future,
        })
      },

      redo: () => {
        const future = [...get().future]
        if (future.length === 0) return

        const nextEntry = future.pop()!
        const currentState = get().themeState

        const nextState: ThemeEditorState = {
          ...currentState,
          styles: nextEntry.styles,
          hslAdjustments: nextEntry.hslAdjustments,
        }

        const history = [...get().history]
        history.push({
          styles: currentState.styles,
          hslAdjustments: currentState.hslAdjustments,
          timestamp: Date.now(),
        })

        set({
          themeState: nextState,
          history,
          future,
        })
      },

      hasUnsavedChanges: () => {
        const checkpoint = get().themeCheckpoint
        if (!checkpoint) return false

        const currentState = get().themeState
        return (
          JSON.stringify(currentState.styles) !== JSON.stringify(checkpoint.styles) ||
          JSON.stringify(currentState.hslAdjustments) !== JSON.stringify(checkpoint.hslAdjustments)
        )
      },

      resetTheme: () => {
        set({
          themeState: JSON.parse(JSON.stringify(defaultThemeState)),
          themeCheckpoint: JSON.parse(JSON.stringify(defaultThemeState)),
          history: [],
          future: [],
        })
      },
    }),
    {
      name: "shadcn-canvas-theme-editor",
      partialize: (state) => ({
        themeState: state.themeState,
        themeCheckpoint: state.themeCheckpoint,
      }),
    }
  )
)
