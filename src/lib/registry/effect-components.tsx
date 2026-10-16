import { Component, Suspense, lazy, type ReactNode } from "react";
import { BorderBeam } from "border-beam";
import { MetalFx } from "metal-fx";
import { VoiceBeam } from "voice-glow";

import { effectOrder } from "@/lib/registry/effects-registry";
import type { EffectConfig } from "@/types/registry";

type WrapperProps = { children?: ReactNode } & Record<string, unknown>;

// img-fx statically imports three.js — lazy-load it so the ~600 KB WebGL
// engine only ships when an Image FX effect is actually on the canvas.
const LazyImageGeneration = lazy(() =>
  import("img-fx").then((m) => ({ default: m.ImageGeneration })),
);

const WRAPPER_COMPONENTS: Record<string, React.ComponentType<WrapperProps>> = {
  "border-beam": BorderBeam as unknown as React.ComponentType<WrapperProps>,
  "metal-fx": MetalFx as unknown as React.ComponentType<WrapperProps>,
  "voice-glow": VoiceBeam as unknown as React.ComponentType<WrapperProps>,
  "img-fx": LazyImageGeneration as unknown as React.ComponentType<WrapperProps>,
};

/**
 * Isolates a wrapper effect so a failed WebGL init (unsupported GPU, lost
 * context, bad shader) degrades to the plain host element instead of crashing
 * the whole canvas.
 */
class EffectBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Swallow — the host element still renders via the fallback.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

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
    return (
      <EffectBoundary key={effect.id} fallback={inner}>
        <Suspense fallback={inner}>
          <Component {...effect.props}>{inner}</Component>
        </Suspense>
      </EffectBoundary>
    );
  }, children);
}
