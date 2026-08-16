import { createHash } from "node:crypto";

/**
 * Operational logging for demo requests, with no personal data in it.
 *
 * What is recorded: when, what happened, and an opaque digest that lets two
 * submissions be recognised as coming from the same address without the address
 * itself being stored. What is never recorded: names, company names, message
 * bodies, email addresses or IP addresses.
 */

export type Outcome =
  | "delivered"
  | "not-configured"
  | "bad-origin"
  | "unsupported-media-type"
  | "too-large"
  | "malformed"
  | "honeypot"
  | "token-rejected"
  | "rate-limited"
  | "invalid"
  | "delivery-failed";

export interface LogRecord {
  event: "demo-request";
  outcome: Outcome;
  reference?: string;
  detail?: string;
  /** Correlates repeat submissions without storing the address. */
  submitterDigest?: string;
}

export function digestEmail(email: string): string {
  return createHash("sha256")
    .update(email.trim().toLowerCase())
    .digest("hex")
    .slice(0, 12);
}

export function buildLogRecord(record: LogRecord): LogRecord {
  return record;
}

export function logDemoRequest(record: LogRecord): void {
  // One structured line per submission; the platform captures stdout.
  console.log(JSON.stringify(buildLogRecord(record)));
}
