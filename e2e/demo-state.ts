import { expect, type APIRequestContext, type Page } from "@playwright/test";

/**
 * The demo request form has two supported states, and both are correct:
 *
 *   unconfigured — no delivery destination is configured for the deployment, so
 *   the form is visibly inactive and the API refuses to accept anything.
 *
 *   configured — a destination is configured, so the form is live and a
 *   submission is really delivered.
 *
 * A suite that hard-codes either one is only ever right about half the
 * deployments it runs against. These helpers read the state from the deployment
 * itself, so the assertions describe the thing under test rather than the state
 * it happened to be in when they were written.
 *
 * Nothing here logs or asserts on a secret value: the state is a boolean and
 * the anti-automation token is only ever checked for shape.
 */

export type DemoState = "configured" | "unconfigured";

export interface DemoStatus {
  state: DemoState;
  /** A short-lived signed timestamp. Present only in the configured state. */
  hasToken: boolean;
}

const TOKEN_SHAPE = /^\d{10,16}\.[A-Za-z0-9_-]+$/;

export async function readDemoStatus(request: APIRequestContext): Promise<DemoStatus> {
  const response = await request.get("/api/demo-request");
  expect(response.status(), "demo status endpoint").toBe(200);
  expect(response.headers()["cache-control"], "demo status caching").toContain(
    "no-store",
  );

  const body: { enabled?: boolean; token?: string } = await response.json();
  expect(typeof body.enabled, "demo status shape").toBe("boolean");

  if (body.enabled) {
    expect(typeof body.token, "configured deployments issue a form token").toBe(
      "string",
    );
    expect(body.token, "form token shape").toMatch(TOKEN_SHAPE);
    return { state: "configured", hasToken: true };
  }

  expect(body.token, "an inactive form must not issue a token").toBeUndefined();
  return { state: "unconfigured", hasToken: false };
}

/** The notice shown when the deployment has no delivery destination. */
export const UNAVAILABLE_NOTICE = /aren't switched on yet/i;

/**
 * Asserts the rendered form matches the state the deployment reports.
 *
 * This is the check that would have caught a cache-reusing redeploy serving a
 * stale prerendered page: the API said the form was live while the HTML still
 * said it was switched off.
 */
export async function expectFormMatchesState(page: Page, state: DemoState) {
  const submit = page.getByRole("button", { name: "Request a Demo" });
  const notice = page.locator("#form-status");

  if (state === "configured") {
    await expect(
      submit,
      "the deployment reports the form as live, so the rendered submit button must be enabled — a disabled one means stale prerendered output, usually from a cache-reusing redeploy after an environment change",
    ).toBeEnabled();
    await expect(
      notice,
      "a live form must not still be showing the inactive notice",
    ).not.toContainText(UNAVAILABLE_NOTICE);
    return;
  }

  await expect(
    submit,
    "the deployment reports no delivery destination, so the form must be inactive",
  ).toBeDisabled();
  await expect(
    notice,
    "an inactive form must say so rather than implying a request can be submitted",
  ).toContainText(UNAVAILABLE_NOTICE);
}
