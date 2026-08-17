# Production cutover and rollback runbook

Status: **C1 and C2 executed; C3 redefined; C4 not executed.** The production
`www` DNS record still points at the legacy origin and no traffic has moved.
Executing C4 requires explicit owner authorization.

Revision 2026-08-17 (LSWEB-014). Two things changed since the first draft:

1. **The owner has retired the legacy customer surfaces.** There are no active
   legacy customers requiring `<LEGACY_PATH_A>` or `<LEGACY_PATH_B>`, so their
   continuity is no longer a launch requirement.
2. **The original C3 was impossible on this zone.** It relied on Cloudflare
   Origin Rules overriding the origin host and Host header; both are
   Enterprise-only features and this zone is on the Free plan. The API rejected
   the attempt outright (`not entitled to use the Origin Host override`), so no
   such rule was ever created.

Together these remove the routing problem rather than solve it: nothing needs to
be held on the legacy origin after cutover.

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
| `www.lumensync.io` | Cloudflare proxy in front of the legacy Azure static site | Cloudflare proxy in front of this Vercel project — **all** paths |
| `lumensync.io` (apex) | Cloudflare proxy, 301 to `www` | **Unchanged** — still 301 to `www` |
| `www.lumensync.io/<LEGACY_PATH_A>/*` | Cloudflare Access, then Azure | **Retired.** Access still challenges at the edge; behind it the new site returns its own 404. No Azure origin, no proxy, no rewrite |
| `www.lumensync.io/<LEGACY_PATH_B>/*` | Cloudflare Access, then Azure | **Retired**, same as above |
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

Two further facts, established 2026-08-17, decide the shape of the plan:

- The zone is on the Cloudflare **Free** plan. Origin Rules exist on every plan,
  but overriding the origin host, the Host header or SNI is **Enterprise-only**.
  The original C3 — hold the two legacy paths on Azure by overriding the origin
  for those paths — is therefore not implementable here, and the API refuses it.
- The owner has decided the legacy customer surfaces are **retired** (see §4).
  Nothing needs to be held on Azure after cutover, so the override is not needed.

Because Access is enforced at the Cloudflare edge for `www`, **`www` stays
proxied** — that is still true, and it is what keeps the retired paths behind an
authentication challenge during and after cutover, as defence in depth.

## 3. Target routing

Keep `www` proxied by Cloudflare and move the origin — the whole origin — to
Vercel:

```
browser ── Cloudflare edge (Access still bound to the two retired paths)
                    └── every path ───────────> Vercel: lumensync-web
```

What happens to the retired paths after cutover: Access challenges first, as it
does today; anyone who passes it reaches the new site, which has no such routes
and returns its own 404. **The legacy content is not reachable through `www` at
all, because Azure is no longer an origin for it.**

Why this shape:

- The public record still resolves to Cloudflare, so **there is no public DNS
  propagation window** — the switch and its reversal take effect in seconds.
- Access applications, their team domain and their audience tags are untouched.
  They stay in place through cutover and are removed later, deliberately.
- Azure keeps serving the legacy site on its own endpoint, unchanged, so
  rollback is a single record edit that restores the previous behaviour in full,
  including both legacy paths.
- No Worker, no rewrite, no second hostname, no plan upgrade.

## 4. Decisions — made, and what each now requires

| Decision | Owner ruling | What it requires before cutover |
|---|---|---|
| Legacy customer routes | **Retired** (owner decision, 2026-08-17): there are no active legacy customers requiring either path, so continuity through cutover is no longer a launch requirement. This supersedes the earlier "preserve" ruling | The retirement verification in C3. Nothing is proxied, rewritten or rehomed. The content stays on Azure, and Access stays in place, purely as rollback infrastructure until cleanup is separately authorized |
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

## 4b. Environment changes require a clean build

Most of this site is prerendered at build time, and several pages read
configuration while they render — the demo form's state and the indexing gate
both do. **A redeploy that reuses the build cache can therefore serve the old
prerendered HTML with the new environment**, so the site behaves as though the
variable was never set.

This is not hypothetical: after the demo-request variables were first added, a
cache-reusing redeploy left `/request-demo` still rendering its inactive state
while the API on the very same deployment reported the form as live.

**The rule:** whenever a variable that affects prerendered output changes —
`SITE_INDEXABLE`, `LEGAL_CONTENT_APPROVED`, or any `DEMO_REQUEST_*` — release
with a **clean production build from the intended commit**, not a redeploy of an
existing deployment.

