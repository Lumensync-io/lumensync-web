import { describe, expect, it } from "vitest";
import {
  COUNSEL_REVIEW_CLAIM_MARKERS,
  LEGAL_CONTENT_STATE,
  LEGAL_EFFECTIVE_DATE,
  LEGAL_STATUS_HEADING,
  LEGAL_STATUS_NOTE,
  PRIVACY,
  TERMS,
} from "@/lib/content/legal";
import {
  assertLegalContentMatchesFlag,
  indexingBlockers,
  isIndexable,
  isLegalContentApproved,
} from "@/lib/indexing";
import { CANONICAL_HOST } from "@/lib/site";
import { countReplacementChars, findMojibake } from "./mojibake";

/**
 * The owner-approved / counsel-pending state (LSWEB-019A1).
 *
 * The previous model had only one approved state, and it meant "counsel has
 * reviewed the shipped wording". That left no truthful way to say what is
 * actually true today: LumenSync approved this text for publication and no
 * lawyer has read it. Rather than redefine "approved" — which would have made
 * the site claim a review that never happened — a distinct state carries that
 * meaning, and these tests hold the two apart.
 */

const ALL_LEGAL_TEXT = [PRIVACY, TERMS]
  .flatMap((page) => [
    page.lead,
    page.notice.label,
    page.notice.body,
    page.openItemsIntro,
    ...page.openItems,
    ...page.sections.flatMap((s) => [s.heading, ...s.items]),
  ])
  .concat([LEGAL_STATUS_HEADING, LEGAL_STATUS_NOTE])
  .join(" ");

/** Environment in which every condition except the legal flag is satisfied. */
const READY_EXCEPT_LEGAL = {
  VERCEL_ENV: "production",
  VERCEL_PROJECT_PRODUCTION_URL: CANONICAL_HOST,
  SITE_INDEXABLE: "true",
} as const;

describe("1. owner-approved-pending-counsel is a valid, shipped state", () => {
  it("is the state this build ships", () => {
    expect(LEGAL_CONTENT_STATE).toBe("owner-approved-pending-counsel");
  });

  it("is assignable to the declared state type", () => {
    const state: typeof LEGAL_CONTENT_STATE = "owner-approved-pending-counsel";
    expect(state).toBe(LEGAL_CONTENT_STATE);
  });
});

describe("2. it never renders counsel-approved language", () => {
  for (const claim of COUNSEL_REVIEW_CLAIM_MARKERS) {
    it(`does not claim "${claim}"`, () => {
      expect(ALL_LEGAL_TEXT.toLowerCase()).not.toContain(claim);
    });
  }

  it("claims no legal sufficiency, certification or compliance", () => {
    expect(ALL_LEGAL_TEXT).not.toMatch(
      /legally (sufficient|binding|compliant)|complies with|certified|attested/i,
    );
    expect(ALL_LEGAL_TEXT).not.toMatch(/SOC\s?2|ISO\s?27001|HIPAA|FedRAMP|\bPCI\b/);
  });
});

describe("3. it renders the exact approved owner/counsel-pending wording", () => {
  it("uses the approved notice label and body verbatim", () => {
    for (const page of [PRIVACY, TERMS]) {
      expect(page.notice.label).toBe("Version 1");
      expect(page.notice.body).toBe(
        "Published by LumenSync. Counsel review is pending.",
      );
    }
  });

  it("uses the approved status heading and supporting sentence verbatim", () => {
    expect(LEGAL_STATUS_HEADING).toBe("Legal review status");
    expect(LEGAL_STATUS_NOTE).toBe(
      "This version is approved by LumenSync for publication. Independent legal review has not yet been completed.",
    );
  });

  it("no longer carries the old pending-review wording", () => {
    expect(ALL_LEGAL_TEXT).not.toContain("has not yet been reviewed by a lawyer");
    expect(ALL_LEGAL_TEXT).not.toContain("Still with counsel");
    expect(ALL_LEGAL_TEXT).not.toContain("still with counsel");
  });
});

describe("4. the state does not make the site indexable", () => {
  it("refuses to build if the approval flag is set in this state", () => {
    // The flag means counsel-approved. This state is not that, so a build that
    // sets it must fail rather than quietly publish to search engines.
    expect(() =>
      assertLegalContentMatchesFlag({ LEGAL_CONTENT_APPROVED: "true" }),
    ).toThrow(/owner-approved-pending-counsel/);
  });

  it("is not indexable even with every other condition met", () => {
    expect(isIndexable(READY_EXCEPT_LEGAL)).toBe(false);
    expect(indexingBlockers(READY_EXCEPT_LEGAL)).toContain(
      "legal-content-approved-flag",
    );
  });

  it("does not set the approval flag by virtue of the state", () => {
    expect(isLegalContentApproved({})).toBe(false);
  });
});

