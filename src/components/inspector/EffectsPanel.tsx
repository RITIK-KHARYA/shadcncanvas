import { MousePointerClick, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/inspector/CollapsibleSection";
import { PropFields } from "@/components/inspector/properties/PropFields";
import { canAddEffect, effectsForHost, getEffect } from "@/lib/registry";
import { useGraphStore } from "@/store/graph-store";
import type { CanvasNode } from "@/types/graph";
import type { EffectConfig } from "@/types/registry";

function PortHint({ keys, portLabels }: { keys: string[]; portLabels: Record<string, string> }) {
  if (keys.length === 0) return null;
  return (
    <p className="text-[10px] leading-relaxed text-muted-foreground">
      Wired inputs:{" "}
      {keys.map((k, i) => (
        <span key={k}>
          {i > 0 ? ", " : ""}
          <code className="font-mono text-foreground">{portLabels[k] ?? k}</code>
        </span>
      ))}{" "}
      — connect them on the canvas via the accent handles on this node.
    </p>
  );
}

export function EffectsPanel({ node }: { node: CanvasNode | null }) {
  const updateNodeEffects = useGraphStore((s) => s.updateNodeEffects);

  if (!node) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
        <MousePointerClick
          className="size-5 text-muted-foreground/50"
          aria-hidden="true"
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Select a component to attach
          <br />
          visual effects.
        </p>
      </div>
    );
  }

  const effects: EffectConfig[] = node.data.effects ?? [];
  const applied = effects
    .map((e) => getEffect(e.id))
    .filter((def): def is NonNullable<typeof def> => Boolean(def));
  const available = effectsForHost(node.data.componentType).filter(
    (def) => !effects.some((e) => e.id === def.id),
  );

  const add = (effectId: string) => {
    const result = canAddEffect(effects, effectId);
    if (!result.ok) {
      toast.info(result.reason ?? "Effect cannot be added");
      return;
    }
    const def = getEffect(effectId);
    if (!def) return;
    const kept = effects.filter((e) => !result.replaceIds.includes(e.id));
    updateNodeEffects(node.id, [
      ...kept,
      { id: effectId, props: { ...def.defaultProps } },
    ]);
    if (result.replaceIds.length > 0) {
      const labels = result.replaceIds
        .map((id) => getEffect(id)?.label ?? id)
        .join(", ");
      toast.info(`Replaced ${labels}`);
    }
  };

  const remove = (effectId: string) => {
    updateNodeEffects(
      node.id,
      effects.filter((e) => e.id !== effectId),
    );
  };

  const setEffectProp = (effectId: string, key: string, value: unknown) => {
    updateNodeEffects(
      node.id,
      effects.map((e) =>
        e.id === effectId ? { ...e, props: { ...e.props, [key]: value } } : e,
      ),
    );
  };

  if (applied.length === 0 && available.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          No effects fit this component.
        </p>
      </div>
    );
  }

  return (
    <div>
      {applied.map((def) => {
        const config = effects.find((e) => e.id === def.id);
        if (!config) return null;
        const portLabels = Object.fromEntries(
          def.inputs.map((p) => [p.key, p.label]),
        );
        return (
          <CollapsibleSection
            key={def.id}
            id={`effect-${def.id}`}
            title={def.label}
            action={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6 shrink-0"
                aria-label={`Remove ${def.label}`}
                onClick={() => remove(def.id)}
              >
                <X className="size-3" />
              </Button>
            }
          >
            <div className="space-y-3">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {def.description}
              </p>
              <PropFields
                propDefs={def.configurableProps}
                values={config.props}
                idPrefix={`eff-${def.id}`}
                onChange={(key, value) => setEffectProp(def.id, key, value)}
              />
              <PortHint
                keys={def.inputs.map((p) => p.key)}
                portLabels={portLabels}
              />
            </div>
          </CollapsibleSection>
        );
      })}

      {available.length > 0 && (
        <CollapsibleSection
          id="effects-add"
          title="Add effect"
          defaultExpanded={applied.length === 0}
        >
          <div className="grid gap-1.5">
            {available.map((def) => (
              <button
                key={def.id}
                type="button"
                onClick={() => add(def.id)}
                className="flex items-start gap-2 rounded-lg border border-hairline px-2.5 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-xs font-medium">{def.label}</span>
                  <span className="block text-[10px] leading-snug text-muted-foreground">
                    {def.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}
