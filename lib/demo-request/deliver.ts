import { randomBytes } from "node:crypto";
import type { DeliveryConfig } from "./config";
import type { DemoRequestValues } from "./schema";

/**
 * Delivery of a validated demo request to the destination configured for this
 * deployment.
 *
 * The website stores nothing. It holds the submission only for the length of
 * the request, forwards it once, and reports the true outcome to the person who
 * submitted it. If the destination does not accept the request, the submitter
 * is told it was not received — a request is never reported as sent when it was
 * not.
 */

export const PAYLOAD_TYPE = "lumensync.demo-request";
export const PAYLOAD_VERSION = 1;
const DELIVERY_TIMEOUT_MS = 8_000;

export interface DeliveryMeta {
  reference: string;
  receivedAt: string;
  sourceHost: string;
}

export type DeliveryResult =
  | { ok: true; status: number }
  | { ok: false; failure: "http-error" | "timeout" | "network"; status?: number };

/** Human-quotable, unguessable enough to be useful, carries no personal data. */
export function createReference(): string {
  return `DR-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function buildPayload(values: DemoRequestValues, meta: DeliveryMeta) {
  return {
    type: PAYLOAD_TYPE,
    version: PAYLOAD_VERSION,
    reference: meta.reference,
    receivedAt: meta.receivedAt,
    source: { site: meta.sourceHost, form: "/request-demo" },
    request: {
      name: values.name,
      email: values.email,
      company: values.company,
      role: values.role || null,
      message: values.message || null,
    },
  };
}

export async function deliverDemoRequest(
  values: DemoRequestValues,
  meta: DeliveryMeta,
  config: DeliveryConfig,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "user-agent": "lumensync-web/demo-request",
  };
  if (config.webhookToken) {
    headers.authorization = `Bearer ${config.webhookToken}`;
  }

  let response: Response;
  try {
    response = await fetchImpl(config.webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(buildPayload(values, meta)),
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return { ok: false, failure: timedOut ? "timeout" : "network" };
  }

  if (!response.ok) {
    return { ok: false, failure: "http-error", status: response.status };
  }
  return { ok: true, status: response.status };
}
