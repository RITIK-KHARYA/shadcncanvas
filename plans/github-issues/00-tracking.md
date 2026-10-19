# Tracking: cut out-of-scope features and fix the theme system

Umbrella issue for the codebase audit. Each child issue below removes a feature
that is outside the product promise ("drag shadcn/ui components, wire the logic,
export React code") or fixes a claim that does not match the code.

## Context

Audit findings on `main`:

- The builder ships a full multi-colour theme editor (presets, HSL sliders, ~30
  tokens) that only themes the canvas, so the canvas and the chrome can diverge.
- Auth + Postgres/Prisma/OAuth gate `/app` although all project data lives in
  `localStorage`.
- 15 ECharts blocks (12k lines) are presented as shadcn/ui components and export
  imports that do not exist in a user's project.
- An effects/shader studio and a fake "AI" group are bundled.
- A comments tab ships a seeded fake comment with no backend; README claims
  "Collaborative Ready".
- `apiCall` and `negate` are exposed in the UI but dropped or stubbed on export.
- 19 `ui/` components (~2.4k lines) are never imported.
- Docs claim "54+ components"; the registry has 50 and only 47 are draggable.

## Child issues

- [ ] #01 theme: remove theme management; enforce monochrome light/dark
- [ ] #02 auth: remove the better-auth/Postgres gate
- [ ] #03 charts: remove the evilcharts category
- [ ] #04 effects: remove the effects studio and fake AI loaders
- [ ] #05 comments: remove the fake collaboration tab
- [ ] #06 api: finish or remove apiCall / negate codegen
- [ ] #07 cleanup: delete unused `ui/` components and empty `src/utils/`
- [ ] #08 cleanup: remove tracked junk artifacts
- [ ] #09 docs: fix the component count and inaccurate claims
- [ ] #10 export: make the ZIP a runnable project (or fix the claim)

## Done when

Every child issue is closed or explicitly deferred, and README/landing copy
match what the builder actually does.
