import { useMemo } from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  defaultThemeTokens,
  type ThemeTokenKey,
  useThemeStore,
} from "@/store/themeStore"

const tokenLabels: Record<ThemeTokenKey, string> = {
  primary: "Primary",
  secondary: "Secondary",
  background: "Background",
  radius: "Radius",
}

const radiusOptions = ["0rem", "0.25rem", "0.5rem", "0.75rem", "1rem"]

export function ThemePanel() {
  const tokens = useThemeStore((s) => s.tokens)
  const setToken = useThemeStore((s) => s.setToken)
  const resetTokens = useThemeStore((s) => s.resetTokens)

  const swatches = useMemo(
    () =>
      (["primary", "secondary", "background"] as ThemeTokenKey[]).map((key) => ({
        key,
        value: tokens[key],
      })),
    [tokens],
  )

  return (
    <section className="rounded-lg border bg-background/60 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Theme
        </h3>
        <button
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={resetTokens}
        >
          Reset
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {swatches.map(({ key, value }) => (
          <button
            key={key}
            type="button"
            className="h-10 rounded-md border shadow-sm"
            style={{ background: value }}
            title={`${tokenLabels[key]}: ${value}`}
            onClick={() => {
              const next = prompt(`Set ${tokenLabels[key]} (CSS color)`, value)
              if (next) setToken(key, next)
            }}
          />
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {(["primary", "secondary", "background"] as ThemeTokenKey[]).map(
          (key) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`theme-${key}`} className="text-xs">
                {tokenLabels[key]}
              </Label>
              <input
                id={`theme-${key}`}
                className="flex h-8 w-full rounded-md border bg-background px-2 text-xs"
                value={tokens[key]}
                onChange={(e) => setToken(key, e.target.value)}
              />
            </div>
          ),
        )}

        <div className="space-y-1.5">
          <Label htmlFor="theme-radius" className="text-xs">
            {tokenLabels.radius}
          </Label>
          <Select
            value={tokens.radius}
            onValueChange={(value) => setToken("radius", value)}
          >
            <SelectTrigger id="theme-radius" className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Theme applies to canvas preview. Defaults:{" "}
        {defaultThemeTokens.primary.slice(0, 12)}…
      </p>
    </section>
  )
}
