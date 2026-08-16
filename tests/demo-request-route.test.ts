import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/demo-request/route";
import { issueFormToken } from "@/lib/demo-request/token";
import { MIN_FILL_MS } from "@/lib/demo-request/schema";

/**
 * End-to-end proof of the submission path through the real route handler.
 *
 * Everything the site controls is exercised here against an isolated
 * verification destination: configuration gating, origin and content checks,
 * anti-automation, rate limiting, validation, the single outbound delivery, and
 * — the property that matters most — that a success is returned only after the
 * destination has accepted the request.
 *
 * The one thing these tests cannot prove is that a real mailbox received the
 * mail; that needs the live endpoint and is tracked as a launch dependency.
 */

const SECRET = "x".repeat(48);
const ENDPOINT = "https://verification.example.com/demo-request";
const HOST = "www.lumensync.io";
const ORIGIN = `https://${HOST}`;

let clientCounter = 0;

/** A distinct client per test, so the shared limiter cannot cross-contaminate. */
function nextClient(): string {
  clientCounter += 1;
  return `198.51.100.${clientCounter}`;
}

function configure(extra: Record<string, string> = {}) {
  vi.stubEnv("DEMO_REQUEST_WEBHOOK_URL", ENDPOINT);
  vi.stubEnv("DEMO_REQUEST_FORM_SECRET", SECRET);
  for (const [key, value] of Object.entries(extra)) vi.stubEnv(key, value);
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "Dana Reyes",
    email: "dana@example.com",
    company: "Example Electric",
    role: "Project Manager",
    message: "Two-level retail package.",
    formToken: issueFormToken(SECRET, Date.now() - MIN_FILL_MS - 1_000),
    ...overrides,
  };
}

