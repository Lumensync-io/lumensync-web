# Production cutover and rollback runbook

Status: **prepared, not executed.** No DNS record, Cloudflare setting, Azure
resource or Vercel domain has been changed. Executing this runbook requires
explicit owner authorization.

This repository is public. Account identifiers, zone IDs, the Cloudflare Access
team domain, the Azure endpoint hostname, the two protected legacy customer
paths and any token are deliberately **not** written here — they are captured in
the private cutover record during step P1 below and referenced as placeholders
(`<LIKE_THIS>`). `<LEGACY_PATH_A>` and `<LEGACY_PATH_B>` are the two existing
Access-protected customer paths on `www`; their real values are in that record
and are already known to whoever runs this.

---

## 1. What this runbook moves

| Hostname | Today | After cutover |
|---|---|---|
| `www.lumensync.io` | Cloudflare proxy in front of the legacy Azure static site | Cloudflare proxy in front of this Vercel project, **except** the two legacy paths |
| `lumensync.io` (apex) | Cloudflare proxy, 301 to `www` | **Unchanged** — still 301 to `www` |
| `www.lumensync.io/<LEGACY_PATH_A>/*` | Cloudflare Access, then Azure | **Unchanged behaviour** — Access, then Azure, via an origin override |
| `www.lumensync.io/<LEGACY_PATH_B>/*` | Cloudflare Access, then Azure | **Unchanged behaviour** — Access, then Azure, via an origin override |
| `app.lumensync.io` | DNS-only A record to Vercel (the application project) | **Untouched. Do not edit this record.** |

`www` is the canonical public host, not the apex. Two facts decide this: the
apex already redirects to `www` in production, and the Access applications that
protect the legacy customer routes are bound to the `www` hostname. Canonical
URLs in this codebase are `https://www.lumensync.io/...` accordingly, so no
canonical points at a redirect and no existing customer bookmark changes.

## 2. Observed current state (2026-08-15)

Verified from public DNS and unauthenticated HTTP responses:

- Zone `lumensync.io` is served by two Cloudflare nameservers.
- Apex and `www` both resolve to Cloudflare anycast addresses — both records are
  **proxied**. Apex returns `301` to `https://www.lumensync.io/` from the
  Cloudflare edge.
- `www` returns `200` from Cloudflare with the legacy site behind it.
- the two legacy paths return `302` to the Cloudflare Access
  login for the team domain, and carry `X-Robots-Tag: noindex, nofollow`.
  Protection is enforced at the edge on hostname plus path, not by the origin.
- `app.lumensync.io` resolves to a Vercel address, **not** a Cloudflare address —
  that record is DNS-only, and Cloudflare is not in its path.
- The website Vercel project has exactly one domain, `lumensync-web.vercel.app`,
  and no custom domain.

The consequence that shapes the whole plan: because Access is enforced at the
Cloudflare edge for `www`, **`www` must stay proxied**. Pointing it straight at
Vercel would silently remove the protection from the legacy customer routes and
stop serving them at the same time.

## 3. Target routing

Keep `www` proxied by Cloudflare. Change only what the proxy treats as the
origin:

```
                    ┌── <LEGACY_PATH_A>  ─┐
browser ── Cloudflare edge (Access) ───────┼──> Azure static site   (origin override)
                    └── <LEGACY_PATH_B>  ───┘
                    └── everything else ──────> Vercel: lumensync-web
```

Why this shape:

- The public A records do not change. Both hostnames already resolve to
  Cloudflare, so **there is no public DNS propagation window** — the switch and
  its reversal take effect in seconds.
- Access policies, their team domain and their audience tags are untouched.
- Rollback is a single record edit, not a DNS migration.

The simpler alternative — pointing `www` at Vercel DNS-only, as `app` already
is — is a better long-term shape, but it can only happen after the legacy
customer surfaces are deliberately retired or rehomed on their own hostname.
That is an owner decision and is out of scope here.

## 4. Decisions — made, and what each now requires

| Decision | Owner ruling | What it requires before cutover |
|---|---|---|
| Legacy customer routes | **Preserve.** Not retired, not exposed | The origin override in C3, proven as a no-op first |
| Demo request destination | **A LumenSync-controlled Azure webhook/function feeding a dedicated LumenSync demo-request mailbox.** No third-party form vendor | The endpoint, the mailbox, a named backup monitor, and the end-to-end receipt proof in P4 |
| Legal pages | **Public launch is gated on counsel-approved Privacy and Terms** | The approved text shipped, `LEGAL_CONTENT_STATE` flipped to `"approved"` in the same change, and the approval recorded |
| Indexing | **Never while legal content is unapproved** | Now enforced in code — see section 4a |

### 4a. The four indexing gates

Indexing requires **all four**, and each is independent:

