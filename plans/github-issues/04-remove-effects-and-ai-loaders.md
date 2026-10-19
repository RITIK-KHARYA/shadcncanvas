# effects: remove the effects studio and the fake "AI" loaders

## Summary

The builder ships a shader/animation studio and an "AI" palette group that is
really two npm loaders. Neither belongs in a shadcn code builder.

## Evidence

- `plans/libraries-dev-phase1.md` documents the deliberate addition of
  `border-beam`, `metal-fx`, `voice-glow`, `img-fx` (effects) and
  `thinking-orbs`, `bot-avatars`.
- `store/editor-store.ts` no longer exists; effects still ship via
  `EffectsPanel.tsx`, `lib/registry/effects-registry.ts` and
  `lib/registry/effect-components.tsx` (`metal-fx` runs a WebGL context per
  node; `img-fx` lazily pulls `three`, ~600 KB).
- The "AI" registry category is empty; `thinking-orb` (~546 KB alone) and
  `bot-avatar` were filed under `loading`.
- None of these are shadcn components, so they undercut the "54 shadcn/ui
  components" claim.

## Proposed change

- Delete the Effects tab/panel, effects registry and effect components, the
  Loader palette mode, and the orb/avatar registry entries and their schemas.
- Remove the wrapper/effect support from codegen (`wrapWithEffects`, effect
  imports, `EffectConfig`) and the now-dead `effects` / `ai` categories.
- Remove the `border-beam`, `metal-fx`, `thinking-orbs`, `bot-avatars`,
  `voice-glow`, `img-fx`, `three` dependencies.
- If one tasteful effect is wanted, keep only `border-beam` and document it as
  an integration rather than a shadcn component.

## Acceptance criteria

- [ ] No Effects tab and no Loader palette mode.
- [ ] No orb/avatar nodes in the palette.
- [ ] Exported code has no effect wrappers or third-party effect imports.
- [ ] Removed dependencies are gone from `package.json`.