The rule is enforced, not just written down. The end-to-end test *"the rendered
form agrees with the deployment's own configuration"* reads the deployment's own
API and then asserts the rendered page matches it, so a stale prerender fails
the run rather than reaching a person. Run the deployed suite against any
release that changed one of those variables.

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

**C1. Add the domain to the Vercel project. — DONE 2026-08-17 (LSWEB-013C).**

- `www.lumensync.io` was added to project `lumensync-web`. It verified
  immediately (`verified: true`) because the Vercel account already owns the
  apex, so **no TXT verification record was required and none was created**.
- The domain config reports `misconfigured: true` while DNS still points at
  Cloudflare→Azure. That is the correct pre-C4 state, not a fault.
- The apex was not added; this runbook leaves the apex redirect on Cloudflare.
- Adding the domain changed `VERCEL_PROJECT_PRODUCTION_URL`, satisfying one of
  the four indexing conditions. Verified afterwards, not assumed: `robots.txt`
  still says `Disallow: /` and responses still carry `X-Robots-Tag: noindex`.
- Reversal: delete the domain from the project.

**C2. Set the SSL/TLS mode. — DONE 2026-08-17 (LSWEB-013C).**

- Cloudflare encryption mode must be **Full (strict)** before the origin becomes
  Vercel. Anything weaker either breaks the connection or downgrades it.
- Changed `full` → `strict`, after confirming the legacy origin presents a valid
  certificate chain. Verified after: the legacy site still loads over the edge,
  the apex still redirects, both legacy paths still reach Access, and
  `app.lumensync.io` — which is DNS-only and not behind Cloudflare — is
  unaffected.

**C3. Confirm the legacy surfaces are retired.** *(This replaces the original
C3, which created Azure origin overrides. That approach required Enterprise-only
Cloudflare features and has been removed — see §3.)*

C3 is now a verification gate, not a routing change. Require all five:

- the owner's retirement decision is recorded in the private cutover record;
- no current launch dependency on either path exists — check the new site's
  code, navigation, redirects, sitemap and docs, plus any health check or
  automation that might call them;
- the Access application stays **enabled** through cutover, unchanged;
- **no** replacement architecture is introduced — no origin rule, no rewrite, no
  Worker, no second hostname, no plan upgrade;
- Azure is untouched and still serving on its own endpoint, so it remains a
  usable rollback target until cutover acceptance completes.

Verify and record the expected post-cutover behaviour of both paths before
moving on. Nothing here mutates production.

**C4. Move the `www` origin to Vercel.**

*Prerequisite — C4.0, issue the certificate first.* Under Full (strict),
Cloudflare validates the origin's certificate. Vercel has **no** certificate for
`www.lumensync.io` until the domain resolves to it, and its automatic HTTP
validation cannot complete through a proxied hostname whose origin has no valid
certificate yet — a deadlock that would serve `526` to every visitor. Break it
before the flip: request the certificate with a DNS challenge
(`vercel certs issue --challenge-only www.lumensync.io`), add the
`_acme-challenge` TXT record it prints, complete issuance, then confirm Vercel
lists a certificate for the host. Remove the challenge record afterwards. The
documented fallback — briefly setting the encryption mode back to `full` for the
flip — weakens the edge-to-origin leg and must be recorded as an incident if
used.

- Change the `www` record from the legacy `CNAME → <AZURE_ORIGIN_HOST>` to the
  target Vercel specifies for this project. Vercel currently specifies
  **`A 76.76.21.21`**; re-read the domain configuration at execution time rather
  than trusting this line, and record what it says. **Keep the proxy on** — the
  record must stay orange-clouded so Access stays in front of the retired paths.
- Purge the Cloudflare cache for the hostname.
- Verify immediately, in this order: the certificate is valid and matches the
  hostname; `https://www.lumensync.io/` serves the new site; all 16 routes
  return 200; the apex still returns 301 to `www`; `app.lumensync.io` is
  byte-identical to its P1 record and still responds as before; the demo request
  endpoint reports the expected state; the legal pages serve; the site renders
  correctly at 1280 px and 375 px; **both retired paths expose no legacy
  content** — they present the Access challenge and, behind it, the new site's
  own 404; `robots.txt` is still `Disallow: /` and responses still carry
  `X-Robots-Tag: noindex`.
