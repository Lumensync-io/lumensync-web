import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertLegalContentMatchesFlag,
  indexingBlockers,
  isIndexable,
  isLegalContentApproved,
} from "@/lib/indexing";
import {
  LEGAL_CONTACT,
  LEGAL_CONTENT_STATE,
  LEGAL_STATUS_HEADING,
  LEGAL_STATUS_NOTE,
  COUNSEL_REVIEW_CLAIM_MARKERS,
  LEGAL_PLACEHOLDER_MARKERS,
  PRIVACY,
  TERMS,
} from "@/lib/content/legal";

import { CANONICAL_HOST, SITE_URL, allPages } from "@/lib/site";
import { findForbiddenContent } from "./forbidden-terms";
/** Every word rendered on both legal pages. */
function legalText(): string {
  return [PRIVACY, TERMS]
    .flatMap((page) => [
      page.lead,
      page.notice.label,
      page.notice.body,
      page.openItemsIntro,
      LEGAL_STATUS_HEADING,
      LEGAL_STATUS_NOTE,
      ...page.openItems,
      ...page.sections.flatMap((s) => [s.heading, ...s.items]),
    ])
    .join(" ");
}

const PRODUCTION = { VERCEL_ENV: "production" };
const HOST = { VERCEL_PROJECT_PRODUCTION_URL: CANONICAL_HOST };
const INDEXABLE = { SITE_INDEXABLE: "true" };
const LEGAL = { LEGAL_CONTENT_APPROVED: "true" };
const ALL = { ...PRODUCTION, ...HOST, ...INDEXABLE, ...LEGAL };

describe("indexing requires all four gates", () => {
  it("permits indexing only when every condition holds", () => {
    expect(isIndexable(ALL)).toBe(true);
    expect(indexingBlockers(ALL)).toEqual([]);
  });

  it("refuses when any single condition is missing", () => {
    const cases: [string, Record<string, string>, string][] = [
      ["not production", { ...HOST, ...INDEXABLE, ...LEGAL }, "production-environment"],
      ["wrong host", { ...PRODUCTION, ...INDEXABLE, ...LEGAL }, "canonical-host"],
      ["no site flag", { ...PRODUCTION, ...HOST, ...LEGAL }, "site-indexable-flag"],
      [
        "no legal flag",
        { ...PRODUCTION, ...HOST, ...INDEXABLE },
        "legal-content-approved-flag",
      ],
    ];
    for (const [label, env, expected] of cases) {
      expect(isIndexable(env), label).toBe(false);
      expect(indexingBlockers(env), label).toContain(expected);
    }
  });

  it("does not let either flag stand in for the other", () => {
    // The exact mistake the owner asked to make impossible: the site must not
    // become indexable on the strength of SITE_INDEXABLE alone.
    expect(isIndexable({ ...PRODUCTION, ...HOST, ...INDEXABLE })).toBe(false);
    expect(isIndexable({ ...PRODUCTION, ...HOST, ...LEGAL })).toBe(false);
  });

  it("treats the production host alone as insufficient", () => {
    expect(isIndexable({ ...PRODUCTION, ...HOST })).toBe(false);
  });

  it("stays closed on the vercel.app production alias even with both flags", () => {
    expect(
      isIndexable({
        ...ALL,
        VERCEL_PROJECT_PRODUCTION_URL: "lumensync-web.vercel.app",
      }),
    ).toBe(false);
  });

  it("stays closed on a preview deployment even with both flags", () => {
    expect(isIndexable({ ...ALL, VERCEL_ENV: "preview" })).toBe(false);
  });

  it("accepts only the exact string \"true\"", () => {
    for (const value of ["TRUE", "1", "yes", "", " true"]) {
      expect(isIndexable({ ...ALL, SITE_INDEXABLE: value }), value).toBe(false);
      expect(isIndexable({ ...ALL, LEGAL_CONTENT_APPROVED: value }), value).toBe(false);
    }
  });

  it("is closed with no environment at all, and names every blocker", () => {
    expect(isIndexable({})).toBe(false);
    expect(indexingBlockers({}).sort()).toEqual([
      "canonical-host",
      "legal-content-approved-flag",
      "production-environment",
      "site-indexable-flag",
    ]);
  });
});

