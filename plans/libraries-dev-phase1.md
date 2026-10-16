# Libraries.dev effects in shadcn-canvas — Phase 1 plan

Both repos read. Corrections/discoveries from reading are marked **[found]**.

## 0. Facts established

**Libraries.dev** (github.com/Jakubantalik/Libraries.dev — not present locally, cloned to
`%TEMP%\opencode\Libraries.dev` for reading; source of truth for prop names, MIT LICENSE,
`metal-fx/NOTICE` = Apache Paper Shaders, Pro/Studio content excluded):

| package | npm ver | peers | phase-1 role |
|---|---|---|---|
| border-beam | 1.4.1 | react>=18 | wrapper on button/card/input/textarea |
| metal-fx | 2.0.11 | react>=18 | wrapper on button/badge |
| thinking-orbs | 0.3.2 | react>=18 | standalone node |
| bot-avatars | 0.2.2 | react>=18 | standalone node |
| voice-glow, img-fx, liquid-gooey | 0.3.0 / 0.5.1 / 0.2.2 | +`three` for img-fx | phases 2–3 |

React 19 in this repo satisfies `>=18`. Zero runtime deps. **[found]** `MetalBadge` is a
self-contained design (own label/fill, ignores the host badge) → phase 1 uses plain
`MetalFx` as the wrapper for badge hosts too; MetalBadge revisit later.

**shadcn-canvas**: bun (bun.lock, `bun run typecheck` = `tsc -b`, lint = `oxlint .`).
I have write access to `E:\shadcncanvas` in this session → no patch workflow needed.
Persistence is plain JSON → new `effects` field round-trips free.

**[found] naming collision**: `components/inspector/properties/EffectsSection.tsx` already
exists but renders *Wiring* (port values), not visual effects. Keep it; new UI = new
`EffectsPanel` + new sidebar tab.

## 1. Design

Effects stay **decorators**: `data.effects?: EffectConfig[]` on `GraphNodeData`.
Inspector edits them, preview wraps the host, codegen wraps the host. No new host nodes.

```ts
// types/registry.ts
export type EffectConfig = { id: string; props: Record<string, unknown> }
// NodeConfig.category  += "ai" | "effects"
// UiComponentDef       += pkg?: string   // npm package name → package import in codegen
```

`lib/registry/effects-registry.ts` (new) — single source of truth:

```ts
export type EffectDef = {
  id: string              // "border-beam"
  label: string
  pkg: string              // npm name
  exportName: string       // "BorderBeam"
  kind: "wrapper" | "standalone" | "group"
  hosts: string[]          // componentTypes it may wrap; [] = standalone (palette node instead)
  conflictGroup?: string   // "ring": at most one per node (beam/metal/img)
  stackable?: boolean      // voice-glow later
  defaultProps: Record<string, unknown>
  configurableProps: ConfigurableProp[]
  inputs: PortDef[]        // effect-level ports (active/level/state) — consumed phase 2
}
export const effectsRegistry: Record<string, EffectDef>
export function effectsForHost(componentType: string): EffectDef[]  // wrapper + host match
export function canAddEffect(node: CanvasNode, id: string): { ok: boolean; reason?: string }
```

Phase-1 entries:

- **border-beam** (wrapper; hosts `button, card, input, textarea`; conflictGroup `ring`):
  defaults `{ size:"md", colorVariant:"colorful", theme:"auto", duration:1.96, active:true, brightness:1.3 }`
  — note default `theme:"auto"` explicitly, library default is `"dark"`.
- **metal-fx** (wrapper; hosts `button, badge`; conflictGroup `ring`):
  defaults `{ preset:"chromatic", variant:"button", theme:"auto", strength:1, paused:false }`.
- **thinking-orbs / bot-avatars**: `kind:"standalone", hosts:[]` — data only (label/pkg/ports);
  they live as *nodes*, see below.

Standalone nodes in `node-registry.ts`, category `"ai"` (palette group "AI"):

- `thinking-orb`: defaults `{ state:"working", size:64, theme:"auto", speed:1, paused:false }`;
  inputs `state(string), paused(boolean)` (+ the existing loop already appends `loading`);
  outputs `[]`. Preview reads `state.state ?? props.state`.
- `bot-avatar`: defaults `{ type:"clover", state:"default", size:64, paused:false }`;
  inputs `state(string), paused(boolean)`; outputs `[]`.
  (Verified: `BotAvatarState = 'default'|'working'|'sleeping'`, `paused?: boolean`,
  18 free `type` values; `OrbState` = the nine named states, `OrbSize = 64|32|20`.)
- `categoryLabels += { ai: "AI", effects: "Effects" }`.
- `node-schemas.ts`: zod schemas for both (select enums + numbers) so validation covers them.

**Rendering** (`NodePreview`): add `effects?: EffectConfig[]` to `NodePreviewProps`;
new `lib/registry/effect-components.tsx` maps id → component (`BorderBeam`, `MetalFx`)
and applies wrappers **innermost-first inside the existing style `wrap()`**, so
`style(border)` > effect > host. Ring order deterministic: sort by registry order;
conflict rule guarantees ≤1 ring + stackable extras. New switch cases:
`thinking-orb` → `<ThinkingOrb …>`, `bot-avatar` → `<BotAvatar …>`
(string props cast, `size` via `Number()`).

**Store**: `graph-store.updateNodeEffects(nodeId, effects: EffectConfig[])`
(pushHistory + immutable set, mirrors `updateNodeStyle`).

