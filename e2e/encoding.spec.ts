import { expect, test } from "@playwright/test";
import {
  CORRECT_EM_DASH,
  LSWEB023_CORRUPT_ARROW,
  LSWEB023_CORRUPT_BOX_DRAWING,
  LSWEB023_CORRUPT_EM_DASH,
  countReplacementChars,
  describeFinding,
  findMojibake,
} from "../tests/mojibake";

/**
 * Rendered-output encoding guard (LSWEB-025).
 *
 * The source-level guard in tests/encoding.test.ts protects the content
 * modules. This one protects what a visitor actually receives, which is the
 * thing that was broken: LSWEB-023's corruption produced 130 visible instances
 * of garbled text across 14 of 16 public routes while every suite stayed green.
 *
 * It runs against whatever `E2E_BASE_URL` points at, so it covers production
 * in the deployed run, not just a local build.
 */

const ROUTES = [
  "/",
  "/product",
  "/product/drawings",
  "/product/checks",
  "/product/fixtures",
  "/product/controls",
  "/product/field",
  "/product/rfis",
  "/product/closeout",
  "/why-lumensync",
  "/security",
  "/about",
  "/request-demo",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
] as const;

test.describe("encoding", () => {
  test("no public route serves double-encoded text", async ({ request }) => {
    test.slow();
    const broken: string[] = [];

    for (const route of ROUTES) {
      const response = await request.get(route);
      expect(response.status(), `${route} should respond 200`).toBe(200);

      const contentType = response.headers()["content-type"] ?? "";
      expect(
        contentType.toLowerCase(),
        `${route} must declare UTF-8`,
      ).toContain("utf-8");

      const html = await response.text();

      for (const finding of findMojibake(html)) {
        broken.push(`${route} -> ${describeFinding(finding)}`);
      }
      if (countReplacementChars(html) > 0) {
        broken.push(
          `${route} -> ${countReplacementChars(html)} U+FFFD replacement characters`,
        );
      }
      // The specific sequences LSWEB-023 shipped, asserted by name so a
      // failure here is unambiguous about which regression came back.
      for (const [label, sequence] of [
        ["em dash", LSWEB023_CORRUPT_EM_DASH],
        ["arrow", LSWEB023_CORRUPT_ARROW],
        ["box drawing", LSWEB023_CORRUPT_BOX_DRAWING],
      ] as const) {
        if (html.includes(sequence)) {
          broken.push(`${route} -> LSWEB-023 corrupted ${label} is back`);
        }
      }
    }

    expect(broken, "routes serving corrupted text").toEqual([]);
  });

  test("visible copy renders real punctuation, not garbage", async ({
    page,
  }) => {
    // /product/fixtures read "the paperwork <garbage> one record" in production.
    await page.goto("/product/fixtures");
    const visible = await page.locator("body").innerText();

    expect(findMojibake(visible).map(describeFinding)).toEqual([]);
    expect(visible).not.toContain(LSWEB023_CORRUPT_EM_DASH);
    // The page genuinely uses em dashes, so this also proves the repair kept
    // the punctuation rather than deleting it.
    expect(visible).toContain(CORRECT_EM_DASH);
  });
});
