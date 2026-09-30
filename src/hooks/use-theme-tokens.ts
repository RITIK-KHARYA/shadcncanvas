import { useMemo } from "react"
import { useEditorStore } from "@/store/editor-store"
import type { ThemeTokens } from "@/store/theme-store"

/**
 * The subset of design tokens that the canvas, codegen and ZIP export care
 * about, derived from the theme editor for the active mode.
 */
export function useThemeTokens(): ThemeTokens {
  const styles = useEditorStore((s) => s.themeState.styles)
  const currentMode = useEditorStore((s) => s.themeState.currentMode)

  return useMemo(() => {
    const active = styles[currentMode]

    return {
      primary: active.primary,
      secondary: active.secondary,
      background: active.background,
      radius: active.radius,
    }
  }, [styles, currentMode])
}
