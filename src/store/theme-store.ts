import { create } from "zustand"

export type ThemeTokenKey = "primary" | "secondary" | "background" | "radius"

export type ThemeTokens = Record<ThemeTokenKey, string>

/** Dark canvas defaults */
export const defaultThemeTokens: ThemeTokens = {
  primary: "oklch(0.922 0 0)",
  secondary: "oklch(0.269 0 0)",
  background: "oklch(0.145 0 0)",
  radius: "0.5rem",
}

type ThemeStore = {
  tokens: ThemeTokens
  setToken: (key: ThemeTokenKey, value: string) => void
  resetTokens: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  tokens: { ...defaultThemeTokens },
  setToken: (key, value) =>
    set((state) => ({
      tokens: { ...state.tokens, [key]: value },
    })),
  resetTokens: () => set({ tokens: { ...defaultThemeTokens } }),
}))

export function themeTokensToStyle(tokens: ThemeTokens): Record<string, string> {
  return {
    "--background": tokens.background,
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": tokens.primary,
    "--primary-foreground": "oklch(0.205 0 0)",
    "--secondary": tokens.secondary,
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.556 0 0)",
    "--radius": tokens.radius,
  }
}