1. `VERCEL_ENV=production`
2. the production host equals the canonical host (`www.lumensync.io`)
3. `SITE_INDEXABLE=true`
4. `LEGAL_CONTENT_APPROVED=true`

Neither flag substitutes for the other. Additionally, the build **fails** if
`LEGAL_CONTENT_APPROVED` is set while the repository still ships pre-approval
legal text, so the flag cannot be set ahead of the words. Attaching the domain
satisfies condition 2 only — it does not publish the site.

## 5. Pre-cutover — evidence and anchors

Nothing below may be skipped: every rollback step depends on a value captured
here, so that no part of the reversal relies on anyone's memory.

**P1. Capture the current configuration into the private cutover record.**

- Export the full Cloudflare DNS record set for the zone (the zone-file export,
  not a screenshot) and store it with the date.
- Record, for `www` and the apex: record type, content, proxy state and TTL.
- Record the current origin the proxy sends `www` to — this is the value
  rollback restores. Note it as `<AZURE_ORIGIN_HOST>`.
- Export or screenshot: the redirect rule that sends apex to `www`, every
  Cloudflare Access application (name, hostname, path, policies), the SSL/TLS
  encryption mode, and any existing cache, origin or transform rules.
- Record the Azure static-website endpoint hostname and confirm it responds
  directly, so the override target is known to work.
- Record `app.lumensync.io`'s record exactly as it stands, purely so any
  accidental change to it is detectable.

**P2. Anchor the application state.**

- Record the current `main` SHA, the green CI run ID, and the current production
  deployment ID as `<ROLLBACK_DEPLOYMENT>` — this is the deployment to promote if
  the site itself, rather than the routing, turns out to be the problem.
- Confirm the working tree is clean and `main` is the commit that was reviewed.

**P3. Confirm the build that is about to become public.**

- CI green on the exact `main` SHA.
- `npm ci && npm run lint && npm run typecheck && npm test && npm run build`
  clean locally.
- Playwright green against the current production URL at desktop and 375 px.
- Public-safety scan of the tree: no customer data, no secrets.
- `robots.txt` still `Disallow: /` and every response still carries
  `X-Robots-Tag: noindex` — indexing is switched on later, deliberately.

**P4. Confirm the form's destination, if it is being switched on.**

- Set the environment variables on the **production** environment only, and
  redeploy so the build picks them up.
- Verify on the resulting deployment that `GET /api/demo-request` reports
  `enabled: true`, then submit one real test request and confirm it arrives at
  the destination. A destination that has never received a real submission is
  not a verified destination.

**P5. Announce the window.** Short, but the legacy customer routes are in the
blast radius; anyone who might be asked about them should know it is happening.

## 6. Cutover

Perform in order. Verify each step before starting the next; any failed
verification means stop and roll back rather than continue.

**C1. Add the domain to the Vercel project.**

- Add `www.lumensync.io` to project `lumensync-web` and set it as the production
  domain. Add the apex only if the apex redirect is being moved to Vercel later;
  this runbook leaves the apex redirect on Cloudflare.
- Because the record is proxied, Vercel cannot validate over HTTP. Complete the
  verification Vercel asks for using the TXT record it specifies. If TXT
  verification is unavailable, the alternative is to set the record DNS-only
  briefly for issuance and re-enable the proxy immediately afterwards — that
  variant does expose the origin during the window, so prefer TXT.
- Verify: Vercel lists the domain as valid with a certificate issued.
- Note that adding the domain changes `VERCEL_PROJECT_PRODUCTION_URL`, which
  satisfies one of the four indexing conditions. Indexing still stays off,
  because neither `SITE_INDEXABLE` nor `LEGAL_CONTENT_APPROVED` is set. Verify
  this rather than assuming it: `robots.txt` must still say `Disallow: /` and
  responses must still carry `X-Robots-Tag: noindex` after the domain is added.

**C2. Set the SSL/TLS mode.**

- Cloudflare encryption mode must be **Full (strict)** before the origin becomes
  Vercel. Anything weaker either breaks the connection or downgrades it.
- Verify: the mode is Full (strict) and the legacy site still loads.

**C3. Add the legacy-path origin overrides — before moving the origin.**

- Create origin rules for `<LEGACY_PATH_A>` and `<LEGACY_PATH_B>` on the `www`
  hostname that resolve to `<AZURE_ORIGIN_HOST>` and override the Host header to
  match what Azure expects.
- Do this while `www` still points at Azure, so the rules are a no-op and can be
  proven not to break anything.
- Verify: both paths still return the Access login, and both still work after
  authenticating.

**C4. Move the `www` origin to Vercel.**

- Change the `www` record to a proxied CNAME to the target Vercel supplies for
  the project. Keep the proxy on.
