import { useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEditorStore, THEME_PRESETS } from "@/store/editor-store"
import { ThemeStyleProps } from "@/types/theme"
import { isColorProperty } from "@/utils/apply-theme"

export function ThemePanel() {
  const themeState = useEditorStore((s) => s.themeState)
  const history = useEditorStore((s) => s.history)
  const future = useEditorStore((s) => s.future)
  const setThemeState = useEditorStore((s) => s.setThemeState)
  const applyThemePreset = useEditorStore((s) => s.applyThemePreset)
  const saveThemeCheckpoint = useEditorStore((s) => s.saveThemeCheckpoint)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const hasUnsavedChanges = useEditorStore((s) => s.hasUnsavedChanges)
  const resetTheme = useEditorStore((s) => s.resetTheme)

  const activeMode = themeState.currentMode
  const styles = themeState.styles[activeMode]
  const hslAdjustments = themeState.hslAdjustments || { hueShift: 0, saturationScale: 1, lightnessScale: 1 }

  // Handlers for adjustments
  const handleAdjustmentChange = (key: "hueShift" | "saturationScale" | "lightnessScale", value: number) => {
    setThemeState((prev) => ({
      ...prev,
      hslAdjustments: {
        ...hslAdjustments,
        [key]: value,
      },
    }))
  }

  // Handler for individual color/style properties
  const handleStylePropChange = (key: keyof ThemeStyleProps, value: string) => {
    setThemeState((prev) => {
      const nextStyles = { ...prev.styles }
      nextStyles[activeMode] = {
        ...nextStyles[activeMode],
        [key]: value,
      }
      return {
        ...prev,
        styles: nextStyles,
      }
    })
  }

  // Categorize variables for rendering
  const colorVariables = useMemo(() => {
    return Object.keys(styles).filter(
      (k) => isColorProperty(k) && !k.startsWith("chart-") && !k.startsWith("sidebar-") && k !== "sidebar" && k !== "shadow-color"
    ) as (keyof ThemeStyleProps)[]
  }, [styles])

  const sidebarVariables = useMemo(() => {
    return Object.keys(styles).filter((k) => k.startsWith("sidebar")) as (keyof ThemeStyleProps)[]
  }, [styles])

  const chartVariables = useMemo(() => {
    return Object.keys(styles).filter((k) => k.startsWith("chart-")) as (keyof ThemeStyleProps)[]
  }, [styles])

  const shadowVariables = useMemo(() => {
    return Object.keys(styles).filter((k) => k.startsWith("shadow-")) as (keyof ThemeStyleProps)[]
  }, [styles])

  const commonVariables = useMemo(() => {
    return ["radius", "spacing", "letter-spacing", "font-sans", "font-serif", "font-mono"] as (keyof ThemeStyleProps)[]
  }, [])

  return (
    <section className="space-y-4 rounded-lg border bg-background/60 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Theme Management
        </h3>
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            type="button"
            className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={resetTheme}
          >
            Reset
          </Button>
          {hasUnsavedChanges() && (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
              Unsaved
            </span>
          )}
        </div>
      </div>

      {/* Preset & Mode Selection */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase">Preset</Label>
          <Select
            value={themeState.preset || "default"}
            onValueChange={applyThemePreset}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Preset" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(THEME_PRESETS).map((p) => (
                <SelectItem key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase">Mode</Label>
          <Select
            value={activeMode}
            onValueChange={(val: "light" | "dark") => {
              setThemeState((prev) => ({
                ...prev,
                currentMode: val,
              }))
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* History and Checkpoint Operations */}
      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            type="button"
            className="h-7 text-xs px-2.5"
            disabled={history.length === 0}
            onClick={undo}
          >
            Undo
          </Button>
          <Button
            variant="outline"
            type="button"
            className="h-7 text-xs px-2.5"
            disabled={future.length === 0}
            onClick={redo}
          >
            Redo
          </Button>
        </div>
        <Button
          variant="secondary"
          type="button"
          className="h-7 text-xs px-2.5"
          onClick={saveThemeCheckpoint}
        >
          Save Checkpoint
        </Button>
      </div>

      {/* HSL Adjustments */}
      <div className="space-y-2 border-t pt-3">
        <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          HSL Adjustments
        </h4>
        
        <div className="space-y-2">
          {/* Hue Shift */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hue Shift</span>
              <span className="font-mono text-[10px]">{hslAdjustments.hueShift}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={hslAdjustments.hueShift}
              onChange={(e) => handleAdjustmentChange("hueShift", parseInt(e.target.value))}
              className="w-full accent-primary bg-secondary h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Saturation Scale */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Saturation Scale</span>
              <span className="font-mono text-[10px]">{hslAdjustments.saturationScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={hslAdjustments.saturationScale}
              onChange={(e) => handleAdjustmentChange("saturationScale", parseFloat(e.target.value))}
              className="w-full accent-primary bg-secondary h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Lightness Scale */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Lightness Scale</span>
              <span className="font-mono text-[10px]">{hslAdjustments.lightnessScale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={hslAdjustments.lightnessScale}
              onChange={(e) => handleAdjustmentChange("lightnessScale", parseFloat(e.target.value))}
              className="w-full accent-primary bg-secondary h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Specific Properties Customization */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Color Properties (OKLCH)
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {colorVariables.map((key) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`theme-${key}`} className="text-[10px] text-muted-foreground truncate block">
                {key}
              </Label>
              <input
                id={`theme-${key}`}
                className="flex h-7 w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={String(styles[key] ?? "")}
                onChange={(e) => handleStylePropChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar & Charts Customization */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Sidebar & Charts
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          {[...sidebarVariables, ...chartVariables].map((key) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`theme-${key}`} className="text-[10px] text-muted-foreground truncate block">
                {key}
              </Label>
              <input
                id={`theme-${key}`}
                className="flex h-7 w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={String(styles[key] ?? "")}
                onChange={(e) => handleStylePropChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sizing, Typography & Shadows */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Spacing, Shadows & Fonts
        </h4>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
          {[...commonVariables, ...shadowVariables].map((key) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`theme-${key}`} className="text-[10px] text-muted-foreground truncate block">
                {key}
              </Label>
              <input
                id={`theme-${key}`}
                className="flex h-7 w-full rounded-md border bg-background px-2 py-1 text-[10px] font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={String(styles[key] ?? "")}
                onChange={(e) => handleStylePropChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
