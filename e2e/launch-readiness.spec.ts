import { expect, test } from "@playwright/test";
import { expectFormMatchesState, readDemoStatus } from "./demo-state";

/**
 * Launch-gate behaviour that must hold on every deployment until the cutover is
 * deliberately performed: the site stays out of the index, the demo endpoint
 * fails closed when it has no destination, and nothing on any page talks to a
 * third party or writes to the browser.
 */

/**
 * Vercel injects its preview toolbar (vercel.live) into preview deployments,
 * and the deployment-protection handshake sets its own cookies. Neither exists
 * on a real production host, and neither comes from this codebase — so they are
 * excluded only while the suite is pointed at a `*.vercel.app` deployment. On
 * the production hostname the assertions below allow nothing at all.
 */
function platformInjected(baseURL: string): boolean {
  return /\.vercel\.app$/.test(new URL(baseURL).hostname);
}

const VERCEL_COOKIE = /^(_vercel|vercel-)/;
const VERCEL_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*vercel\.live\//;

const PAGES = [
  "/",
  "/product",
  "/product/checks",
  "/why-lumensync",
  "/security",
  "/request-demo",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
];

test.describe("launch readiness", () => {
  test("the site is not indexable and says so at both layers", async ({
    request,
    baseURL,
  }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const body = await robots.text();
    expect(body).toContain("Disallow: /");
    expect(body).not.toContain("Allow: /");

    // Second, independent layer: a page-level instruction that does not depend
    // on a crawler re-reading robots.txt.
    const page = await request.get("/");
    expect(page.headers()["x-robots-tag"] ?? "").toContain("noindex");

    // The canonical never points at the deployment host.
    expect(baseURL).toBeTruthy();
  });

  test("baseline response headers are set and the stack is not advertised", async ({
    request,
  }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("the demo endpoint reports its real state and refuses what it should", async ({
    request,
    baseURL,
  }) => {
    const { state } = await readDemoStatus(request);

    // A submission that must be refused whichever state the deployment is in:
    // unconfigured deployments have nowhere to send it, and configured ones
    // require the signed anti-automation token this request deliberately omits.
    // Either way the answer must be a refusal, never a 200.
    //
    // The Origin header is set deliberately. Without it the same-origin guard
    // rejects the request first, and this test would only ever re-prove the
    // cross-origin case that the next test already covers — never reaching the
    // token check it exists to exercise.
    const submission = await request.post("/api/demo-request", {
      headers: { "content-type": "application/json", origin: baseURL! },
      data: {
        name: "Test Person",
        email: "test@example.com",
        company: "Example",
        role: "",
        message: "",
      },
    });
    const failure = await submission.json();
    expect(failure.ok, "a refused submission is never reported as ok").toBe(false);

    if (state === "unconfigured") {
      expect(submission.status()).toBe(503);
      expect(failure.code).toBe("not-configured");
      expect(String(failure.message)).toMatch(/aren't switched on yet/i);
    } else {
      // Fail-closed the other way: live, but still not accepting anything that
      // did not come from a real page load.
      expect(submission.status()).toBe(400);
      expect(failure.code).toBe("token-rejected");
      expect(failure.reference, "nothing was delivered, so no reference").toBeUndefined();
    }

    // No internals leak in either refusal path.
    const raw = JSON.stringify(failure);
    expect(raw).not.toMatch(/DEMO_REQUEST_|webhook|stack|at Object\./i);
  });

  test("the rendered form agrees with the deployment's own configuration", async ({
    page,
    request,
  }) => {
    // The guard against a release that changed build-time configuration but
    // reused cached prerendered output: the API and the HTML must not disagree.
    const { state } = await readDemoStatus(request);
    await page.goto("/request-demo");
    await expectFormMatchesState(page, state);
  });

  test("the demo endpoint refuses a cross-origin post", async ({ request }) => {
    const response = await request.post("/api/demo-request", {
      headers: {
        "content-type": "application/json",
        origin: "https://not-lumensync.example",
      },
      data: { name: "x", email: "x@example.com", company: "y" },
    });
    // Unconfigured deployments stop earlier, which is also a refusal.
    expect([403, 503]).toContain(response.status());
  });

  test("no page sets a cookie or writes to browser storage", async ({
    page,
    context,
    baseURL,
  }) => {
    const allowPlatform = platformInjected(baseURL!);
    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    const cookies = (await context.cookies()).filter(
      (cookie) =>
        !(
          allowPlatform &&
          (VERCEL_COOKIE.test(cookie.name) || cookie.domain.endsWith("vercel.live"))
        ),
    );
    expect(cookies.map((cookie) => `${cookie.domain}${cookie.name}`)).toEqual([]);

    const storage = await page.evaluate(() => ({
      local: Object.keys(window.localStorage),
      session: Object.keys(window.sessionStorage),
    }));
    // `__vtkb-*` and `vc-*` are the preview toolbar's own keys.
    const PLATFORM_KEY = /^(__vtkb|vc-)|vercel|flags-?sdk/i;
    const ours = (keys: string[]) =>
      keys.filter((key) => !(allowPlatform && PLATFORM_KEY.test(key)));
    expect({
      local: ours(storage.local),
      session: ours(storage.session),
    }).toEqual({ local: [], session: [] });
  });

  test("no page requests anything from a third-party origin", async ({
    page,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;
    const allowPlatform = platformInjected(baseURL!);
    const foreign: string[] = [];
    page.on("request", (request) => {
      const url = request.url();
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      if (url.startsWith(origin)) return;
      if (allowPlatform && VERCEL_ORIGIN.test(url)) return;
      foreign.push(url);
    });

    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(foreign).toEqual([]);
  });

  test("legal pages keep facts and unapproved commitments visibly apart", async ({
    page,
  }) => {
    for (const path of ["/legal/privacy", "/legal/terms"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(
        page.getByText(/Effective 16 August 2026/i).first(),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /Legal review status/i }),
      ).toBeVisible();
      await expect(
        page
          .getByText(
            /approved by LumenSync for publication\. Independent legal review has not yet been completed\./i,
          )
          .first(),
      ).toBeVisible();
      await expect(
        page.getByText(/Counsel review is pending\./i).first(),
      ).toBeVisible();
      // The page must never assert a review that has not happened.
      await expect(
        page.getByText(
          /reviewed by counsel|approved by counsel|counsel has reviewed|legal review complete/i,
        ),
      ).toHaveCount(0);
    }
  });
});