- Purge the Cloudflare cache for the hostname.
- Verify immediately: `https://www.lumensync.io/` serves the new site; the
  certificate is valid; the two legacy paths still present the
  Access login and still serve after authentication; the apex still returns 301
  to `www`; `app.lumensync.io` is unchanged.

**C5. Confirm caching behaviour.**

- Ensure `/api/*` is not cached by Cloudflare.
- Ensure `/_next/static/*` is cacheable, and that HTML is not served stale.
- Verify: a hard reload gets fresh HTML; a static asset returns a cache hit.

**C6. Run the acceptance checklist in section 7.** Do not enable indexing until
it passes end to end.

**C7. Enable indexing — a separate, deliberate step, and the last one.**

- Prerequisite: the counsel-approved Privacy and Terms text is already shipped
  and `LEGAL_CONTENT_STATE` is `"approved"` in that same build. If it is not,
  stop — setting the flag will fail the build, which is the intended behaviour.
- Set **both** `SITE_INDEXABLE=true` and `LEGAL_CONTENT_APPROVED=true` on the
  production environment and redeploy.
- Verify: `robots.txt` allows crawling and names the sitemap; no response
  carries `X-Robots-Tag: noindex`; `sitemap.xml` lists only
  `https://www.lumensync.io` URLs; every canonical matches the page's own URL.
- Confirm the two legacy paths still carry `noindex` from the edge.
- Submit the sitemap to Search Console only after the above passes.

## 7. Acceptance checklist

Run against `https://www.lumensync.io` after C4, and again after C7.

**Routing and transport**

- [ ] All 16 routes return 200: `/`, `/product`, the seven `/product/*` pages,
      `/why-lumensync`, `/security`, `/about`, `/request-demo`, `/contact`,
      `/legal/privacy`, `/legal/terms`.
- [ ] `http://` requests upgrade to `https://`.
- [ ] The apex returns 301 to `https://www.lumensync.io/` and no page canonical
      points at the apex.
- [ ] The certificate is valid and matches the hostname; no mixed content.
- [ ] An unknown path returns the site's own 404 with header and footer.

**Presentation**

- [ ] Full route sweep at 1280 px and 375 px: no horizontal overflow, no broken
      image, no console error, no failed request.
- [ ] Header navigation and the mobile menu reach every route.
- [ ] axe reports zero serious or critical issues on a sample of routes at both
      widths.

**The form**

- [ ] `GET /api/demo-request` reports the expected state for the configuration.
- [ ] If enabled: a real submission returns a reference and arrives at the
      destination; a deliberately invalid submission returns field errors and is
      not delivered; the honeypot and the too-fast paths are refused.
- [ ] If not enabled: the page says so and the endpoint returns 503 rather than
      accepting anything.

**Indexing and metadata** (after C7)

- [ ] `robots.txt` allows crawling and names the sitemap.
- [ ] `sitemap.xml` lists every route once, all on the canonical host.
- [ ] No response carries `X-Robots-Tag: noindex`.
- [ ] Titles and descriptions are unique per route.

**The things that must not have changed**

- [ ] `<LEGACY_PATH_A>` presents the Access login, and serves normally after
      authentication.
- [ ] `<LEGACY_PATH_B>` behaves the same way.
- [ ] Both still carry `noindex` at the edge.
- [ ] `app.lumensync.io` responds exactly as recorded in P1, and its DNS record
      is byte-identical to the record captured there.
- [ ] No Azure resource was modified; the static site is still deployable.

**External visibility**

- [ ] The site loads from a network outside the office, and on a phone on
      mobile data.
- [ ] A cold browser profile with no extensions shows the same result.

## 7a. Cloudflare rule ordering — and how each rule is reversed

Order matters: Cloudflare evaluates origin rules top-down and the **first match
wins**, so the two legacy-path rules must sit above anything that could match
them. The whole marketing site is served by the default origin (the `www` DNS
record), so it needs no rule of its own — which is what keeps this reversible.

| # | Rule | Matches | Action | Reversal |
|---|---|---|---|---|
| 1 | Legacy path A origin override | `http.host eq "www.lumensync.io" and starts_with(http.request.uri.path, "<LEGACY_PATH_A>")` | Resolve to `<AZURE_ORIGIN_HOST>`, Host header overridden to what Azure expects | Disable the rule; the path then follows the default origin. Delete only after the routing is settled |
| 2 | Legacy path B origin override | same shape, `<LEGACY_PATH_B>` | as above | as above |
| — | Everything else | no rule | Default origin = the `www` DNS record | Change the record back (step R2) |

Rules that must **not** be touched, in any order: the apex-to-`www` redirect
rule, and the Access applications on the two legacy paths. Access is evaluated
before origin selection, so an origin rule cannot bypass it — but a rule that
changed the hostname or stripped the path prefix could put a request outside the
Access application's scope. Keep both rules matching the same hostname and the
same path prefix the Access applications use.

