/**
 * Legal page content — version 1.
 *
 * Written for LumenSync from scratch. No other company's policy text was
 * copied, and nothing here describes a practice LumenSync does not actually
 * follow: every statement about this website's behaviour can be checked against
 * the code in this repository, and several are enforced by tests.
 *
 * It follows the structure a mature SaaS policy uses — what is collected, why,
 * who else sees it, how long it is kept, what rights you have, how changes are
 * made — because that structure is what readers and regulators expect. What it
 * does not do is invent a retention period, a compliance certification or a
 * jurisdiction that has not been decided. Those are listed as open items for
 * counsel instead of being guessed at.
 *
 * Published as the company's own current statement. It has not been reviewed by
 * a lawyer, the pages say so, and `LEGAL_CONTENT_STATE` keeps the indexing gate
 * shut until that review happens.
 */

/** The date this version took effect and was last checked against the code. */
export const LEGAL_EFFECTIVE_DATE = "16 August 2026";

/** Where the public can reach LumenSync about anything on these pages. */
export const LEGAL_CONTACT = "demo@lumensync.io";

/**
 * How far the legal content has got.
 *
 * "awaiting-approval"        — placeholder only, nothing publishable.
 * "published-pending-review" — LumenSync's own v1, live, not yet seen by counsel.
 * "owner-approved-pending-counsel"
 *                            — approved by LumenSync for publication,
 *                              counsel review not yet done.
 * "approved"                 — counsel has reviewed the shipped wording.
 *
 * Only "approved" satisfies the indexing gate. The build fails if
 * `LEGAL_CONTENT_APPROVED` is set while this says anything else, so the site
 * cannot be published to search engines on the strength of a self-authored
 * draft — see `lib/indexing.ts`.
 */
export const LEGAL_CONTENT_STATE:
  | "awaiting-approval"
  | "published-pending-review"
  | "owner-approved-pending-counsel"
  | "approved" = "owner-approved-pending-counsel";

/** Wording that must not survive counsel review. Asserted by tests. */
export const LEGAL_PLACEHOLDER_MARKERS = [
  "has not yet been reviewed by a lawyer",
  "Still with counsel",
] as const;

/**
 * The public status block on both legal pages.
 *
 * Deliberately narrow: it says who approved the document and that counsel
 * review has not happened. It does not claim legal review, legal sufficiency
 * or regulatory compliance, because none of those is true yet.
 */
export const LEGAL_STATUS_HEADING = "Legal review status";
export const LEGAL_STATUS_NOTE =
  "This version is approved by LumenSync for publication. Independent legal review has not yet been completed.";

/**
 * Phrases that assert a completed legal review. While LEGAL_CONTENT_STATE is
 * anything other than "approved", none of these may appear in published legal
 * copy, so the pages cannot drift into implying a review that has not happened.
 */
export const COUNSEL_REVIEW_CLAIM_MARKERS = [
  "reviewed by counsel",
  "approved by counsel",
  "counsel has reviewed",
  "counsel-approved",
  "counsel approved",
  "legal review complete",
  "legally reviewed",
  "reviewed by a lawyer",
] as const;

/** The section the demo-form state note attaches to on the privacy page. */
export const DEMO_FORM_SECTION = "What we collect";

/** Shown while a deployment has no delivery destination configured. */
export const DEMO_FORM_OFF_NOTE =
  "On this deployment the demo request form is switched off, so no submission can be made and none is being received. What follows describes what happens when it is enabled.";

export interface LegalSection {
  heading: string;
  items: string[];
}

export interface LegalPage {
  eyebrow: string;
  heading: string;
  lead: string;
  notice: { label: string; body: string };
  sections: LegalSection[];
  openItemsIntro: string;
  openItems: string[];
}

const REVIEW_NOTICE = {
  label: "Version 1",
  body: "Published by LumenSync. Counsel review is pending.",
};

