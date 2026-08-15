# lumensync-web

Public marketing website for **LumenSync** — lighting coordination
intelligence for complex commercial projects (`lumensync.io`).

Governed by *LumenSync Public Website — Architecture & Development Plan v1.0*.
This repository is operationally independent from the authenticated
application (`app.lumensync.io`) and must stay that way: no app credentials,
no customer data, no shared infrastructure.

## Stack

- Next.js (App Router, React Server Components by default)
- TypeScript (strict)
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- Vitest + Testing Library (unit/component)
- Playwright + axe-core (desktop + 375px smoke, accessibility)
- Deployed on Vercel (dedicated project; previews per branch/PR)

## Local development

```bash
npm ci          # install exact locked dependencies
npm run dev     # http://localhost:3000
```

## Quality gates (all must pass before merge)

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e   # requires a completed `npm run build`
```

CI (GitHub Actions, `.github/workflows/ci.yml`) runs the same gates on every
push and pull request.

## Project structure

- `lib/site.ts` — canonical site config: URLs, navigation IA, route registry
  (mirrors the approved Plan v1.0 information architecture — do not add
  top-level areas that are not in the plan)
- `app/` — App Router routes; placeholder pages carry real positioning copy
  only, no fabricated claims
- `components/` — site chrome (`site-header`, `site-footer`, `nav-client`)
  and small primitives (`primitives.tsx`, `logo.tsx`, `page-scaffold.tsx`)
- `tests/` — unit/component tests · `e2e/` — Playwright smoke suite

## Environment variables

None required at this stage. Optional, test-only:

- `E2E_PORT` — local port used by the Playwright web server (default `3000`).
- `E2E_BASE_URL` — run the smoke suite against an already-deployed URL
  (e.g. a Vercel preview) instead of starting a local server.

`process.env.VERCEL_ENV` and `VERCEL_PROJECT_PRODUCTION_URL` (provided by
Vercel) are read by `app/robots.ts` so that **only the real production domain
(`lumensync.io`) is ever indexable** — previews and the `*.vercel.app` project
URL always serve `Disallow: /`.

## Deployment

The GitHub repository is connected to a dedicated Vercel project. Pushes to
branches create preview deployments; nothing in this repository may attach or
alter production DNS (`lumensync.io` / `www.lumensync.io`) — production
cutover is governed by a separate, explicitly-authorized work item.

## Guardrails

- No customer data, project names, drawings, or credentials in this repo.
- No fabricated customers, testimonials, metrics, or certifications in copy.
- Legacy customer surfaces (`/cactus-club/`, `/project-login/`) are **not**
  part of this site and must not be recreated here.
