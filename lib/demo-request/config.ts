/**
 * Delivery configuration for the demo-request form.
 *
 * Fail-closed by design. The form is live only when a complete, valid delivery
 * target is configured for the deployment; anything missing or malformed leaves
 * the form visibly inactive rather than accepting a submission it cannot
 * deliver. Nothing here is ever imported by a client component — the values are
 * read on the server only, and only booleans cross to the browser.
 *
 * Required environment variables (set per Vercel environment, never committed):
 *   DEMO_REQUEST_WEBHOOK_URL    https URL that receives the JSON payload
 *   DEMO_REQUEST_FORM_SECRET    >= 32 chars, signs the anti-automation token
 * Optional:
 *   DEMO_REQUEST_WEBHOOK_TOKEN  sent as `Authorization: Bearer <token>`
 */

export interface DeliveryConfig {
  webhookUrl: string;
  webhookToken?: string;
  formSecret: string;
}

export type DemoRequestConfig =
  | { enabled: true; delivery: DeliveryConfig }
  | { enabled: false; reason: DisabledReason };

export type DisabledReason =
  | "no-webhook-url"
  | "webhook-url-not-https"
  | "no-form-secret"
  | "form-secret-too-short";

export const MIN_FORM_SECRET_LENGTH = 32;

type Env = Record<string, string | undefined>;

export function readDemoRequestConfig(
  env: Env = process.env as Env,
): DemoRequestConfig {
  const webhookUrl = (env.DEMO_REQUEST_WEBHOOK_URL ?? "").trim();
  const formSecret = (env.DEMO_REQUEST_FORM_SECRET ?? "").trim();
  const webhookToken = (env.DEMO_REQUEST_WEBHOOK_TOKEN ?? "").trim();

  if (!webhookUrl) return { enabled: false, reason: "no-webhook-url" };

  let parsed: URL;
  try {
    parsed = new URL(webhookUrl);
  } catch {
    return { enabled: false, reason: "webhook-url-not-https" };
  }
  if (parsed.protocol !== "https:") {
    return { enabled: false, reason: "webhook-url-not-https" };
  }

  if (!formSecret) return { enabled: false, reason: "no-form-secret" };
  if (formSecret.length < MIN_FORM_SECRET_LENGTH) {
    return { enabled: false, reason: "form-secret-too-short" };
  }

  return {
    enabled: true,
    delivery: {
      webhookUrl,
      formSecret,
      ...(webhookToken ? { webhookToken } : {}),
    },
  };
}

/** Safe to send to the browser: a boolean, never a reason or a value. */
export function isDemoRequestEnabled(env?: Env): boolean {
  return readDemoRequestConfig(env).enabled;
}
