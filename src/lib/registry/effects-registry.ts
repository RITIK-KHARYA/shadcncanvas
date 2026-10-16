import type { ConfigurableProp, EffectConfig, PortDef } from "@/types/registry"

export type EffectKind = "wrapper" | "standalone" | "group"

export type EffectDef = {
  /** Package-style id, e.g. "border-beam". Standalone effects share their npm name. */
  id: string
  label: string
  /** npm package to install and import from. */
  pkg: string
  /** Exported component name. */
  exportName: string
  /**
   * wrapper  — wraps the host node's element, effect renders around it
   * standalone — own canvas, registered as a palette node instead
   * group    — drives multiple items inside a group node (phase 3)
   */
  kind: EffectKind
  /** componentTypes this effect may wrap. Empty = not attachable via the Effects tab. */
  hosts: string[]
  /** At most one effect of the same group per node ("ring": beam/metal/img). */
  conflictGroup?: string
  /** May stack with others of its kind (voice-glow). */
  stackable?: boolean
  defaultProps: Record<string, unknown>
  configurableProps: ConfigurableProp[]
  /** Effect-level input ports, wired in phase 2. */
  inputs: PortDef[]
  /** One-line copy for the Effects panel. */
  description: string
}

export const effectsRegistry: Record<string, EffectDef> = {
  "border-beam": {
    id: "border-beam",
    label: "Border Beam",
    pkg: "border-beam",
    exportName: "BorderBeam",
    kind: "wrapper",
    hosts: ["button", "card", "input", "textarea"],
    conflictGroup: "ring",
    description: "A soft glow that rides the border of the element.",
    defaultProps: {
      size: "md",
      colorVariant: "colorful",
      theme: "auto",
      duration: 1.96,
      brightness: 1.3,
      active: true,
    },
    configurableProps: [
      {
        key: "size",
        label: "Size",
        inputType: "select",
        options: ["sm", "md", "line", "pulse-outside", "pulse-inner"],
        default: "md",
      },
      {
        key: "colorVariant",
        label: "Color",
        inputType: "select",
        options: ["colorful", "mono", "ocean", "sunset", "forest", "candy", "ice", "gold"],
        default: "colorful",
      },
      {
        key: "theme",
        label: "Theme",
        inputType: "select",
        options: ["auto", "dark", "light"],
        default: "auto",
      },
      {
        key: "duration",
        label: "Duration",
        inputType: "number",
        default: 1.96,
        min: 0.2,
        max: 8,
        step: 0.02,
      },
      {
        key: "brightness",
        label: "Brightness",
        inputType: "number",
        default: 1.3,
        min: 0,
        max: 3,
        step: 0.1,
      },
      { key: "active", label: "Active", inputType: "boolean", default: true },
    ],
    inputs: [{ key: "active", label: "Active", type: "boolean" }],
  },
  "metal-fx": {
    id: "metal-fx",
    label: "Metal FX",
    pkg: "metal-fx",
    exportName: "MetalFx",
    kind: "wrapper",
    hosts: ["button", "badge"],
    conflictGroup: "ring",
    description: "A real-time liquid-metal ring around buttons and badges.",
    defaultProps: {
      preset: "chromatic",
      variant: "button",
      theme: "auto",
      strength: 1,
      paused: false,
    },
    configurableProps: [
      {
        key: "preset",
        label: "Preset",
        inputType: "select",
        options: ["chromatic", "silver", "gold"],
        default: "chromatic",
      },
      {
        key: "variant",
        label: "Variant",
        inputType: "select",
        options: ["button", "circle"],
        default: "button",
      },
      {
        key: "theme",
        label: "Theme",
        inputType: "select",
        options: ["auto", "dark", "light"],
        default: "auto",
      },
      {
        key: "strength",
        label: "Strength",
        inputType: "number",
        default: 1,
        min: 0,
        max: 1,
        step: 0.05,
      },
      { key: "paused", label: "Paused", inputType: "boolean", default: false },
    ],
    inputs: [{ key: "paused", label: "Paused", type: "boolean" }],
  },
  "thinking-orbs": {
    id: "thinking-orbs",
    label: "Thinking Orbs",
    pkg: "thinking-orbs",
    exportName: "ThinkingOrb",
    kind: "standalone",
    hosts: [],
    description: "Nine orb animations for AI loading states — palette node.",
    defaultProps: {
      state: "working",
      size: 64,
      theme: "auto",
      speed: 1,
      paused: false,
    },
    configurableProps: [
      {
        key: "state",
        label: "State",
        inputType: "select",
        options: [
          "working",
          "searching",
          "solving",
          "listening",
          "connecting",
          "weaving",
          "composing",
          "breathing",
          "shaping",
        ],
        default: "working",
      },
      {
        key: "size",
        label: "Size",
        inputType: "select",
        options: ["64", "32", "20"],
        default: "64",
      },
      {
        key: "theme",
        label: "Theme",
        inputType: "select",
        options: ["auto", "dark", "light"],
        default: "auto",
      },
      { key: "paused", label: "Paused", inputType: "boolean", default: false },
    ],
    inputs: [
      { key: "state", label: "State", type: "string" },
      { key: "paused", label: "Paused", type: "boolean" },
    ],
  },
  "bot-avatars": {
    id: "bot-avatars",
    label: "Bot Avatars",
    pkg: "bot-avatars",
    exportName: "BotAvatar",
    kind: "standalone",
    hosts: [],
    description: "Animated bot avatars with living faces — palette node.",
    defaultProps: {
      type: "clover",
      state: "default",
      size: 64,
      paused: false,
    },
    configurableProps: [
      {
        key: "type",
        label: "Type",
        inputType: "select",
        options: [
          "clover",
          "flower",
          "star",
          "ghost",
          "mech",
          "circle",
          "hexagon",
          "square",
          "triangle",
          "blob",
          "drop",
          "droid",
          "alien",
          "cat",
          "cloud",
          "pill",
          "pebble",
          "puddle",
        ],
        default: "clover",
      },
      {
        key: "state",
        label: "State",
        inputType: "select",
        options: ["default", "working", "sleeping"],
        default: "default",
      },
      {
        key: "size",
        label: "Size",
        inputType: "number",
        default: 64,
        min: 16,
        max: 160,
        step: 1,
      },
      { key: "paused", label: "Paused", inputType: "boolean", default: false },
    ],
    inputs: [
      { key: "state", label: "State", type: "string" },
      { key: "paused", label: "Paused", type: "boolean" },
    ],
  },
}

