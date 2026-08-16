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
- `VERCEL_AUTOMATION_BYPASS_SECRET` — optional; when set, Playwright sends the
  `x-vercel-protection-bypass` header so the suite can reach a Vercel preview
  that sits behind Vercel Authentication. Supply it from your shell or CI
  secrets only — never commit it.

### Deployment environment variables

None of these are committed, and none reach the browser.

- `SITE_INDEXABLE` — set to `"true"` only on the production deployment, and only
  after routing has been proven, to allow crawling. See `lib/indexing.ts`:
  indexing additionally requires `VERCEL_ENV=production` and a production host
  equal to the canonical host, so **attaching the domain does not by itself
  publish the site to search engines**. Unsetting it withdraws the site from
  indexing without touching DNS.
- `DEMO_REQUEST_WEBHOOK_URL`, `DEMO_REQUEST_FORM_SECRET`,
  `DEMO_REQUEST_WEBHOOK_TOKEN` — the demo form's delivery destination. Absent or
  incomplete means the form stays visibly inactive and the API returns 503. See
  [`docs/demo-request.md`](docs/demo-request.md).

The canonical public host is `www.lumensync.io` (`lib/site.ts`), because the
apex already redirects there and the protected legacy customer routes are bound
to that hostname at the edge.

## Deployment

The GitHub repository is connected to a dedicated Vercel project. Pushes to
branches create preview deployments; nothing in this repository may attach or
alter production DNS (`lumensync.io` / `www.lumensync.io`) — production
cutover is governed by a separate, explicitly-authorized work item and is
documented step by step, with its rollback, in
[`docs/production-cutover.md`](docs/production-cutover.md).

### No analytics

This site carries no analytics, tag manager, pixel, session recorder or cookie
of any kind, and makes no third-party request when a page loads. That is a
deliberate V1 decision, it is what `/legal/privacy` states as fact, and
`tests/no-tracking.test.ts` fails the build if it stops being true.

## Product imagery (public-repo safety)

Every image under `public/product/` is a real capture of the LumenSync app
taken from the vendor-owned **demo project (DEMO-2026-001)** — synthetic
fixture types, a QA test drawing, no customer data. Each file must be
registered in `lib/product-media.ts` (alt text + surface + provenance) and is
rendered only through `components/marketing/product-frame.tsx`, which always
shows the provenance caption. `tests/public-assets.test.ts` fails the build if
an unregistered asset, a forbidden brand/customer term, or a secret-like
string appears in public site source. Never add customer screenshots.

## Guardrails

- No customer data, project names, drawings, or credentials in this repo.
- No fabricated customers, testimonials, metrics, or certifications in copy.
- Legacy customer surfaces from the current static site (the customer sign-in
  and per-customer paths) are **not** part of this site and must not be
  recreated here. `tests/forbidden-terms.ts` enforces this without naming them.
