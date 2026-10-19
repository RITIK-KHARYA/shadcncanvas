# cleanup: remove tracked junk artifacts from the repo

## Summary

Three build/scratch artifacts are committed to git and have no purpose in the
project.

## Evidence

Tracked files:

- `tsc.txt` — captured TypeScript output.
- `prisma-next.md` — scratch notes for the (soon to be removed) Prisma layer.
- `src/3D_Motion_Graphics_Contract.docx` — unrelated binary document.

`.output/` is already gitignored.

## Proposed change

- `git rm` the three files.
- Confirm nothing references them.
- If any content is still wanted, move it into `plans/` as Markdown first.

## Acceptance criteria

- [ ] The three files are gone from the working tree and git history tip.
- [ ] No build or doc step references them.
