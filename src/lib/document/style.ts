/**
 * Maps the design model's named shadow tokens to CSS box-shadow values.
 * Used by both the canvas renderer and the code generator so the exported
 * design matches what is shown on screen.
 */
export const SHADOW_CSS: Record<string, string | undefined> = {
  none: undefined,
  sm: "0 1px 2px rgba(0, 0, 0, 0.1)",
  md: "0 4px 12px rgba(0, 0, 0, 0.15)",
  lg: "0 12px 32px rgba(0, 0, 0, 0.22)",
}
