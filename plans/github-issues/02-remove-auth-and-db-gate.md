# auth: remove the better-auth/Postgres gate and make the builder public

## Summary

The builder is gated behind login backed by Postgres, but nothing is stored
server-side. Remove the auth and database stack and make `/app` public.

## Evidence

- Persistence is `localStorage` only: `lib/persistence.ts` key
  `shadcncanvas-project-v1`.
- `prisma/contract.ts` defines only boilerplate `User` / `Post` models; there is
  no project table.
- `components/auth/require-auth.tsx` gates `/app`; `pages/auth-page.tsx`,
  `lib/auth-client.ts`, `api/auth/[...all].ts`, `server/*`,
  `vite-plugin-auth.ts` and the `Log Out` button (`builder-page.tsx`) exist only
  for that gate.
- `.env.example` requires `DATABASE_URL` and OAuth secrets.

## Proposed change

- Delete the auth pages/components, `api/auth`, `server/*`, `src/prisma/*`,
  `prisma.config.ts`, `vite-plugin-auth.ts`.
- Remove `better-auth`, `@supabase/*`, `pg`, `kysely`, `@prisma/*`, `prisma`
  dependencies and the contract/migrate scripts.
- Remove the `/auth` route, the `RequireAuth` wrapper and the Log Out button.
- Replace with project JSON import/export so portability does not need an
  account.

## Acceptance criteria

- [ ] `/app` loads with no login.
- [ ] No DB/OAuth environment variables are required to run or deploy.
- [ ] Users can still move a project between browsers (export/import JSON).
- [ ] README no longer implies accounts or cloud storage.