- Indexing stays off. C7 is a separate, later, explicitly authorized step.
- If any verification fails, roll back per §8 rather than pressing on.

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
  production environment, then release with a **clean build** — see section 4b.
  A cache-reusing redeploy can leave the old prerendered pages in place.
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

- [ ] `<LEGACY_PATH_A>` presents the Access login, and behind it returns the new
      site's own 404 — **no legacy content is served**.
- [ ] `<LEGACY_PATH_B>` behaves the same way.
- [ ] Neither path returns any content originating from the legacy site: check
      the response body, not just the status code.
- [ ] Both still carry `noindex` at the edge.
- [ ] The legacy site is still reachable on its own Azure endpoint, unchanged —
      this is the rollback target, and it must survive the cutover.
- [ ] `app.lumensync.io` responds exactly as recorded in P1, and its DNS record
      is byte-identical to the record captured there.
- [ ] No Azure resource was modified; the static site is still deployable.

**External visibility**

- [ ] The site loads from a network outside the office, and on a phone on
      mobile data.
- [ ] A cold browser profile with no extensions shows the same result.

## 7a. Cloudflare rules — what exists, and what must not be touched

**No origin rules are created by this runbook.** The retirement decision removed
the need for them, and the Free plan could not have provided them anyway. The
whole site is served by the default origin — the `www` DNS record — which is
exactly what keeps the cutover reversible with a single record edit.

The zone's existing rules, all of which stay as they are:

| Ruleset (phase) | What it does | Cutover treatment |
|---|---|---|
| Dynamic redirect (single redirect) | 301 apex → `https://www.lumensync.io/`, preserving the path | **Do not touch.** It is what keeps the apex behaviour unchanged |
| Response header transform | Sets `X-Robots-Tag: noindex, nofollow` on the two retired paths | **Do not touch.** It keeps the retired paths out of search results regardless of what serves them |
| Managed rulesets (normalization, managed WAF, DDoS L7) | Cloudflare defaults | Not in scope |

Also untouchable during cutover: the Access application and its policy. Access
is evaluated before origin selection, so moving the origin cannot bypass it —
that is precisely why the retired paths stay behind a challenge even after the
content behind them is gone.

The single verification that matters after C4: both retired paths present the
Access challenge and, behind it, the new site's 404 — and no response body
contains legacy content. If that is not true, roll back per §8.

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
2. `<LEGACY_PATH_A>` or `<LEGACY_PATH_B>` serves legacy content publicly, or
   stops presenting the Access challenge.
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

**R2. Restore the origin.** Change the `www` record back to a **proxied CNAME**
pointing at `<AZURE_ORIGIN_HOST>`, exactly as captured in P1 — same record ID,
type, target, proxy state and TTL. Purge the cache. Because the record is
proxied, this takes effect in seconds and no public DNS change is involved.

Retirement does not weaken rollback: the legacy content is still on Azure and
Access is still bound to both paths, so this single edit restores the previous
behaviour in full, including the two legacy customer surfaces.

**R3. Verify the restoration.**

- `https://www.lumensync.io/` serves the legacy site — compare against the P1
  continuity anchor. Hash the response through the edge only after normalising
  Cloudflare's per-request email-obfuscation token, or the hash will differ on
  every request even when nothing has changed; the direct Azure-endpoint
  checksum is the stronger, stable proof and should be the primary check.
- Both legacy paths present the Access login and serve after authentication.
- The apex still returns 301 to `www`.
- `app.lumensync.io` is unchanged.

**R4. Leave the rest in place.** The Vercel domain attachment and the issued
certificate are harmless once the origin points back at Azure, and removing them
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

Nothing below happens until the acceptance checklist has passed and the owner
authorizes it. Until then the legacy infrastructure stays exactly where it is —
it is the rollback path.

- **Retire the legacy surfaces for real**, in this order, each as its own
  authorized step: confirm the cutover is settled; remove the Access application
  and its policy; remove the response-header transform rule that carried
  `noindex` for those paths; only then decommission the Azure static site, after
  taking a final archived copy. Reversing this order removes the protection
  before the content.
- With the legacy paths gone, the `www` record can be simplified to a DNS-only
  record like `app` already uses, if Cloudflare's edge is no longer wanted in
  front of the marketing site.
- Remove the Vercel deployment-protection bypass secret if automated preview
  testing no longer needs it.
- Revoke the Cloudflare API token issued for the cutover.
- Replace the in-memory rate limiter with a durable one if submission volume
  ever justifies it.
- Revisit whether any measurement is needed, with the privacy consequences
  stated at the time.
