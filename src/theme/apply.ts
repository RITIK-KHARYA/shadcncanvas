import type { ThemeEditorState } from "@/types/theme"
import { COMMON_STYLES } from "./config"
import { applyStyleToElement } from "./style-utils"
import { colorFormatter, adjustHslColor, isColorProperty } from "./colors"
import { setShadowVariables } from "./shadows"

export function updateThemeClass(root: HTMLElement, mode: "light" | "dark") {
  if (mode === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export function applyCommonStyles(root: HTMLElement, themeStylesLight: Record<string, string>) {
  COMMON_STYLES.forEach((key) => {
    const value = themeStylesLight[key]
    if (value !== undefined) {
      applyStyleToElement(root, key, value)
    }
  })
}

export function applyThemeColors(root: HTMLElement, themeState: ThemeEditorState) {
  const mode = themeState.currentMode
  const styles = themeState.styles[mode]
  const adjustments = themeState.hslAdjustments || { hueShift: 0, saturationScale: 1, lightnessScale: 1 }
  Object.entries(styles).forEach(([key, value]) => {
    if (isColorProperty(key)) {
      const baseHsl = colorFormatter(value, "hsl", 4)
      const adjustedHsl = adjustHslColor(baseHsl, adjustments)
      applyStyleToElement(root, key, adjustedHsl)
    }
  })
}

export function applyThemeToElement(themeState: ThemeEditorState, rootElement: HTMLElement) {
  const mode = themeState.currentMode
  updateThemeClass(rootElement, mode)
  applyCommonStyles(rootElement, themeState.styles[mode])
  applyThemeColors(rootElement, themeState)
  setShadowVariables(themeState, rootElement)
}
