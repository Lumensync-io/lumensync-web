import { createHash } from "node:crypto";

/**
 * A fixed-window limiter held in the instance's memory.
 *
 * Honest about what this is: serverless instances are not shared, so the limit
 * applies per warm instance rather than globally. It reliably stops a single
 * client hammering one instance and it costs nothing; it is not a defence
 * against a distributed flood. A durable store would be needed for that, and
 * that is a deliberate follow-up rather than an unstated gap.
 *
 * Keys are hashed before they are stored, so no raw IP address is ever held in
 * memory or written to a log.
 */

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  /** Guard against unbounded growth from spoofed keys. */
  maxTrackedKeys?: number;
}

export function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

export function createRateLimiter({
  limit,
  windowMs,
  maxTrackedKeys = 10_000,
}: RateLimiterOptions) {
  const windows = new Map<string, { count: number; resetAt: number }>();

  function prune(now: number) {
    for (const [key, window] of windows) {
      if (window.resetAt <= now) windows.delete(key);
    }
    if (windows.size > maxTrackedKeys) windows.clear();
  }

  return function check(rawKey: string, now: number = Date.now()): RateLimitDecision {
    prune(now);
    const key = hashKey(rawKey);
    const existing = windows.get(key);

    if (!existing || existing.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: limit - existing.count,
      retryAfterSeconds: 0,
    };
  };
}

const WINDOW_MS = 10 * 60 * 1000;

/** Per-client: enough for a genuine retry, not enough to script. */
export const perClientLimiter = createRateLimiter({ limit: 5, windowMs: WINDOW_MS });

/** Whole-instance ceiling, so one instance cannot be used to fan out. */
export const globalLimiter = createRateLimiter({ limit: 60, windowMs: WINDOW_MS });

/**
 * The client address as reported by the platform proxy. Never logged or
 * delivered in raw form — it is only ever used as a limiter key.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
