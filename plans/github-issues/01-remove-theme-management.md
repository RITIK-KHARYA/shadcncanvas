# theme: remove theme management and enforce monochrome light/dark

## Summary

Remove the theme editor. The builder should offer a single white/black
(light/dark) mode that applies to the whole app, so the sidebars and the canvas
can never diverge.

## Motivation

- With no node selected, the Design tab rendered `ThemePanel`, a full colour
  studio: 4 presets (`default`, `emerald`, `violet`, `rose`), an HSL
  hue/saturation/lightness adjustment set, ~30 colour tokens, sidebar/chart
  colours and font/shadow editing (`ThemePanel.tsx`, `editor-store.ts`).
- The theme was applied only to the canvas `<section>`
  (`use-canvas-theme.ts` -> `theme/apply.ts`), never to the shell. Sidebars read
  `--sidebar` from `global.css`, so a recoloured canvas sat next to black chrome.
- `currentMode` defaulted from the OS (`prefers-color-scheme`) while
  `index.html` hard-coded `class="dark"`, so on a light-mode OS the canvas
  rendered light tokens inside the dark shell.
- The customisation was persisted under
  `localStorage["shadcn-canvas-theme-editor"]`, so an old preset/colour survived
  reloads (source of the "canvas is orange" report).
- Edges were hard-coded `#f97316` (orange) / `#22c55e` (green) in
  `lib/graph/transforms.ts`.

## Proposed change

- Add `lib/theme.ts` + `store/theme-mode-store.ts`: a persisted `"light" |
  "dark"` mode, applied to `document.documentElement`, default `dark`.
- Add a Sun/Moon toggle to the builder header.
- Delete `ThemePanel`, `editor-store`, `theme-store`, `types/theme.ts`, the
  `theme/` helpers, `use-canvas-theme` and `use-theme-tokens`.
- Persist `mode` instead of theme tokens (`persistence.ts` -> v2).
- Drop the theme tokens from codegen and from `theme.json`.
- Neutralise edge colours: one muted stroke, dash pattern for transforms.
- Neutralise remaining chrome accents (port-type dots, API warning banner).

## Acceptance criteria

- [ ] Sidebars and canvas always share the same theme.
- [ ] Only light and dark exist; no presets, HSL sliders or per-token editing.
- [ ] Toggling mode updates the whole builder and survives reload.
- [ ] Legacy `shadcn-canvas-theme-editor` storage is cleared.
- [ ] `npx tsc -b`, `npx oxlint .`, `npx vite build` pass.

Status: implemented on `main`.