/** Effects that can decorate the given component type (wrappers with a matching host). */
export function effectsForHost(componentType: string): EffectDef[] {
  return Object.values(effectsRegistry).filter(
    (def) => def.kind === "wrapper" && def.hosts.includes(componentType),
  )
}

export function getEffect(id: string): EffectDef | undefined {
  return effectsRegistry[id]
}

const REGISTRY_ORDER = new Map(
  Object.keys(effectsRegistry).map((id, index) => [id, index]),
)

/** Stable order for nesting wrappers — first registered effect ends up outermost. */
export function effectOrder(id: string): number {
  return REGISTRY_ORDER.get(id) ?? Number.MAX_SAFE_INTEGER
}

export type AddEffectResult = {
  ok: boolean
  reason?: string
  /** Existing effect ids that must be removed first (conflict groups). */
  replaceIds: string[]
}

/** Enforces the one-ring-per-node rule and unknown ids. */
export function canAddEffect(
  current: EffectConfig[] | undefined,
  effectId: string,
): AddEffectResult {
  const def = effectsRegistry[effectId]
  if (!def) return { ok: false, reason: "Unknown effect", replaceIds: [] }
  if ((current ?? []).some((e) => e.id === effectId)) {
    return { ok: false, reason: "Already applied", replaceIds: [] }
  }
  if (!def.conflictGroup) return { ok: true, replaceIds: [] }

  const replaceIds = (current ?? [])
    .filter((e) => effectsRegistry[e.id]?.conflictGroup === def.conflictGroup)
    .map((e) => e.id)
  return { ok: true, replaceIds }
}
