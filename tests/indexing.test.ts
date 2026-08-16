import { describe, expect, it } from "vitest";
import { isIndexable } from "@/lib/indexing";
import { CANONICAL_HOST, SITE_URL, allPages } from "@/lib/site";

const LIVE = {
  VERCEL_ENV: "production",
  VERCEL_PROJECT_PRODUCTION_URL: CANONICAL_HOST,
  SITE_INDEXABLE: "true",
};

describe("indexing switch", () => {
  it("allows indexing only when all three conditions hold", () => {
    expect(isIndexable(LIVE)).toBe(true);
  });

  it("stays closed on a preview deployment", () => {
    expect(isIndexable({ ...LIVE, VERCEL_ENV: "preview" })).toBe(false);
  });

  it("stays closed on the vercel.app production alias", () => {
    expect(
      isIndexable({
        ...LIVE,
        VERCEL_PROJECT_PRODUCTION_URL: "lumensync-web.vercel.app",
      }),
    ).toBe(false);
  });

  it("stays closed until the flag is set, even once the domain is attached", () => {
    // This is the property that makes the launch atomic: attaching the domain
    // is not enough to publish the site to search engines.
    const { SITE_INDEXABLE: _flag, ...domainAttached } = LIVE;
    expect(isIndexable(domainAttached)).toBe(false);
    expect(isIndexable({ ...domainAttached, SITE_INDEXABLE: "false" })).toBe(false);
    expect(isIndexable({ ...domainAttached, SITE_INDEXABLE: "TRUE" })).toBe(false);
  });

  it("is closed with no environment at all", () => {
    expect(isIndexable({})).toBe(false);
  });
});

describe("canonical host", () => {
  it("is the www host the production redirect and edge protection already use", () => {
    expect(CANONICAL_HOST).toBe("www.lumensync.io");
    expect(SITE_URL).toBe("https://www.lumensync.io");
  });

  it("never canonicalises to a deployment host", () => {
    expect(SITE_URL).not.toMatch(/vercel\.app/);
  });

  it("builds every sitemap URL on the canonical host", () => {
    for (const page of allPages) {
      const url = `${SITE_URL}${page.path === "/" ? "" : page.path}`;
      expect(url.startsWith("https://www.lumensync.io")).toBe(true);
    }
  });
});