**Inspector**: add `"effects"` to `SidebarTab` + `TABS`; `EditorSidebar` renders
`<EffectsPanel node={selectedNode} />` when a single node is selected (else placeholder).
`EffectsPanel.tsx` (new):
- lists `effectsForHost(node.data.componentType)`; toggle add/remove;
- on add: if another effect in same `conflictGroup` is present → replace it (with a toast),
- prop rows reusing `DesignSection`'s `ControlRow` pattern (select / boolean / number / color
  driven by `configurableProps`),
- read-only hint row for effect ports (`active`, `paused`, …) — wiring UI is phase 2,
- empty state for nodes with no compatible effect.

**Codegen**:
- `imports.ts`: `buildImports(types, effectIds?: string[])` — two additions:
  (a) `UiComponentDef.pkg` branch → `import { X } from "<pkg>"` (before the
  `@/components/ui/` fallback; also covers `thinking-orb`/`bot-avatar` nodes);
  (b) per effect id → `import { BorderBeam } from "border-beam"` etc.
- `codegen.ts`: `generateFullCode` collects effect ids across nodes, passes to
  `buildImports`; `generateNodeCode` wraps its returned JSX:
  `<BorderBeam size="md" active>\n  {jsx}\n</BorderBeam>` via a small
  `wrapWithEffects(jsx, effects)` helper (reuses `formatJsxProp`, indents inner lines).
- `exportZip.ts`: untouched in phase 1 (deps list lands phase 3 with the plan's ZIP work).

## 2. Files touched (phase 1)

| file | change |
|---|---|
| `package.json` / `bun.lock` | `bun add border-beam metal-fx thinking-orbs bot-avatars` |
| `src/types/registry.ts` | `EffectConfig`, categories `ai`/`effects`, `UiComponentDef.pkg` |
| `src/types/graph.ts` | `effects?: EffectConfig[]` |
| `src/lib/registry/effects-registry.ts` | **new** — defs + `effectsForHost` + `canAddEffect` |
| `src/lib/registry/effect-components.tsx` | **new** — id → component + wrap helper |
| `src/lib/registry/node-registry.ts` | `thinking-orb`, `bot-avatar`, `categoryLabels` |
| `src/lib/registry/node-schemas.ts` | schemas for the two nodes |
| `src/lib/registry/component-map.ts` | `pkg` entries for the two nodes |
| `src/lib/registry/index.ts` | re-export effects registry |
| `src/store/graph-store.ts` | `updateNodeEffects` |
| `src/components/canvas/NodeTypes/NodePreview.tsx` | `effects` prop + wrap; orb/avatar cases |
| `src/components/canvas/NodeTypes/types.ts` | `effects` on `NodePreviewProps` |
| `src/components/canvas/NodeTypes/BaseNode.tsx` | pass `data.effects` |
| `src/components/inspector/SidebarTabs.tsx` | 4th tab `effects` |
| `src/components/inspector/EditorSidebar.tsx` | render `EffectsPanel` |
| `src/components/inspector/EffectsPanel.tsx` | **new** |
| `src/lib/codegen/imports.ts` | pkg branch + effect imports |
| `src/lib/codegen/codegen.ts` | `wrapWithEffects`, pass effect ids |

Deferred (per plan): voice-glow/img-fx + effect port wiring (phase 2), liquid-gooey +
ZIP `package.json` deps (phase 3), landing showcase (phase 4).

## 3. Order of work

1. `bun add` the four packages; confirm `bun install` clean.
2. Types → effects-registry → node-registry/schemas/component-map (pure data, typechecks early).
3. `effect-components.tsx` + `NodePreview`/`BaseNode`/`NodePreviewProps` → effects visible on canvas.
4. `updateNodeEffects` + `SidebarTabs`/`EditorSidebar` + `EffectsPanel` → editable.
5. `imports.ts` + `codegen.ts` → export path correct for the four packages.
6. Verify.

## 4. Verification

- `bun run typecheck`, `bun run lint`.
- `bun run dev` smoke: drop Button/Card/Input → Effects tab → add border-beam (params
  live-update); confirm adding metal-fx replaces beam (ring conflict); drop Thinking Orb /
  Bot Avatar from new **AI** palette group; toggle orb `state`/`paused`; theme editor
  dark↔light with `theme="auto"` (beam + orb follow `.dark`/`data-theme`); export code
  contains package imports, no `@/components/ui/border-beam`.
- Regression: normal nodes still export identical output (effect-free path unchanged).

## 5. Risks / open items

- **Theme**: beam `auto` per docs follows *prefers-color-scheme*, not the `.dark` class →
  in-app forced dark/light may mismatch. Test in step 6; fallback = resolve theme prop from
  the canvas theme store instead of `"auto"`.
- **WebGL contexts**: each metal-fx instance is a context; no `onlyRenderVisibleElements`
  on React Flow yet (only `fitView`/`minZoom` found). Phase 1 acceptable; mitigation
  (offscreen `paused`, `onlyRenderVisibleElements`) tracked for phase 2 with `img-fx`/`three`.
- `ConfigurableProp.inputType` has no min/max → effect number props (duration, brightness,
  strength) use `select` of sensible values or a plain number field; extend the type if
  sliders are wanted (tiny, additive).
- orb `size`/`speed` flow through `select options: string[]` → preview/codegen coerce with
  `Number()` (codegen `formatJsxProp` already emits numbers as `{64}`).
