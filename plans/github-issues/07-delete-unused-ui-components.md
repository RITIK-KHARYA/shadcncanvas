# cleanup: delete unused ui/ components and the empty src/utils/ directory

## Summary

19 of the 55 `src/components/ui` files are never imported. `src/utils/` is an
empty directory that the README claims holds codegen/validation helpers.

## Evidence

Never imported by any other file (verified across `src`):

`accordion`, `alert`, `aspect-ratio`, `breadcrumb`, `combobox`, `context-menu`,
`input-otp`, `menubar`, `navigation-menu`, `pagination`, `progress`,
`radio-group`, `resizable`, `scroll-area`, `sidebar`, `toggle`, `toggle-group`.

- `toggle` is imported only by `toggle-group`; `sidebar` is imported by nothing.
- `sheet` and `tooltip` are imported only by `ui/sidebar.tsx`.
- Total ~2,389 lines.

## Proposed change

- Delete the unused components and their transitive-only dependencies
  (`sidebar`, `sheet`, `tooltip`, `toggle`, `toggle-group`).
- Keep `chart`, `sonner`, `form`, `card` and everything the palette uses.
- Delete `src/utils/` and correct the README project-structure section.

## Acceptance criteria

- [ ] No unreferenced files left in `src/components/ui`.
- [ ] `tsc`, `oxlint`, `vite build` pass.
- [ ] README no longer describes `src/utils/`.
