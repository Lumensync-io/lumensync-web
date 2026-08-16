import { LEGAL_CONTENT_STATE } from "./content/legal";
import { CANONICAL_HOST } from "./site";

/**
 * The single decision point for whether a deployment may be indexed.
 *
 * Four independent conditions must all hold, so that no single accident — and
 * no single forgotten step — turns indexing on:
 *
 *   1. It is a production deployment (never a preview).
 *   2. Its production host is the canonical public host, so a `*.vercel.app`
 *      production alias stays out of the index even after the domain exists.
 *   3. `SITE_INDEXABLE` is explicitly "true" for that deployment.
 *   4. `LEGAL_CONTENT_APPROVED` is explicitly "true" for that deployment.
 *
 * Condition 3 makes the launch atomic and reversible: attaching the production
 * domain does not publish the site to search engines, so routing can be proven
 * first and indexing switched on afterwards by setting one variable and
 * redeploying.
 *
 * Condition 4 makes the owner's rule — never index while the legal pages are
 * placeholders — a property of the software rather than a procedure someone has
 * to remember at the wrong hour. It is deliberately independent of condition 3:
 * neither flag can stand in for the other, and the build additionally refuses
 * to start if the flag is set while this repository still carries unapproved
 * legal text (see `assertLegalContentMatchesFlag`).
 *
 * Everything here is read on the server only. No flag is exposed to the
 * browser; the legal pages receive a boolean, never a variable name or value.
 */

export interface IndexingEnv {
  VERCEL_ENV?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  SITE_INDEXABLE?: string;
  LEGAL_CONTENT_APPROVED?: string;
}

/** Every condition, named, so a deployment can explain why it is not indexed. */
export type IndexingCondition =
  | "production-environment"
  | "canonical-host"
  | "site-indexable-flag"
  | "legal-content-approved-flag";

/** Whether the deployment has been told its legal content is counsel-approved. */
export function isLegalContentApproved(
  env: IndexingEnv = process.env as IndexingEnv,
): boolean {
  return env.LEGAL_CONTENT_APPROVED === "true";
}

/** The conditions that are NOT met. Empty means the site may be indexed. */
export function indexingBlockers(
  env: IndexingEnv = process.env as IndexingEnv,
): IndexingCondition[] {
  const blockers: IndexingCondition[] = [];
  if (env.VERCEL_ENV !== "production") blockers.push("production-environment");
  if (env.VERCEL_PROJECT_PRODUCTION_URL !== CANONICAL_HOST) {
    blockers.push("canonical-host");
  }
  if (env.SITE_INDEXABLE !== "true") blockers.push("site-indexable-flag");
  if (!isLegalContentApproved(env)) blockers.push("legal-content-approved-flag");
  return blockers;
}

export function isIndexable(env: IndexingEnv = process.env as IndexingEnv): boolean {
  return indexingBlockers(env).length === 0;
}

/** Header applied to every response while the site is not indexable. */
export const NOINDEX_HEADER = "noindex, nofollow";

/**
 * Refuses to build a deployment that claims counsel-approved legal content
 * while this repository still ships the pre-approval text.
 *
 * The flag alone could otherwise be set by mistake against a build whose legal
 * pages are still placeholders — the exact failure the owner asked to make
 * impossible. Because this runs while the legal routes are generated, that
 * mistake becomes a failed build rather than an indexed site with no policy.
 */
export function assertLegalContentMatchesFlag(
  env: IndexingEnv = process.env as IndexingEnv,
): void {
  if (isLegalContentApproved(env) && LEGAL_CONTENT_STATE !== "approved") {
    throw new Error(
      "LEGAL_CONTENT_APPROVED is set, but this build still contains " +
        "pre-approval legal content. Ship the counsel-approved Privacy and " +
        "Terms text and set LEGAL_CONTENT_STATE to \"approved\" before " +
        "setting this variable.",
    );
  }
}
