# docs: fix the component count and inaccurate README/landing claims

## Summary

The marketing copy overstates what ships. Make every claim match the code.

## Evidence

- Copy claims "54+ components" / "54 shadcn/ui components" in
  `README.md:12`, `README.md:106`, `src/components/landing-v2/content.ts:40`,
  `content.ts:88` and `src/components/landing-v2/landing.tsx:452` (JSON-LD).
- The registry defines 50 node types and the palette offers 47.
- At least 18 entries are not shadcn (15 evilcharts blocks, `thinking-orb`,
  `bot-avatar`, `sonner` toast, the custom `form` and `apiCall`).
- README claims "Fully client-side" while auth + Postgres gate `/app`.
- README claims "Collaborative Ready" with no collaboration feature.
- README documents `src/utils/` for codegen/validation, which is an empty dir.
- README/landing imply "complete project scaffolding" / "theme configuration
  included", but the ZIP contains only `GeneratedComponent.tsx`, `graph.json`,
  `theme.json` and `README.txt`.

## Proposed change

- Publish the real number, or separate "shadcn/ui components" from
  "integrations" so the wording is honest.
- Correct or remove the offline, collaboration, `utils/` and scaffolding claims.
- Keep the landing JSON-LD `featureList` in sync.

## Acceptance criteria

- [ ] Every count in docs matches the registry.
- [ ] No claim describes a feature the repo does not have.
- [ ] Landing and README agree.
