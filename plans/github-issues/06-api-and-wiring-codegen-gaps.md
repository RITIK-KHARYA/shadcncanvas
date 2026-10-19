# api: finish or remove apiCall codegen; implement or drop negate; rename Prototype -> Wire

## Summary

The API inspector and the wire transforms advertise behaviour that export does
not reproduce.

## Evidence

- `graph-store.ts` performs a live `fetch` with headers, body and timeout, but
  `lib/codegen/wiring.ts` drops headers and timeout, and `codegen.ts` renders the
  exported `apiCall` node as a stub `<div>`.
- `negate` exists in the transform list (`lib/graph/transforms.ts`) but is
  silently ignored when wires are emitted (`wiring.ts`).
- There is no prototype/preview mode; `PrototypePanel` only re-exposes the edge
  transform dropdown that already exists on the canvas.
- `components/inspector/properties/EffectsSection.tsx` renders the **Wiring**
  section despite its name.

## Proposed change

- Decide per feature:
  - `apiCall`: either emit real `fetch`/`useEffect` code with method, headers,
    body and timeout (or a generated `api.ts` helper), or remove the node and
    the API inspector.
  - `negate`: implement it in codegen or remove it from `EDGE_TRANSFORMS`.
- Rename the Prototype tab to "Wire" and merge it with the existing Wiring
  section, or delete the tab.
- Rename `EffectsSection.tsx` to `WiringSection.tsx`.

## Acceptance criteria

- [ ] Every option shown in the UI either survives export or is removed.
- [ ] Tab/file names match what they render.
- [ ] No silent no-op transforms remain.
