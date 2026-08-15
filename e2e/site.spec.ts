import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { findForbiddenContent } from "../tests/forbidden-terms";

/**
 * Whole-site coverage for the core public experience (LSWEB-005). The
 * homepage-specific assertions live in smoke.spec.ts; this file proves every
 * substantive route is healthy, coherent and safe at the running viewport.
 */

const PRODUCT_ROUTES = [
  "/product",
  "/product/drawings",
  "/product/checks",
  "/product/fixtures",
  "/product/controls",
  "/product/rfis",
  "/product/field",
  "/product/closeout",
] as const;

const ROUTES = [
  "/",
  ...PRODUCT_ROUTES,
  "/why-lumensync",
  "/security",
  "/about",
  "/request-demo",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
] as const;

/** Pages that carry the bulk of the new content, used for axe coverage. */
const AXE_ROUTES = [
  "/product",
  "/product/drawings",
  "/product/rfis",
  "/product/field",
  "/security",
  "/request-demo",
  "/contact",
] as const;

test.describe("core site", () => {
  test("every route is healthy, unique and free of overflow", async ({
    page,
  }) => {
    test.slow();
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const route of ROUTES) {
      const errors: string[] = [];
      const failures: string[] = [];
      const onConsole = (m: { type(): string; text(): string }) => {
        if (m.type() === "error") errors.push(m.text());
      };
      page.on("console", onConsole);
      page.on("requestfailed", (r) => failures.push(`REQFAIL ${r.url()}`));
      page.on("response", (r) => {
        if (r.status() >= 400) failures.push(`HTTP${r.status()} ${r.url()}`);
      });

      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), `${route} status`).toBe(200);

      // Exactly one h1, and it is not empty.
      const h1 = page.getByRole("heading", { level: 1 });
      await expect(h1, `${route} h1 count`).toHaveCount(1);
      expect((await h1.innerText()).trim().length, `${route} h1 text`).toBeGreaterThan(8);

      // Landmarks are present on every page.
      await expect(page.getByRole("banner"), `${route} header`).toHaveCount(1);
      await expect(page.getByRole("contentinfo"), `${route} footer`).toHaveCount(1);
      await expect(page.getByRole("main"), `${route} main`).toHaveCount(1);

      // Unique metadata, canonical always on the production host.
      const meta = await page.evaluate(() => ({
        title: document.title,
        description:
          document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
        canonical:
          document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      }));
      expect(meta.title, `${route} title`).toContain("LumenSync");
      expect(meta.description.length, `${route} description`).toBeGreaterThan(40);
      expect(meta.canonical, `${route} canonical`).toMatch(
        /^https:\/\/lumensync\.io/,
      );
      expect(titles.has(meta.title), `${route} duplicate title`).toBe(false);
      expect(
        descriptions.has(meta.description),
        `${route} duplicate description`,
      ).toBe(false);
      titles.add(meta.title);
      descriptions.add(meta.description);

      // Scroll the page so lazy media loads, then require no overflow and no
      // broken images.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      // An image that finished loading with no intrinsic width is broken.
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
      );
      expect(broken, `${route} broken images`).toEqual([]);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(0);

      // Public-content safety on the rendered page.
      const text = await page.evaluate(() => document.body.innerText);
      expect(findForbiddenContent(text), `${route} forbidden content`).toEqual([]);

      expect(errors, `${route} console errors`).toEqual([]);
      expect(failures, `${route} failed requests`).toEqual([]);
      page.removeAllListeners();
    }
  });

  test("navigation reaches every major route", async ({ page }, testInfo) => {
    await page.goto("/");
    const mobile = testInfo.project.name === "mobile-375";
    if (mobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      const nav = page.getByRole("navigation", { name: "Mobile primary" });
      for (const href of [
        "/product",
        ...PRODUCT_ROUTES.filter((r) => r !== "/product"),
        "/why-lumensync",
        "/security",
        "/about",
        "/contact",
        "/request-demo",
      ]) {
        await expect(nav.locator(`a[href="${href}"]`), `mobile nav ${href}`).toHaveCount(1);
      }
      // Navigating from the mobile menu works end to end.
      await nav.locator('a[href="/product/field"]').click();
      await expect(page).toHaveURL(/\/product\/field$/);
      await expect(
        page.getByRole("heading", { level: 1, name: /by type and by sheet/i }),
      ).toBeVisible();
    } else {
      const nav = page.getByRole("navigation", { name: "Primary" });
      await page.getByRole("button", { name: "Product" }).click();
      for (const href of PRODUCT_ROUTES) {
        await expect(nav.locator(`a[href="${href}"]`), `desktop nav ${href}`).toHaveCount(1);
      }
      await nav.locator('a[href="/product/checks"]').click();
      await expect(
        page.getByRole("heading", { level: 1, name: /Findings, not verdicts/i }),
      ).toBeVisible();
    }
    // The footer reaches company + legal + contact from anywhere.
    const footer = page.getByRole("contentinfo");
    for (const href of [
      "/why-lumensync",
      "/security",
      "/about",
      "/contact",
      "/request-demo",
      "/legal/privacy",
      "/legal/terms",
    ]) {
      await expect(footer.locator(`a[href="${href}"]`), `footer ${href}`).toHaveCount(1);
    }
  });

  test("product pages cross-link and every internal link resolves", async ({
    page,
  }) => {
    test.slow();
    const seen = new Set<string>();
    for (const route of ROUTES) {
      await page.goto(route);
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll("a[href^='/']")].map((a) =>
          a.getAttribute("href"),
        ),
      );
      for (const href of hrefs) if (href) seen.add(href.split("#")[0]);
    }
    seen.delete("");
    for (const href of seen) {
      const res = await page.request.get(href);
      expect(res.status(), `internal link ${href}`).toBe(200);
    }
  });

  test("conversion CTAs point at the demo request", async ({ page }) => {
    for (const route of ["/product", "/why-lumensync", "/security", "/about"]) {
      await page.goto(route);
      // The in-page CTA (the header one is hidden below the lg breakpoint).
      const cta = page.locator('main a[href="/request-demo"]').first();
      await expect(cta, `${route} demo CTA`).toBeVisible();
    }
    await page.goto("/request-demo");
    await expect(page.getByRole("button", { name: "Request a Demo" })).toBeDisabled();
    await expect(page.locator("#form-status")).toContainText(/aren't switched on yet/i);
  });

  test("sitemap and robots stay production-safe", async ({ page }) => {
    const sitemap = await page.request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const route of ROUTES) {
      const loc = route === "/" ? "https://lumensync.io" : `https://lumensync.io${route}`;
      expect(xml, `sitemap contains ${route}`).toContain(`<loc>${loc}</loc>`);
    }
    expect(xml).not.toMatch(/vercel\.app/);

    const robots = await page.request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const body = await robots.text();
    const isRealProduction = /^https:\/\/(www\.)?lumensync\.io/.test(page.url());
    if (!isRealProduction) expect(body).toMatch(/Disallow:\s*\/\s*$/m);
  });

  for (const route of AXE_ROUTES) {
    test(`${route} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      const blocking = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      );
      expect(
        blocking.map((v) => `${v.id}: ${v.nodes.length}`),
        `${route} axe`,
      ).toEqual([]);
    });
  }

  test("keyboard users can reach the primary CTA and see focus", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "desktop only");
    await page.goto("/product");
    // Tab until the header demo CTA is focused; it must be reachable early.
    let focusedHref: string | null = null;
    for (let i = 0; i < 12 && focusedHref !== "/request-demo"; i++) {
      await page.keyboard.press("Tab");
      focusedHref = await page.evaluate(
        () => document.activeElement?.getAttribute("href") ?? null,
      );
    }
    expect(focusedHref).toBe("/request-demo");
    const outline = await page.evaluate(() => {
      const el = document.activeElement!;
      const s = getComputedStyle(el);
      return { width: s.outlineWidth, style: s.outlineStyle };
    });
    expect(outline.style).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThan(0);
  });
});
