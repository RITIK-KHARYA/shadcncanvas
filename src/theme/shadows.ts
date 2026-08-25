import type { ThemeEditorState } from "@/types/theme"
import { applyStyleToElement } from "./style-utils"
import { colorFormatter, adjustHslColor } from "./colors"

const SHADOW_SCALE: { key: string; offsetYFactor: number; blurFactor: number; opacity: number }[] = [
  { key: "shadow-2xs", offsetYFactor: 1, blurFactor: 2 / 3, opacity: 0.04 },
  { key: "shadow-xs", offsetYFactor: 1, blurFactor: 2 / 3, opacity: 0.05 },
  { key: "shadow-sm", offsetYFactor: 1, blurFactor: 1, opacity: 0.06 },
  { key: "shadow", offsetYFactor: 1, blurFactor: 1, opacity: 0.08 },
  { key: "shadow-md", offsetYFactor: 6, blurFactor: 6, opacity: 0.08 },
  { key: "shadow-lg", offsetYFactor: 12, blurFactor: 10, opacity: 0.1 },
  { key: "shadow-xl", offsetYFactor: 20, blurFactor: 15, opacity: 0.12 },
  { key: "shadow-2xl", offsetYFactor: 24, blurFactor: 20, opacity: 0.16 },
]

function parsePx(value: string | undefined, fallback: number): number {
  const parsed = parseFloat(String(value ?? ""))
  return Number.isNaN(parsed) ? fallback : parsed
}

export function setShadowVariables(themeState: ThemeEditorState, root: HTMLElement) {
  const styles = themeState.styles[themeState.currentMode]
  const adjustments = themeState.hslAdjustments || { hueShift: 0, saturationScale: 1, lightnessScale: 1 }
  const offsetX = parsePx(styles["shadow-offset-x"], 0)
  const offsetY = parsePx(styles["shadow-offset-y"], 1)
  const blur = parsePx(styles["shadow-blur"], 3)
  const spread = parsePx(styles["shadow-spread"], 0)
  const baseOpacity = parsePx(styles["shadow-opacity"], 0.08)
  let color = colorFormatter(styles["shadow-color"] || "oklch(0 0 0)", "hsl", 4)
  color = adjustHslColor(color, adjustments)
  if (/\/\s*[\d.]+\)$/.test(color)) {
    color = color.replace(/\/\s*[\d.]+\)$/, ")")
  }
  const colorWithAlpha = (alpha: number) => color.replace(/\)$/, ` / ${alpha})`)
  SHADOW_SCALE.forEach((level) => {
    const opacity = Math.max(0, Math.min(1, level.opacity * (baseOpacity / 0.08)))
    const value =
      `${Math.round(offsetX)}px ${Math.round(offsetY * level.offsetYFactor)}px ` +
      `${Math.round(blur * level.blurFactor)}px ${spread}px ${colorWithAlpha(opacity)}`
    applyStyleToElement(root, level.key, value)
  })
}
