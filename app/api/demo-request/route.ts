import { readDemoRequestConfig } from "@/lib/demo-request/config";
import {
  createReference,
  deliverDemoRequest,
} from "@/lib/demo-request/deliver";
import { digestEmail, logDemoRequest, type Outcome } from "@/lib/demo-request/log";
import {
  clientKeyFromHeaders,
  globalLimiter,
  perClientLimiter,
} from "@/lib/demo-request/rate-limit";
import {
  HONEYPOT_FIELD,
  MAX_BODY_BYTES,
  normalize,
  validateDemoRequest,
} from "@/lib/demo-request/schema";
import { issueFormToken, verifyFormToken } from "@/lib/demo-request/token";
import { DEMO_FORM_UNAVAILABLE } from "@/lib/content/conversion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "cache-control": "no-store" } as const;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

function fail(
  outcome: Outcome,
  status: number,
  message: string,
  extra: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) {
  logDemoRequest({ event: "demo-request", outcome });
  return json({ ok: false, code: outcome, message, ...extra }, status, headers);
}

/**
 * Returns whether the form is live for this deployment, plus a short-lived
 * signed token when it is. No personal data, nothing cached.
 */
export async function GET() {
  const config = readDemoRequestConfig();
  if (!config.enabled) return json({ enabled: false }, 200);
  return json(
    { enabled: true, token: issueFormToken(config.delivery.formSecret) },
    200,
  );
}

export async function POST(request: Request) {
  const config = readDemoRequestConfig();
  if (!config.enabled) {
    return fail("not-configured", 503, DEMO_FORM_UNAVAILABLE);
  }

  // Same-origin only. A browser always sends Origin on a cross-site POST, so a
  // mismatch is either a forged submission or a script, and neither needs to
  // reach the destination.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return fail("bad-origin", 403, "This submission did not come from the LumenSync site.");
  }

  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return fail("unsupported-media-type", 415, "Send the form as JSON.");
  }

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return fail("too-large", 413, "That message is longer than this form accepts.");
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return fail("too-large", 413, "That message is longer than this form accepts.");
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("malformed", 400, "The submission could not be read.");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail("malformed", 400, "The submission could not be read.");
  }
  const fields = body as Record<string, unknown>;

  if (normalize(fields[HONEYPOT_FIELD]).length > 0) {
    return fail(
      "honeypot",
      400,
      "That submission looked automated, so it was not sent. If you are a person, reload the page and try again.",
    );
  }

  const verdict = verifyFormToken(fields.formToken, config.delivery.formSecret);
  if (verdict !== "valid") {
    const message =
      verdict === "too-fast"
        ? "That was submitted faster than a person can fill a form, so it was not sent."
        : "This form has been open too long, or the page was not loaded from the LumenSync site. Reload the page and try again.";
    logDemoRequest({ event: "demo-request", outcome: "token-rejected", detail: verdict });
    return json({ ok: false, code: "token-rejected", message }, 400, {});
  }

  const clientKey = clientKeyFromHeaders(request.headers);
  const perClient = perClientLimiter(clientKey);
  const global = globalLimiter("all");
  if (!perClient.allowed || !global.allowed) {
    const retryAfter = Math.max(perClient.retryAfterSeconds, global.retryAfterSeconds);
    return fail(
      "rate-limited",
      429,
      "Too many requests from here in a short time. Wait a few minutes and try again.",
      {},
      { "retry-after": String(retryAfter) },
    );
  }

  const validation = validateDemoRequest(body);
  if (!validation.ok) {
    logDemoRequest({ event: "demo-request", outcome: "invalid" });
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Some details need fixing before this can be sent.",
        errors: validation.errors,
      },
      400,
    );
  }

  const reference = createReference();
  const submitterDigest = digestEmail(validation.values.email);
  const result = await deliverDemoRequest(
    validation.values,
    { reference, receivedAt: new Date().toISOString(), sourceHost: host },
    config.delivery,
  );

  if (!result.ok) {
    logDemoRequest({
      event: "demo-request",
      outcome: "delivery-failed",
      reference,
      detail: result.failure,
      submitterDigest,
    });
    return json(
      {
        ok: false,
        code: "delivery-failed",
        reference,
        message:
          "We could not deliver your request just now, so please treat it as not received. Try again in a few minutes — if you are already in a thread with us, replying there is the surest route.",
      },
      502,
    );
  }

  logDemoRequest({
    event: "demo-request",
    outcome: "delivered",
    reference,
    submitterDigest,
  });
  return json({ ok: true, reference }, 200);
}
