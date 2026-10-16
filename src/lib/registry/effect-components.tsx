import type { ReactNode } from "react";
import { BorderBeam } from "border-beam";
import { MetalFx } from "metal-fx";

import { effectOrder } from "@/lib/registry/effects-registry";
import type { EffectConfig } from "@/types/registry";

type WrapperProps = { children?: ReactNode } & Record<string, unknown>;

const WRAPPER_COMPONENTS: Record<string, React.ComponentType<WrapperProps>> = {
  "border-beam": BorderBeam as unknown as React.ComponentType<WrapperProps>,
  "metal-fx": MetalFx as unknown as React.ComponentType<WrapperProps>,
};

/**
 * Applies the node's wrapper effects around its host content.
 * Effects render in registry order (first def outermost); the ring conflict
 * rule guarantees at most one ring-type wrapper, the rest may stack.
 */
export function EffectsLayer({
  effects,
  children,
}: {
  effects?: EffectConfig[];
  children: ReactNode;
}) {
  if (!effects || effects.length === 0) return children;

  const ordered = [...effects].sort((a, b) => effectOrder(a.id) - effectOrder(b.id));

  return ordered.reduceRight<ReactNode>((inner, effect) => {
    const Component = WRAPPER_COMPONENTS[effect.id];
    if (!Component) return inner;
    return <Component {...effect.props}>{inner}</Component>;
  }, children);
}
