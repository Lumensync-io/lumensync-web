import { defineConfig, devices } from "@playwright/test";

/**
 * Foundation smoke suite: desktop + 375px mobile, run against a production
 * build (`next build` must have completed before `npm run test:e2e`).
 *
 * - `E2E_PORT` (default 3000): local port for `next start`.
 * - `E2E_BASE_URL`: when set (e.g. a Vercel deployment URL) the suite runs
 *   against that URL and no local server is started.
 */
const port = Number(process.env.E2E_PORT ?? 3000);
const localBaseURL = `http://127.0.0.1:${port}`;
const externalBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: externalBaseURL ?? localBaseURL,
    trace: "on-first-retry",
    // Vercel preview deployments sit behind Vercel Authentication. When the
    // project's "Protection Bypass for Automation" secret is supplied via the
    // environment (never committed), send it so the suite can run against a
    // PR preview. See https://vercel.com/docs/deployment-protection.
    ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? {
          extraHTTPHeaders: {
            "x-vercel-protection-bypass":
              process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
          },
        }
      : {}),
    // Allow overriding the Chromium binary in sandboxed environments where
    // Playwright's exact browser revision is not downloadable.
    ...(process.env.PW_CHROMIUM_PATH
      ? { launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH } }
      : {}),
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: `npm run start -- -p ${port}`,
        url: localBaseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    {
      name: "mobile-375",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 740 },
        isMobile: false,
        hasTouch: true,
      },
    },
  ],
});
