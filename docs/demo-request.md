# Demo request: how it works and how to switch it on

The form at `/request-demo` is complete and tested. It is **off** until a
deployment is given a delivery destination, and it says so plainly rather than
accepting a message it cannot deliver.

## Switching it on

Three environment variables on the Vercel project, production environment. None
of them belong in this repository, and none of them reach the browser.

| Variable | Required | Purpose |
|---|---|---|
| `DEMO_REQUEST_WEBHOOK_URL` | yes | `https://` endpoint that receives the JSON payload |
| `DEMO_REQUEST_FORM_SECRET` | yes | at least 32 characters; signs the anti-automation token |
| `DEMO_REQUEST_WEBHOOK_TOKEN` | no | sent as `Authorization: Bearer <token>` |

Set them, redeploy, then check `GET /api/demo-request` reports
`{"enabled": true}` and submit one real request end to end. A destination that
has never received a real submission is not a verified destination.

To switch it off again: remove the variables and redeploy. The page returns to
the inactive state and the endpoint returns 503.

## The chosen destination

The owner's decision: a **LumenSync-controlled Azure webhook or function** that
forwards each submission to a **dedicated LumenSync demo-request mailbox**. No
third-party form vendor. The website needs no code change for this — it posts
JSON to one URL with an optional bearer token, which is exactly what a function
endpoint provides.

What still has to exist before the form can be switched on:

1. **The mailbox.** A dedicated LumenSync address, monitored by a person. As of
   this writing no such mailbox exists, so nothing can be switched on yet.
2. **The function.** A narrowly scoped endpoint that accepts the payload below,
   checks the bearer token, and sends the contents to that mailbox. It needs no
   database, no customer data and no application credentials — it should be able
   to do nothing except deliver one message.
3. **Its send permission.** Sending mail from a function requires a deliberate
   grant, and a tenant-wide mail-sending permission is a security decision for
   whoever administers the tenant — not something to enable in passing. Prefer
   the narrowest option available: a single mailbox-scoped grant over a
   directory-wide one.
4. **A named backup monitor.** One person is a single point of failure for
   every inbound lead. This is a launch requirement, not a nicety.

Whatever is chosen inherits the answers the privacy page still owes — how long a
request is kept, who can read it, and how someone asks for it to be deleted — so
decide those at the same time.

## Payload

```json
{
  "type": "lumensync.demo-request",
  "version": 1,
  "reference": "DR-1A2B3C4D",
  "receivedAt": "2026-08-15T23:00:00.000Z",
  "source": { "site": "www.lumensync.io", "form": "/request-demo" },
  "request": {
    "name": "…",
    "email": "…",
    "company": "…",
    "role": null,
    "message": null
  }
}
```

`role` and `message` are `null` when not supplied. Nothing else is sent.

## What the endpoint does

`POST /api/demo-request`, in order, stopping at the first failure:

| Check | Response when it fails |
|---|---|
| Delivery configured | `503` — the honest "not switched on" message |
| Same-origin `Origin` header | `403` |
| `content-type: application/json` | `415` |
| Body within 16 KB | `413` |
| Parses as a JSON object | `400` |
| Decoy field empty | `400`, with an explanation a person can act on |
| Signed timestamp token valid, and neither too fast nor stale | `400` |
| Per-client and per-instance rate limits | `429` with `Retry-After` |
| Field validation | `400` with per-field messages |
| Destination accepts the delivery | `502` — explicitly "treat this as not received" |
| — | `200` with a reference |

`GET /api/demo-request` returns whether the form is live and, if it is, a fresh
signed token. Both methods send `Cache-Control: no-store`.

## Deliberate limits

- **Rate limiting is per warm instance**, because it is held in memory. It stops
  one client hammering one instance; it is not a defence against a distributed
  flood. A durable store would be needed for that, and is a considered follow-up
  rather than an unstated gap.
- **The token is a speed bump, not authentication.** It defeats naive scripted
  posting without a CAPTCHA, a third-party bot service or a cookie. A determined
  attacker can fetch a token and wait three seconds.
- **No confirmation email is sent**, because the site has no email sender. The
  submitter gets an on-screen reference instead.
- **Nothing is stored on the website.** If the destination loses a submission,
  the website cannot replay it — the reference in the log is the only trace, and
  it holds no personal data.

## Privacy properties

- No cookie is set, by this form or anywhere else on the site.
- One log line per submission: time, outcome, reference, and a truncated one-way
  digest of the email address. Not the address, the name, the company or the
  message.
- The rate limiter keys on a hash of the connection address; the raw address is
  never stored.
- The privacy page describes all of this in the same terms, and the behaviour is
  covered by tests.
