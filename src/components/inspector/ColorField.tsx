import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toHexColor } from "@/utils/apply-theme"
import { cn } from "@/lib/utils"

export const COLOR_SWATCHES = [
  // Neutrals
  "oklch(0.985 0 0)",
  "oklch(0.922 0 0)",
  "oklch(0.708 0 0)",
  "oklch(0.556 0 0)",
  "oklch(0.269 0 0)",
  "oklch(0.145 0 0)",
  // Accents
  "oklch(0.577 0.245 27.325)",
  "oklch(0.645 0.246 16.439)",
  "oklch(0.705 0.213 47.604)",
  "oklch(0.769 0.188 70.08)",
  "oklch(0.627 0.194 149.21)",
  "oklch(0.696 0.17 162.48)",
  "oklch(0.609 0.126 221.723)",
  "oklch(0.623 0.214 259.815)",
  "oklch(0.585 0.233 277.117)",
  "oklch(0.606 0.25 292.717)",
  "oklch(0.627 0.265 303.9)",
  "oklch(0.667 0.295 322.15)",
  "oklch(0.656 0.241 353.13)",
]

/** Compact color swatch that opens a floating dropdown for palette + custom picks. */
export function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const hex = toHexColor(value) ?? "#000000"

  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={id} className="block truncate text-[10px] text-muted-foreground">
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-label={`Edit ${label || "color"}`}
            className="flex h-7 w-full items-center gap-1.5 rounded-md border bg-background px-1.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span
              className="size-3.5 shrink-0 rounded-sm border border-border"
              style={{ backgroundColor: hex }}
              aria-hidden="true"
            />
            <span className="truncate font-mono text-[10px] uppercase">{hex}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 space-y-2 p-2">
          <div className="grid grid-cols-10 gap-1">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                title={swatch}
                aria-label={`Set ${label || "color"} to ${swatch}`}
                onClick={() => onChange(swatch)}
                className={cn(
                  "size-4 rounded-sm border border-black/10 transition-transform hover:scale-110",
                  value.trim().toLowerCase() === swatch &&
                    "ring-2 ring-primary ring-offset-1 ring-offset-background",
                )}
                style={{ backgroundColor: toHexColor(swatch) ?? swatch }}
              />
            ))}
          </div>
          <label className="flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed text-[10px] text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground">
            Custom…
            <input
              type="color"
              value={hex}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
              aria-label={`Custom ${label || "color"}`}
            />
          </label>
        </PopoverContent>
      </Popover>
    </div>
  )
}