describe("legal approval cannot drift from the shipped words", () => {
  it("reads the approval flag independently of the indexing flag", () => {
    expect(isLegalContentApproved({ LEGAL_CONTENT_APPROVED: "true" })).toBe(true);
    expect(isLegalContentApproved({})).toBe(false);
  });

  it("refuses to build when the flag is set but counsel has not reviewed the text", () => {
    expect(() => assertLegalContentMatchesFlag({ LEGAL_CONTENT_APPROVED: "true" })).toThrow(
      /LEGAL_CONTENT_STATE to "approved"/i,
    );
  });

  it("does not object while the flag is unset", () => {
    expect(() => assertLegalContentMatchesFlag({})).not.toThrow();
  });

  it("describes its own review status truthfully for the shipped state", () => {
    const text = legalText();

    if (LEGAL_CONTENT_STATE === "approved") {
      for (const marker of LEGAL_PLACEHOLDER_MARKERS) {
        expect(text, marker).not.toContain(marker);
      }
    } else {
      // Not counsel-reviewed. The pages must never imply otherwise,
      // whichever pre-approval state is shipped.
      for (const claim of COUNSEL_REVIEW_CLAIM_MARKERS) {
        expect(text.toLowerCase(), claim).not.toContain(claim);
      }
      expect(PRIVACY.openItems.length, "privacy open items").toBeGreaterThan(0);
      expect(TERMS.openItems.length, "terms open items").toBeGreaterThan(0);
    }

    if (LEGAL_CONTENT_STATE === "owner-approved-pending-counsel") {
      expect(text).toContain(LEGAL_STATUS_NOTE);
      expect(text).toContain(LEGAL_STATUS_HEADING);
    }

    if (LEGAL_CONTENT_STATE === "published-pending-review") {
      // Legacy state, retained: it carried its own explicit disclosure.
      expect(text).toContain("has not yet been reviewed by a lawyer");
    }
  });

  it("asserts no retention period, jurisdiction or certification it has not earned", () => {
    const body = [PRIVACY, TERMS]
      .flatMap((page) => page.sections.flatMap((s) => s.items))
      .join(" ");
    // A borrowed policy would carry all of these. Ours must not, because none
    // of them has actually been decided.
    expect(body).not.toMatch(/\b\d+\s+(days?|months?|years?)\b/i);
    expect(body).not.toMatch(/governed by the laws|exclusive jurisdiction/i);
    expect(body).not.toMatch(/SOC\s?2|ISO\s?27001|HIPAA|FedRAMP|\bPCI\b/);
    expect(body).not.toMatch(/\bGDPR\b|\bCCPA\b/);
    expect(body).not.toMatch(/we (guarantee|promise|warrant)\b/i);
  });

  it("commits only to things the site verifiably does", () => {
    const privacy = PRIVACY.sections.flatMap((s) => s.items).join(" ");
    // These are enforced elsewhere by tests, so the policy may state them.
    expect(privacy).toMatch(/set no cookies/i);
    expect(privacy).toMatch(/no analytics/i);
    expect(privacy).toMatch(/served from our own domain/i);
    // And it must name a real, monitored way to exercise a right.
    expect(privacy).toContain(LEGAL_CONTACT);
  });
});

describe("canonical, sitemap and route surface", () => {
  it("canonicalises on the www host and never a deployment host", () => {
    expect(CANONICAL_HOST).toBe("www.lumensync.io");
    expect(SITE_URL).toBe("https://www.lumensync.io");
    expect(SITE_URL).not.toMatch(/vercel\.app/);
  });

  it("builds every sitemap URL on the canonical host", () => {
    for (const page of allPages) {
      const url = `${SITE_URL}${page.path === "/" ? "" : page.path}`;
      expect(url.startsWith("https://www.lumensync.io")).toBe(true);
    }
  });

  it("does not implement the protected legacy customer routes in this app", () => {
    // Those paths must continue to be served by the legacy origin behind edge
    // protection. If this application ever answered them, the cutover would
    // silently take them over.
    const appDir = join(process.cwd(), "app");
    const segments: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          segments.push(entry);
          walk(path);
        }
      }
    };
    walk(appDir);

    for (const segment of segments) {
      expect(findForbiddenContent(segment), `app route segment "${segment}"`).toEqual([]);
    }
    for (const page of allPages) {
      expect(findForbiddenContent(page.path), page.path).toEqual([]);
    }
  });
});
