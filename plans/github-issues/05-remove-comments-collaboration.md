# comments: remove the fake collaboration tab

## Summary

The Comments tab is a facade: it seeds a fake comment, credits it to "Alex",
and persists nothing. Remove it, or build it for real later.

## Evidence

- `store/comments-store.ts` seeds a comment attributed to "Alex"; new comments
  are hard-coded to author "You".
- The store has no `persist` middleware, unlike the graph/theme stores.
- `commentsFor` selection helper is never called from the UI.
- There is no backend or presence layer anywhere in the repo.
- README advertises "Collaborative Ready".

## Proposed change

- Remove the Comments tab, `CommentsPanel`, `comments/` components and
  `comments-store`.
- Remove the "Collaborative Ready" claim from the README.
- Reuse the freed panel slot for an export/code preview if desired.

## Acceptance criteria

- [ ] No Comments tab and no seeded/fake comments.
- [ ] No "collaboration" claims in docs or landing copy.
- [ ] `tsc`, `oxlint`, `vite build` pass after removal.
