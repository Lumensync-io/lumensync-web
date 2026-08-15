import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { findForbiddenContent } from "../tests/forbidden-terms";

test.describe("foundation smoke", () => {
  test("homepage renders the approved headline", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Complex Lighting Installs, Finally Tied to the Drawings\./,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Request a Demo" }).first(),
    ).toBeVisible();
  });

  test("homepage sections, CTAs and real-product captures render", async ({
    page,
  }) => {
    await page.goto("/");
    // Section order (LSWEB-004 homepage plan).
    const order = [
      "hero",
      "problem",
      "how-it-works",
      "drawings",
      "checks",
      "rfis",
      "field",
      "fixtures",
      "closeout",
      "cta",
    ];
    const tops: number[] = [];
    for (const id of order) {
      const el = page.locator(`#${id}`);
      await expect(el).toHaveCount(1);
      tops.push((await el.boundingBox())!.y);
    }
    for (let i = 1; i < tops.length; i++) expect(tops[i]).toBeGreaterThan(tops[i - 1]);
    // Hero CTA targets.
    const hero = page.locator("#hero");
    await expect(hero.getByRole("link", { name: "Request a Demo" })).toHaveAttribute(
      "href",
      "/request-demo",
    );
    await expect(hero.getByRole("link", { name: "See how it works" })).toHaveAttribute(
      "href",
      "#how-it-works",
    );
    // Scroll the whole page so lazy images load, then require every visible
    // product capture to have decoded (no broken images).
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForFunction(() =>
      [...document.images]
        .filter((i) => i.offsetParent !== null)
        .every((i) => i.complete && i.naturalWidth > 0),
    );
    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((i) => i.offsetParent !== null && i.naturalWidth === 0)
        .map((i) => i.currentSrc),
    );
    expect(broken).toEqual([]);
    // Every capture is captioned with demo-tenant provenance.
    const captions = page.locator("figcaption");
    expect(await captions.count()).toBeGreaterThanOrEqual(6);
    // No forbidden brand / customer text anywhere on the page.
    const text = await page.evaluate(() => document.body.innerText);
    expect(findForbiddenContent(text)).toEqual([]);
  });

  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("product overview and a feature page respond", async ({ page }) => {
    await page.goto("/product");
    await expect(
      page.getByRole("heading", { level: 1, name: /connected lighting/i }),
    ).toBeVisible();
    await page.goto("/product/checks");
    await expect(
      page.getByRole("heading", { level: 1, name: /Automated Checks/i }),
    ).toBeVisible();
  });

  test("request-demo page renders labelled form fields", async ({ page }) => {
    await page.goto("/request-demo");
    await expect(page.getByLabel("Work email")).toBeVisible();
    await expect(page.getByLabel("Company")).toBeVisible();
  });

  test("navigation works for the current viewport", async ({ page }, testInfo) => {
    await page.goto("/");
    const isMobile = testInfo.project.name === "mobile-375";
    if (isMobile) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation", { name: "Mobile primary" })
        .getByRole("link", { name: "Why LumenSync" })
        .click();
    } else {
      await page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Why LumenSync" })
        .click();
    }
    await expect(
      page.getByRole("heading", { level: 1, name: /Why LumenSync/i }),
    ).toBeVisible();
  });

  test("mobile menu panel is opaque and covers the viewport", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const nav = page.getByRole("navigation", { name: "Mobile primary" });
    const panel = nav.locator("xpath=..");
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    // Panel starts right below the 64px header and fills the rest of the screen.
    expect(Math.round(box!.y)).toBe(64);
    expect(box!.height).toBeGreaterThan(500);
    // The hero heading behind the panel must not be the topmost element.
    const overview = nav.getByRole("link", { name: "Overview" });
    const linkBox = (await overview.boundingBox())!;
    const topmostIsLink = await page.evaluate(
      ([x, y]) => {
        const el = document.elementFromPoint(x, y);
        return !!el?.closest('a[href="/product"]');
      },
      [linkBox.x + linkBox.width / 2, linkBox.y + linkBox.height / 2],
    );
    expect(topmostIsLink).toBe(true);
    // And the hero headline underneath must be fully covered by the panel.
    const heroBox = (await page
      .getByRole("heading", { level: 1 })
      .first()
      .boundingBox())!;
    const panelId = (await panel.getAttribute("id"))!;
    const heroCovered = await page.evaluate(
      ([x, y, id]) =>
        !!document
          .elementFromPoint(Number(x), Number(y))
          ?.closest(`[id="${id}"]`),
      [heroBox.x + heroBox.width / 2, heroBox.y + heroBox.height / 2, panelId],
    );
    expect(heroCovered).toBe(true);
  });

  test("desktop product menu opens with keyboard and mouse", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-375", "desktop only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await page.getByRole("button", { name: "Product" }).click();
    await expect(nav.getByRole("link", { name: "Field Hub" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Field Hub" })).toBeHidden();
  });

  test("sign-in link points at app.lumensync.io", async ({ page }, testInfo) => {
    await page.goto("/");
    if (testInfo.project.name === "mobile-375") {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    const signIn = page.getByRole("link", { name: "Sign In" }).first();
    await expect(signIn).toHaveAttribute("href", "https://app.lumensync.io");
  });

  test("footer landmark links navigate", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await footer.getByRole("link", { name: "Privacy Policy" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: /Privacy Policy/i }),
    ).toBeVisible();
  });

  test("metadata is present and never canonicalises to a Vercel host", async ({
    page,
  }) => {
    await page.goto("/product/checks");
    await expect(page).toHaveTitle(/Automated Checks .* LumenSync/);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBe("https://lumensync.io/product/checks");
    expect(canonical).not.toMatch(/vercel\.app/);
  });

  test("homepage metadata: canonical is lumensync.io and OG/Twitter cards are set", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      "LumenSync — Complex Lighting Installs, Finally Tied to the Drawings.",
    );
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toBe("https://lumensync.io");
    for (const selector of [
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:card"]',
    ]) {
      const content = await page.locator(selector).first().getAttribute("content");
      expect(content, selector).toBeTruthy();
      expect(content, selector).not.toMatch(/vercel\.app/);
    }
    // Next.js deliberately resolves file-based OG/Twitter *images* against the
    // Vercel deployment/branch URL on preview deployments (so link previews of
    // a preview render); on production they resolve against metadataBase
    // (lumensync.io). Accept lumensync.io, or a *.vercel.app host only when the
    // page itself is being served from *.vercel.app — never any other host.
    const onVercelPreview = /\.vercel\.app$/.test(new URL(page.url()).host);
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      const content = await page.locator(selector).first().getAttribute("content");
      expect(content, selector).toBeTruthy();
      const host = new URL(content!, page.url()).host;
      expect(
        host === "lumensync.io" ||
          (onVercelPreview && /\.vercel\.app$/.test(host)),
        `${selector} host ${host}`,
      ).toBe(true);
    }
    const ogImage = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");
    // The OG image must actually be served by this deployment.
    const imgUrl = new URL(ogImage!, page.url());
    const res = await page.request.get(imgUrl.pathname + imgUrl.search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/image\/png/);
    const icon = await page.request.get("/icon.svg");
    expect(icon.status()).toBe(200);
  });

  test("robots.txt is restrictive off-production and sitemap only lists lumensync.io", async ({
    page,
  }) => {
    // Locally and on every Vercel preview / *.vercel.app surface, robots must
    // deny all crawling. Only VERCEL_ENV=production on lumensync.io may allow.
    const robots = await page.request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const body = await robots.text();
    const isRealProduction = /^https:\/\/(www\.)?lumensync\.io/.test(page.url());
    if (!isRealProduction) {
      expect(body).toMatch(/Disallow:\s*\/\s*$/m);
      expect(body).not.toMatch(/Allow:\s*\/\s*$/m);
    }
    const sitemap = await page.request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("<loc>https://lumensync.io</loc>");
    expect(xml).not.toMatch(/vercel\.app/);
  });

  test("768px tablet layout has no horizontal overflow and keeps hero + CTA usable", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "run once");
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /Tied to the Drawings/ }),
    ).toBeVisible();
    const cta = page.locator("#hero").getByRole("link", { name: "Request a Demo" });
    await expect(cta).toBeVisible();
    const box = (await cta.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
    });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("375px: hero, CTAs and product captures are usable and tap targets are ≥44px", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-375", "mobile only");
    await page.goto("/");
    const hero = page.locator("#hero");
    for (const name of ["Request a Demo", "See how it works"]) {
      const link = hero.getByRole("link", { name });
      await expect(link).toBeVisible();
      const box = (await link.boundingBox())!;
      expect(box.height, name).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(375);
    }
    const heroImg = hero.locator("img").first();
    await expect(heroImg).toBeVisible();
    const imgBox = (await heroImg.boundingBox())!;
    expect(imgBox.width).toBeGreaterThan(280);
    expect(imgBox.x + imgBox.width).toBeLessThanOrEqual(375);
  });

  test("unknown routes render the not-found page with site chrome", async ({
    page,
  }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("homepage has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(blocking).toEqual([]);
  });

  test("product overview has no serious or critical axe violations", async ({
    page,
  }) => {
    await page.goto("/product");
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(blocking).toEqual([]);
  });
});
