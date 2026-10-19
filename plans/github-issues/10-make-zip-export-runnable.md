# export: make the ZIP a runnable project or correct the claim

## Summary

The exported ZIP is four loose files, not the "complete project scaffolding" the
copy promises, and the generated chart imports cannot resolve.

## Evidence

- `lib/exportZip.ts` writes `GeneratedComponent.tsx`, `graph.json`,
  `theme.json`, `README.txt` only.
- No `package.json`, `tsconfig.json`, `globals.css` or `components/ui/*` shim is
  included, yet `GeneratedComponent.tsx` imports `@/components/ui/...`.
- Chart nodes additionally import `@/components/evilcharts/blocks/...` (see the
  charts issue).
- The generated file has no `tsconfig` path alias for `@/`.

## Proposed change

Pick one:

1. Ship a runnable scaffold: `package.json`, `tsconfig.json` with the `@/*`
   path, `app/globals.css`, and either real `components/ui` files or a README
   listing `npx shadcn@latest add ...` commands for every used component.
2. Keep the minimal export and change all copy to say it is a component
   snippet that assumes an existing shadcn project.

## Acceptance criteria

- [ ] A user can drop the export into a shadcn project (or run it) without
      editing import paths.
- [ ] No generated import points at a path that does not exist.
- [ ] The README and landing copy describe the export accurately.
