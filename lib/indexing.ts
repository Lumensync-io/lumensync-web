import { CANONICAL_HOST } from "./site";

/**
 * The single decision point for whether a deployment may be indexed.
 *
 * Three independent conditions must all hold, so that no single accident turns
 * indexing on:
 *
 *   1. It is a production deployment (never a preview).
 *   2. Its production host is the canonical public host — so a `*.vercel.app`
 *      production alias stays out of the index even after the domain exists.
 *   3. `SITE_INDEXABLE` is explicitly "true" for that deployment.
 *
 * Condition 3 is what makes the launch atomic and reversible. Attaching the
 * production domain does not, on its own, publish the site to search engines:
 * routing can be proven first, and indexing switched on afterwards by setting
 * one environment variable and redeploying. Unsetting it takes the site back
 * out of the index the same way, without touching DNS.
 */

export interface IndexingEnv {
  VERCEL_ENV?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  SITE_INDEXABLE?: string;
}

export function isIndexable(env: IndexingEnv = process.env as IndexingEnv): boolean {
  return (
    env.VERCEL_ENV === "production" &&
    env.VERCEL_PROJECT_PRODUCTION_URL === CANONICAL_HOST &&
    env.SITE_INDEXABLE === "true"
  );
}

/** Header applied to every response while the site is not indexable. */
export const NOINDEX_HEADER = "noindex, nofollow";