Two verification points, both mandatory:

- **Before** the origin moves (C3): with the rules live and `www` still on
  Azure, both paths behave exactly as recorded in P1. This proves the rules are
  a no-op.
- **After** the origin moves (C4): both paths still present the Access login and
  still serve after authentication, while the marketing routes come from Vercel.

If either verification fails, disable the two rules and stop. The site is then
exactly as it was.

## 7b. Pre-cutover evidence record — the template to fill

Kept in the private cutover record, never in this repository. Every rollback
step reads a value from here.

| Field | Value | Captured |
|---|---|---|
| Date and operator | | |
| Website `main` SHA | | |
| Green CI run ID | | |
| Current production deployment ID (`<ROLLBACK_DEPLOYMENT>`) | | |
| Cloudflare zone export filename | | |
| `www` record: type, content, proxy state, TTL (`<AZURE_ORIGIN_HOST>`) | | |
| Apex record and the apex→`www` redirect rule definition | | |
| Access application A: name, hostname, path, policies | | |
| Access application B: name, hostname, path, policies | | |
| SSL/TLS encryption mode before the change | | |
| Existing cache / origin / transform rules | | |
| Azure static-website endpoint hostname, and its direct response | | |
| `app.lumensync.io` record, byte for byte | | |
| Demo endpoint URL configured, and the receipt proof reference | | |
| Mailbox address, primary monitor, backup monitor | | |
| Legal approval: approver, document version, date | | |
| `SITE_INDEXABLE` / `LEGAL_CONTENT_APPROVED` before the change (both must be unset) | | |

## 8. Rollback

### Triggers — any one of these, no debate at the time

1. Any of the 16 routes returns a non-200 for more than two minutes after a
   cache purge.
2. `<LEGACY_PATH_A>` or `<LEGACY_PATH_B>` fails to present the Access login, or
   fails to serve after authentication.
3. `app.lumensync.io` deviates in any way from the behaviour recorded in P1.
4. A TLS error, certificate name mismatch, or redirect loop on either hostname.
5. The demo form returns 5xx on a verification attempt, or the destination stops
   accepting deliveries.
6. The acceptance sweep finds console errors or broken images that were not
   present on the pre-cutover deployment.
7. The site is found indexed before indexing was authorized.

### Sequence

**R1. Take indexing back off first, if it was on.** Unset `SITE_INDEXABLE` (and
`LEGAL_CONTENT_APPROVED` if the reason for rolling back is the legal content),
redeploy, confirm `robots.txt` is `Disallow: /` and responses carry
`X-Robots-Tag: noindex`. Either flag alone is enough to close the gate, so this
is a single-variable action. Doing it first stops the problem spreading into
search results while the rest is fixed.

**R2. Restore the origin.** Change the `www` record back to
`<AZURE_ORIGIN_HOST>` exactly as captured in P1, proxy still on. Purge the
cache. Because the record is proxied, this takes effect in seconds and no public
DNS change is involved.

**R3. Verify the restoration.**

- `https://www.lumensync.io/` serves the legacy site.
- the two legacy paths present the Access login and serve after
  authentication.
- The apex still returns 301 to `www`.
- `app.lumensync.io` is unchanged.

**R4. Leave the rest in place.** The Vercel domain attachment and the origin
rules are harmless once the origin points back at Azure, and removing them
during an incident adds risk. Remove them later, deliberately.

Rollback time is dominated by the Cloudflare configuration save and the cache
purge, not by DNS: both hostnames already resolve to Cloudflare and the public
records do not change, so there is **no propagation wait** in the reversal path.
The one exception is the Vercel domain attachment itself, which is why R4 leaves
it alone rather than unwinding it under pressure.

**R5. If the fault is in the site rather than the routing**, and routing is to
be kept: promote `<ROLLBACK_DEPLOYMENT>` in Vercel, or revert the offending
commit on `main` through a normal pull request and let CI redeploy. Never push
directly to `main` and never bypass branch protection, including during an
incident.

**R6. Record what happened** in the private cutover record: the trigger, the
time, what was reverted, and the state everything was left in.

### What rollback does not touch

The apex redirect, the Access applications, the `app` record, the Azure static
site content, and the GitHub repository. If any of those has been changed, that
change is its own incident and is reverted from the P1 evidence.

## 9. After a successful cutover

- Remove the Vercel deployment-protection bypass secret if automated preview
  testing no longer needs it.
- Decide the future of the legacy customer routes, so the routing can eventually
  be simplified to a DNS-only record like `app` already uses.
- Replace the in-memory rate limiter with a durable one if submission volume
  ever justifies it.
- Revisit whether any measurement is needed, with the privacy consequences
  stated at the time.