export const PRIVACY: LegalPage = {
  eyebrow: "Legal",
  heading: "Privacy Policy",
  lead: "What this website does with personal information, in plain terms. It covers this website only — the LumenSync application at app.lumensync.io is a separate system, and how it handles your project data is governed by the agreement covering it.",
  notice: REVIEW_NOTICE,
  sections: [
    {
      heading: "Who this covers",
      items: [
        "This policy applies to the LumenSync marketing website and every page served under it.",
        "It does not cover the LumenSync application. Signing in there is a different relationship with different terms.",
        `LumenSync is responsible for the information described here. You can reach us at ${LEGAL_CONTACT}.`,
      ],
    },
    {
      heading: "What we collect",
      items: [
        "If you submit the demo request form: your name, work email, company, an optional role, and an optional message about what you would like to see.",
        "Automatically, as any website does: our hosting provider records the connection details needed to serve a page — IP address, browser user-agent, the URL requested, and the time of the request.",
        "Nothing else. There is no account to create, nothing to buy, and no other form on the site.",
      ],
    },
    {
      heading: "What we do not do",
      items: [
        "We set no cookies. There is no consent banner because there is nothing to consent to.",
        "We use no analytics product, tag manager, advertising pixel, social widget or session recorder.",
        "We write nothing to your browser's local or session storage.",
        "Every asset — styles, scripts, fonts and images — is served from our own domain, so loading a page makes no request to a third party.",
        "We do not sell personal information, share it for advertising, or build a profile of you.",
      ],
    },
    {
      heading: "How we use what you send",
      items: [
        "A demo request is used to reply to you and to arrange a demonstration. That is its only purpose.",
        "You are not added to a marketing list or an automated email sequence.",
        "The connection details our host records are used to serve the site, keep it available, and investigate abuse.",
      ],
    },
    {
      heading: "Who else can see it",
      items: [
        "Vercel hosts this website and processes connection details in the course of serving it.",
        "Microsoft receives a submitted demo request through our own endpoint on Azure and holds it in a LumenSync mailbox on Microsoft 365.",
        "No one else. We use no CRM, no marketing platform, no third-party form service and no data broker.",
      ],
    },
    {
      heading: "How long we keep it",
      items: [
        "The website itself stores nothing. A demo request is validated, forwarded once, and not retained by the site.",
        "A submitted request stays in the LumenSync mailbox while we deal with your enquiry and afterwards as a record of it. We have not yet fixed a formal retention period; when we set one we will publish it here.",
        "Connection details follow our hosting provider's own log retention.",
        "We write one line per submission on our side: the time, the outcome, a short reference, and a one-way digest of the email address so repeat submissions can be recognised. Your name, your address, your company and your message are not written to that log.",
      ],
    },
    {
      heading: "Where it is processed",
      items: [
        "The website, the intake endpoint and the mailbox are all operated in the United States.",
      ],
    },
    {
      heading: "Your choices and your rights",
      items: [
        `You can ask what we hold about you, ask us to correct it, or ask us to delete it. Write to ${LEGAL_CONTACT} and a person will answer.`,
        "Depending on where you live, local law may give you further rights. We will honour what we are required to honour, and if we cannot do something we will tell you plainly why.",
        "The simplest control of all: unless you have submitted the form, we hold nothing about you beyond the connection details our host records in order to serve the page.",
      ],
    },
    {
      heading: "Security",
      items: [
        "Submissions travel over HTTPS, the endpoint that receives them requires an authenticated request, and the mailbox they arrive in is restricted to named people.",
        "No system is perfectly secure and we do not claim otherwise. The security page sets out exactly what LumenSync does and does not claim.",
      ],
    },
    {
      heading: "Children",
      items: [
        "This site is aimed at people working in commercial construction and electrical contracting. It is not directed at children, and we do not knowingly collect information from them.",
      ],
    },
    {
      heading: "Changes to this policy",
      items: [
        `This version took effect on ${LEGAL_EFFECTIVE_DATE}. If we change it, the date changes with it.`,
        "A material change will be described here rather than made quietly.",
      ],
    },
  ],
  openItemsIntro:
    "Being straight about what a lawyer still needs to settle. None of it changes how the site behaves today; each item is a commitment that should be made deliberately rather than drafted in a hurry.",
  openItems: [
    "The formal legal entity acting as data controller, and its registered address.",
    "How long a demo request is kept once the enquiry is closed, and who inside the business can read it.",
    "Which privacy regimes to address explicitly, the statutory rights to enumerate under each, and the response time to commit to.",
    "Whether a data processing agreement is required with any processor named above.",
    "How this policy relates to the separate policy covering the LumenSync application.",
  ],
};

