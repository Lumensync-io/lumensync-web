import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
