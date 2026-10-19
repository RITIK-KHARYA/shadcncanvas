# charts: remove the evilcharts category (exported imports are broken)

## Summary

Remove the 15 ECharts blocks and the `echarts` dependency. They are not shadcn,
and the code we generate for them cannot compile in a user's project.

Supersedes #8 ("Add evilcharts components").

## Evidence

- `src/components/evilcharts/` is 12,091 lines, 2.2x the whole `ui/` folder.
- `lib/registry/component-map.ts` maps each block to
  `evilcharts/blocks/...`, and `lib/codegen/imports.ts` emits
  `import { X } from "@/components/evilcharts/blocks/..."` — a path that does
  not exist in the exported ZIP.
- The blocks pull in `echarts` and dominate the 2.6 MB builder chunk.
- They are presented and counted as "shadcn/ui components".

## Proposed change

- Remove the 15 registry entries, `component-map` rows, schemas, NodePreview and
  NodeSkeleton cases.
- Delete `src/components/evilcharts/`, the `@evilcharts` entry in
  `components.json`, and the `echarts` dependency.
- Rely on the existing recharts-based `ui/chart.tsx` node for charts; it already
  exports a resolvable import.

## Acceptance criteria

- [ ] No ECharts nodes in the palette and no `evilcharts` imports in codegen.
- [ ] `echarts` is gone from `package.json`.
- [ ] A chart node exports code that resolves in a standard shadcn project.
- [ ] Builder chunk shrinks measurably.
