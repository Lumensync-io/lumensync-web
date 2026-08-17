import { describe, expect, it } from "vitest";
import * as company from "@/lib/content/company";
import * as conversion from "@/lib/content/conversion";
import * as product from "@/lib/content/product";
import * as homepage from "@/lib/homepage-content";
import { SITE_DESCRIPTION, SITE_TITLE, allPages } from "@/lib/site";

/**
 * House style: American English across the public marketing site.
 *
 * LumenSync is a U.S.-market product sold to U.S. contractors, GCs and owners,
 * and the site had drifted into a mix — two pages carried both forms of the
 * same word. This locks the decision in so the drift does not quietly return.
 *
 * `lib/content/legal.ts` is deliberately NOT scanned: the legal wording is
 * frozen pending counsel review and must not be edited for style.
 */
const BRITISH_FORMS = [
  "behaviour",
  "organise",
  "organisation",
  "labelled",
  "colour",
  "catalogue",
  "centre",
  "authorise",
  "authorised",
  "authorisation",
  "recognise",
  "optimise",
  "optimisation",
  "standardise",
  "normalise",
  "prioritise",
  "summarise",
  "minimise",
  "maximise",
  "analyse",
  "modelling",
  "enquiry",
  "enquiries",
  "defence",
  "licence",
] as const;

const SOURCES: Record<string, unknown> = {
  "lib/content/company.ts": company,
  "lib/content/conversion.ts": conversion,
  "lib/content/product.ts": product,
  "lib/homepage-content.ts": homepage,
};

describe("house style — American English on the public marketing site", () => {
  for (const [name, mod] of Object.entries(SOURCES)) {
    it(`${name} uses American spellings`, () => {
      const text = JSON.stringify(mod);
      for (const form of BRITISH_FORMS) {
        expect(
          new RegExp(`\\b${form}`, "i").test(text),
          `${name} contains the British form "${form}"`,
        ).toBe(false);
      }
    });
  }

  it("route titles and descriptions use American spellings", () => {
    const text = JSON.stringify(allPages) + SITE_DESCRIPTION + SITE_TITLE;
    for (const form of BRITISH_FORMS) {
      expect(new RegExp(`\\b${form}`, "i").test(text), form).toBe(false);
    }
  });
});

describe("homepage metadata stays inside search-result limits", () => {
  it("title is at most 60 characters", () => {
    expect(SITE_TITLE.length).toBeLessThanOrEqual(60);
  });

  it("description is at most 160 characters", () => {
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });

  it("no route title repeats the brand twice", () => {
    for (const page of allPages) {
      const full = `${page.title} — LumenSync`;
      const occurrences = full.split("LumenSync").length - 1;
      expect(occurrences, `${page.path}: "${full}"`).toBeLessThanOrEqual(1);
    }
  });
});
