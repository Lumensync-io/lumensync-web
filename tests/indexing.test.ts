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
  LEGAL_CONTENT_STATE,
  LEGAL_PLACEHOLDER_MARKERS,
  PRIVACY,
  TERMS,
} from "@/lib/content/legal";
import { CANONICAL_HOST, SITE_URL, allPages } from "@/lib/site";
import { findForbiddenContent } from "./forbidden-terms";

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

  it("refuses to build when the flag is set but the text is pre-approval", () => {
    expect(() => assertLegalContentMatchesFlag({ LEGAL_CONTENT_APPROVED: "true" })).toThrow(
      /still contains pre-approval legal content/i,
    );
  });

  it("does not object while the flag is unset", () => {
    expect(() => assertLegalContentMatchesFlag({})).not.toThrow();
  });

  it("keeps placeholder wording only while the content is unapproved", () => {
    const text = [PRIVACY, TERMS]
      .flatMap((page) => [
        page.lead,
        page.gate.label,
        page.gate.body,
        page.gatedIntro,
        ...page.gated,
        ...page.disclosures.flatMap((s) => [s.heading, s.lead ?? "", ...s.items]),
      ])
      .join(" ");

    if (LEGAL_CONTENT_STATE === "approved") {
      for (const marker of LEGAL_PLACEHOLDER_MARKERS) {
        expect(text, marker).not.toContain(marker);
      }
    } else {
      // Unapproved content must be unmistakably labelled as such.
      expect(text).toContain("reviewed by a lawyer");
    }
  });

  it("states no retention period, jurisdiction or promise in the factual half", () => {
    const factual = [PRIVACY, TERMS]
      .flatMap((page) => page.disclosures.flatMap((s) => [s.lead ?? "", ...s.items]))
      .join(" ");
    expect(factual).not.toMatch(/we (guarantee|promise|warrant)/i);
    expect(factual).not.toMatch(/\b\d+\s+(days?|months?|years?)\b/i);
    expect(factual).not.toMatch(/GDPR|CCPA|governed by the laws/i);
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
