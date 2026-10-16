import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ColorField } from "@/components/inspector/ColorField";
import type { ConfigurableProp } from "@/types/registry";
import { cn } from "@/lib/utils";

export function PropFields({
  propDefs,
  values,
  errors,
  idPrefix = "prop",
  onChange,
}: {
  propDefs: ConfigurableProp[];
  values: Record<string, unknown>;
  errors?: Record<string, string>;
  idPrefix?: string;
  onChange: (key: string, value: unknown) => void;
}) {
  if (propDefs.length === 0) return null;

  return (
    <div className="space-y-2">
      {propDefs.map((propDef) => {
        const value = values[propDef.key];
        const error = errors?.[propDef.key];
        const hasRange =
          propDef.inputType === "number" &&
          propDef.min !== undefined &&
          propDef.max !== undefined;

        return (
          <div
            key={propDef.key}
            className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-2 gap-y-1"
          >
            <Label
              htmlFor={`${idPrefix}-${propDef.key}`}
              className="truncate text-[11px] font-normal text-muted-foreground"
            >
              {propDef.label}
            </Label>

            {propDef.inputType === "text" && (
              <Input
                id={`${idPrefix}-${propDef.key}`}
                className={cn(
                  "h-8 border-transparent bg-surface text-xs shadow-none",
                  error && "border-destructive",
                )}
                value={String(value ?? "")}
                onChange={(e) => onChange(propDef.key, e.target.value)}
              />
            )}

            {propDef.inputType === "select" && (
              <Select
                value={String(value ?? propDef.default)}
                onValueChange={(next) =>
                  onChange(
                    propDef.key,
                    // Keep numeric props numeric (e.g. orb size 64 vs "64").
                    typeof value === "number" && Number.isFinite(Number(next))
                      ? Number(next)
                      : next,
                  )
                }
              >
                <SelectTrigger
                  id={`${idPrefix}-${propDef.key}`}
                  className={cn(
                    "h-8 w-full border-transparent bg-surface text-xs shadow-none",
                    error && "border-destructive",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(propDef.options ?? []).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {propDef.inputType === "boolean" && (
              <Switch
                id={`${idPrefix}-${propDef.key}`}
                checked={Boolean(value)}
                onCheckedChange={(checked) => onChange(propDef.key, checked)}
                className="justify-self-start"
              />
            )}

            {propDef.inputType === "number" && hasRange && (
              <div className="flex items-center gap-2">
                <Slider
                  min={propDef.min}
                  max={propDef.max}
                  step={propDef.step ?? 1}
                  value={[Number(value ?? propDef.default ?? 0)]}
                  onValueChange={([v]) => onChange(propDef.key, v)}
                  className="flex-1"
                />
                <Input
                  id={`${idPrefix}-${propDef.key}`}
                  type="number"
                  className={cn(
                    "h-8 w-14 border-transparent bg-surface text-xs shadow-none",
                    error && "border-destructive",
                  )}
                  min={propDef.min}
                  max={propDef.max}
                  step={propDef.step ?? "any"}
                  value={Number(value ?? 0)}
                  onChange={(e) => onChange(propDef.key, Number(e.target.value))}
                />
              </div>
            )}

            {propDef.inputType === "number" && !hasRange && (
              <Input
                id={`${idPrefix}-${propDef.key}`}
                type="number"
                className={cn(
                  "h-8 border-transparent bg-surface text-xs shadow-none",
                  error && "border-destructive",
                )}
                value={Number(value ?? 0)}
                min={propDef.min}
                max={propDef.max}
                step={propDef.step ?? "any"}
                onChange={(e) => onChange(propDef.key, Number(e.target.value))}
              />
            )}

            {propDef.inputType === "color" && (
              <ColorField
                id={`${idPrefix}-${propDef.key}`}
                label=""
                value={String(value ?? propDef.default ?? "oklch(0.145 0 0)")}
                onChange={(next) => onChange(propDef.key, next)}
              />
            )}

            {error && (
              <p className="col-start-2 text-[11px] text-destructive">{error}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