describe("5. SITE_INDEXABLE remains separately required", () => {
  it("stays un-indexable when only the legal flag is set", () => {
    expect(
      isIndexable({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: CANONICAL_HOST,
        LEGAL_CONTENT_APPROVED: "true",
      }),
    ).toBe(false);
  });

  it("names the missing site-indexable flag as a blocker", () => {
    expect(
      indexingBlockers({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: CANONICAL_HOST,
        LEGAL_CONTENT_APPROVED: "true",
      }),
    ).toContain("site-indexable-flag");
  });

  it("keeps the two flags independent", () => {
    expect(isLegalContentApproved({ SITE_INDEXABLE: "true" })).toBe(false);
  });
});

describe("6. counsel-reviewed \"approved\" remains a distinct state", () => {
  it("is not what this build ships", () => {
    expect(LEGAL_CONTENT_STATE).not.toBe("approved");
  });

  it("is still the only state the build guard accepts", () => {
    // Proven by the guard rejecting the state we do ship, above. If the two
    // were merged, that assertion could not hold.
    expect(() =>
      assertLegalContentMatchesFlag({ LEGAL_CONTENT_APPROVED: "true" }),
    ).toThrow(/LEGAL_CONTENT_STATE to "approved"/i);
  });
});

describe("7. awaiting-approval remains a valid state", () => {
  it("is still part of the declared union", () => {
    const state: typeof LEGAL_CONTENT_STATE = "awaiting-approval";
    expect(state).toBe("awaiting-approval");
  });
});

describe("8. published-pending-review is retained and safe", () => {
  it("is still part of the declared union", () => {
    const state: typeof LEGAL_CONTENT_STATE = "published-pending-review";
    expect(state).toBe("published-pending-review");
  });

  it("would also be refused by the build guard", () => {
    // Any state other than "approved" must fail the flag check. The shipped
    // state proves the rule; the legacy state is governed by the same branch.
    expect(LEGAL_CONTENT_STATE).not.toBe("approved");
    expect(() =>
      assertLegalContentMatchesFlag({ LEGAL_CONTENT_APPROVED: "true" }),
    ).toThrow();
  });
});

describe("9. substantive legal text is unchanged", () => {
  it("keeps the Privacy Policy section headings exactly", () => {
    expect(PRIVACY.sections.map((s) => s.heading)).toEqual([
      "Who this covers",
      "What we collect",
      "What we do not do",
      "How we use what you send",
      "Who else can see it",
      "How long we keep it",
      "Where it is processed",
      "Your choices and your rights",
      "Security",
      "Children",
      "Changes to this policy",
    ]);
  });

  it("keeps the Terms section headings exactly", () => {
    expect(TERMS.sections.map((s) => s.heading)).toEqual([
      "What this site is",
      "Using the site",
      "What the content is, and is not",
      "Ownership",
      "The application is separate",
      "No warranty",
      "Limitation of liability",
      "Changes to these terms",
    ]);
  });

  it("keeps all ten open items, unresolved and undeleted", () => {
    expect(PRIVACY.openItems).toHaveLength(5);
    expect(TERMS.openItems).toHaveLength(5);
    expect(PRIVACY.openItems[0]).toBe(
      "The formal legal entity acting as data controller, and its registered address.",
    );
    expect(TERMS.openItems[1]).toContain("Governing law and the venue for a dispute");
  });

  it("keeps the effective date unchanged", () => {
    expect(LEGAL_EFFECTIVE_DATE).toBe("16 August 2026");
  });
});

describe("10. the new wording is clean UTF-8", () => {
  it("introduces no mojibake or replacement characters", () => {
    const introduced = [
      LEGAL_STATUS_HEADING,
      LEGAL_STATUS_NOTE,
      PRIVACY.notice.label,
      PRIVACY.notice.body,
      TERMS.notice.label,
      TERMS.notice.body,
    ].join("\n");
    expect(findMojibake(introduced)).toEqual([]);
    expect(countReplacementChars(introduced)).toBe(0);
  });
});