export const TERMS: LegalPage = {
  eyebrow: "Legal",
  heading: "Terms of Service",
  lead: "The terms for using this website. Using the LumenSync application is governed by a separate agreement — nothing on this site grants access to it, and nothing here overrides it.",
  notice: REVIEW_NOTICE,
  sections: [
    {
      heading: "What this site is",
      items: [
        "An informational website describing the LumenSync product. There is no account to create, nothing to purchase, and no service delivered through it.",
        "The only interactive element is the demo request form. Submitting it starts a conversation and nothing more — it does not create a contract, a trial, or an obligation on either side.",
      ],
    },
    {
      heading: "Using the site",
      items: [
        "You are welcome to read these pages, link to them, and share them.",
        "Please do not attempt to break, overload or gain unauthorised access to this site or the systems behind it; scrape it at a volume that degrades it for others; or use the demo form to send unsolicited commercial messages, malicious content or anything unlawful.",
        "We may block access that does any of those things.",
      ],
    },
    {
      heading: "What the content is, and is not",
      items: [
        "Product descriptions reflect the product as built at the time of writing. Software changes, and a description on a marketing page is not a specification or a warranty.",
        "Where the product's limits are relevant this site states them, including which certifications LumenSync does not hold.",
        "No pricing, service level, availability commitment or delivery date is offered anywhere on this site.",
      ],
    },
    {
      heading: "Ownership",
      items: [
        "The LumenSync name, the product interface shown in screenshots, and the text and design of this site belong to their owner.",
        "Any other product or company name used on this site is used only to describe the work LumenSync supports, and belongs to its respective owner.",
        "Nothing here grants you a licence beyond reading and sharing these pages.",
      ],
    },
    {
      heading: "The application is separate",
      items: [
        "app.lumensync.io is a different system, reached by signing in, and its use is governed by the agreement covering it — not by this website.",
        "Nothing on this website grants any right to access the application or any project data held in it.",
      ],
    },
    {
      heading: "No warranty",
      items: [
        "This website is provided as it is. To the fullest extent the law allows, we make no warranty that it will be uninterrupted, error-free, or fit for any particular purpose.",
      ],
    },
    {
      heading: "Limitation of liability",
      items: [
        "To the fullest extent the law allows, LumenSync is not liable for indirect, incidental or consequential loss arising from your use of this website.",
        "Nothing in these terms limits any liability that cannot lawfully be limited.",
      ],
    },
    {
      heading: "Changes to these terms",
      items: [
        `This version took effect on ${LEGAL_EFFECTIVE_DATE}. If we change it, the date changes with it.`,
      ],
    },
  ],
  openItemsIntro:
    "What a lawyer still needs to settle. Each of these is a commitment or a limitation, and each is better decided than assumed.",
  openItems: [
    "The contracting entity, and how acceptance of these terms is established.",
    "Governing law and the venue for a dispute — deliberately not asserted here rather than guessed.",
    "Whether the limitation of liability above is the right one for that jurisdiction.",
    "Any consumer-protection wording required where visitors are located.",
    "How these terms interact with the agreement covering the LumenSync application.",
  ],
};
