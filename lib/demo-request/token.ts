import { createHmac, timingSafeEqual } from "node:crypto";
import { MAX_FORM_AGE_MS, MIN_FILL_MS } from "./schema";

/**
 * A signed "this form was really rendered by us, and not one millisecond ago"
 * token. It is a speed bump, not an authentication mechanism: it defeats naive
 * scripted posting without a CAPTCHA, a third-party bot service or a cookie.
 *
 * The payload is only a timestamp, so the token carries no personal data and
 * needs no consent banner.
 */

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function issueFormToken(secret: string, now: number = Date.now()): string {
  const payload = String(now);
  return `${payload}.${sign(secret, payload)}`;
}

export type TokenVerdict =
  | "valid"
  | "missing"
  | "malformed"
  | "bad-signature"
  | "too-fast"
  | "expired";

export function verifyFormToken(
  token: unknown,
  secret: string,
  now: number = Date.now(),
): TokenVerdict {
  if (typeof token !== "string" || token.length === 0) return "missing";
  if (token.length > 256) return "malformed";

  const separator = token.indexOf(".");
  if (separator <= 0) return "malformed";

  const payload = token.slice(0, separator);
  const provided = token.slice(separator + 1);
  if (!/^\d{10,16}$/.test(payload) || provided.length === 0) return "malformed";

  const expected = sign(secret, payload);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "bad-signature";

  const issuedAt = Number(payload);
  const age = now - issuedAt;
  if (age < MIN_FILL_MS) return "too-fast";
  if (age > MAX_FORM_AGE_MS) return "expired";
  return "valid";
}
