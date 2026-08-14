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
