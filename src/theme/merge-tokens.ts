import type { ThemeEditorState } from "@/types/theme"
import type { ThemeTokens } from "@/store/theme-store"

/**
 * Overlays persisted design tokens onto the styles of the currently active
 * mode, falling back to the existing value for any token that is missing.
 *
 * This is a pure function on purpose: callers decide how to commit the result.
 * The builder hydrates with `useEditorStore.setState` rather than
 * `setThemeState` so restoring a saved project does not push a theme-history
 * entry and does not run through the preset validation path.
 */
export function mergeThemeTokens(
  themeState: ThemeEditorState,
  tokens: ThemeTokens,
): ThemeEditorState {
  const mode = themeState.currentMode
  const current = themeState.styles[mode]

  return {
    ...themeState,
    styles: {
      ...themeState.styles,
      [mode]: {
        ...current,
        primary: tokens.primary || current.primary,
        secondary: tokens.secondary || current.secondary,
        background: tokens.background || current.background,
        radius: tokens.radius || current.radius,
      },
    },
  }
}
