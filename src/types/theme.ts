import { z } from "zod"

export const themeStylePropsSchema = z.object({
  // Primary colors
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  "card-foreground": z.string(),
  popover: z.string(),
  "popover-foreground": z.string(),
  primary: z.string(),
  "primary-foreground": z.string(),
  secondary: z.string(),
  "secondary-foreground": z.string(),
  muted: z.string(),
  "muted-foreground": z.string(),
  accent: z.string(),
  "accent-foreground": z.string(),
  destructive: z.string(),
  "destructive-foreground": z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),

  // Sidebar colors
  sidebar: z.string(),
  "sidebar-foreground": z.string(),
  "sidebar-primary": z.string(),
  "sidebar-primary-foreground": z.string(),
  "sidebar-accent": z.string(),
  "sidebar-accent-foreground": z.string(),
  "sidebar-border": z.string(),
  "sidebar-ring": z.string(),

  // Chart colors
  "chart-1": z.string(),
  "chart-2": z.string(),
  "chart-3": z.string(),
  "chart-4": z.string(),
  "chart-5": z.string(),

  // Shadow properties
  "shadow-color": z.string(),
  "shadow-opacity": z.string(),
  "shadow-blur": z.string(),
  "shadow-spread": z.string(),
  "shadow-offset-x": z.string(),
  "shadow-offset-y": z.string(),

  // Mode-agnostic properties
  "font-sans": z.string(),
  "font-serif": z.string(),
  "font-mono": z.string(),
  radius: z.string(),
  spacing: z.string(),
  "letter-spacing": z.string(),
})

export const themeStylesSchema = z.object({
  light: themeStylePropsSchema,
  dark: themeStylePropsSchema,
})

export type ThemeStyleProps = z.infer<typeof themeStylePropsSchema>
export type ThemeStyles = z.infer<typeof themeStylesSchema>

export interface BaseEditorState {}

export interface ThemeEditorState extends BaseEditorState {
  preset?: string
  styles: ThemeStyles
  currentMode: "light" | "dark"
  hslAdjustments?: {
    hueShift: number
    saturationScale: number
    lightnessScale: number
  }
}

export interface ThemeHistoryEntry {
  styles: ThemeStyles
  hslAdjustments?: {
    hueShift: number
    saturationScale: number
    lightnessScale: number
  }
  timestamp: number
}