function request(
  body: unknown,
  {
    client = nextClient(),
    origin = ORIGIN,
    contentType = "application/json",
  }: { client?: string; origin?: string | null; contentType?: string | null } = {},
) {
  const headers = new Headers({ host: HOST, "x-forwarded-for": client });
  if (origin) headers.set("origin", origin);
  if (contentType) headers.set("content-type", contentType);
  return new Request("https://www.lumensync.io/api/demo-request", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

let deliveries: { url: string; init: RequestInit }[] = [];

function stubDestination(status: number) {
  deliveries = [];
  vi.stubGlobal("fetch", (url: string, init: RequestInit) => {
    deliveries.push({ url, init });
    return Promise.resolve(new Response(null, { status }));
  });
}

beforeEach(() => {
  deliveries = [];
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("demo request route: not configured", () => {
  it("reports the form as off and refuses to accept anything", async () => {
    vi.stubEnv("DEMO_REQUEST_WEBHOOK_URL", "");
    vi.stubEnv("DEMO_REQUEST_FORM_SECRET", "");

    const status = await GET();
    expect(status.status).toBe(200);
    expect(await status.json()).toEqual({ enabled: false });

    const response = await POST(request(validBody()));
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("not-configured");
    expect(body.message).toMatch(/aren't switched on yet/i);
  });
});

describe("demo request route: configured", () => {
  it("issues a signed token and never caches it", async () => {
    configure();
    const response = await GET();
    const body = await response.json();
    expect(body.enabled).toBe(true);
    expect(body.token).toMatch(/^\d+\.[A-Za-z0-9_-]+$/);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(JSON.stringify(body)).not.toContain(SECRET);
  });

  it("delivers exactly once and returns a reference", async () => {
    configure({ DEMO_REQUEST_WEBHOOK_TOKEN: "bearer-value" });
    stubDestination(202);

    const response = await POST(request(validBody()));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true, reference: expect.stringMatching(/^DR-[0-9A-F]{8}$/) });

    expect(deliveries).toHaveLength(1);
    const [delivery] = deliveries;
    expect(delivery.url).toBe(ENDPOINT);
    expect(delivery.init.method).toBe("POST");
    const headers = delivery.init.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer bearer-value");
    const sent = JSON.parse(String(delivery.init.body));
    expect(sent.request).toEqual({
      name: "Dana Reyes",
      email: "dana@example.com",
      company: "Example Electric",
      role: "Project Manager",
      message: "Two-level retail package.",
    });
    expect(sent.reference).toBe(body.reference);
    expect(JSON.stringify(sent)).not.toContain(SECRET);
  });

  it("reports failure, not success, when the destination rejects it", async () => {
    configure();
    stubDestination(500);

    const response = await POST(request(validBody()));
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("delivery-failed");
    expect(body.message).toMatch(/not received/i);
    expect(deliveries).toHaveLength(1);
  });

  it("reports failure when the destination cannot be reached", async () => {
    configure();
    vi.stubGlobal("fetch", () => Promise.reject(new TypeError("unreachable")));

    const response = await POST(request(validBody()));
    expect(response.status).toBe(502);
    expect((await response.json()).code).toBe("delivery-failed");
  });

  it("refuses a cross-origin or origin-less post without delivering", async () => {
    configure();
    stubDestination(200);

    const foreign = await POST(request(validBody(), { origin: "https://evil.example" }));
    expect(foreign.status).toBe(403);
    const none = await POST(request(validBody(), { origin: null }));
    expect(none.status).toBe(403);
    expect(deliveries).toHaveLength(0);
  });

  it("refuses the wrong content type, an oversized body and malformed JSON", async () => {
    configure();
    stubDestination(200);

    expect(
      (await POST(request(validBody(), { contentType: "text/plain" }))).status,
    ).toBe(415);
    expect(
      (await POST(request({ ...validBody(), message: "x".repeat(20_000) }))).status,
    ).toBe(413);
    expect((await POST(request("{not json"))).status).toBe(400);
    expect(deliveries).toHaveLength(0);
  });

  it("refuses a filled decoy field and explains it to a person", async () => {
    configure();
    stubDestination(200);

    const response = await POST(request(validBody({ website: "http://spam.example" })));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("honeypot");
    expect(body.message).toMatch(/reload the page/i);
    expect(deliveries).toHaveLength(0);
  });

  it("refuses a missing, forged, stale or too-fast token", async () => {
    configure();
    stubDestination(200);

    const cases: [string, unknown][] = [
      ["missing", undefined],
      ["forged", `${Date.now()}.notasignature`],
      ["too fast", issueFormToken(SECRET, Date.now())],
      ["stale", issueFormToken(SECRET, Date.now() - 3 * 60 * 60 * 1000)],
    ];
    for (const [label, formToken] of cases) {
      const response = await POST(request(validBody({ formToken })));
      expect(response.status, label).toBe(400);
      expect((await response.json()).code, label).toBe("token-rejected");
    }
    expect(deliveries).toHaveLength(0);
  });

  it("returns field errors without delivering an invalid submission", async () => {
    configure();
    stubDestination(200);

    const response = await POST(request(validBody({ email: "not-an-address", name: "" })));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.code).toBe("invalid");
    expect(body.errors.email).toBeTruthy();
    expect(body.errors.name).toBeTruthy();
    expect(deliveries).toHaveLength(0);
  });

  it("rate-limits a client after five attempts in the window", async () => {
    configure();
    stubDestination(200);
    const client = nextClient();

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const response = await POST(request(validBody(), { client }));
      expect(response.status, `attempt ${attempt}`).toBe(200);
    }
    const blocked = await POST(request(validBody(), { client }));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
    expect(deliveries).toHaveLength(5);
  });

  it("logs the outcome without the submitter's personal data", async () => {
    configure();
    stubDestination(200);
    const logged: string[] = [];
    vi.spyOn(console, "log").mockImplementation((line: unknown) => {
      logged.push(String(line));
    });

    await POST(request(validBody()));

    expect(logged).toHaveLength(1);
    const record = JSON.parse(logged[0]);
    expect(record.event).toBe("demo-request");
    expect(record.outcome).toBe("delivered");
    expect(record.submitterDigest).toMatch(/^[0-9a-f]{12}$/);
    const raw = logged[0];
    for (const secretish of [
      "Dana Reyes",
      "dana@example.com",
      "Example Electric",
      "Two-level retail package.",
      "198.51.100",
      SECRET,
    ]) {
      expect(raw, secretish).not.toContain(secretish);
    }
  });
});
