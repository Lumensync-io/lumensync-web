/**
 * Legal page content.
 *
 * Two kinds of text live here, and they are deliberately kept apart on the
 * page:
 *
 *   `disclosures` — verifiable statements about how this website actually
 *   behaves. Every line can be checked against the code in this repository or
 *   observed in the browser. Several are enforced by tests.
 *
 *   `gated` — the parts of a real policy that create legal commitments. These
 *   are listed as outstanding items, not drafted. Nothing in this repository
 *   invents a promise, a retention period, a legal basis or a jurisdiction, and
 *   no AI-drafted text is presented as reviewed policy.
 *
 * The site is not indexable and the production domain is not attached, so no
 * visitor can arrive here expecting a published policy before it exists.
 */

/** The date the disclosures below were last checked against the code. */
export const LEGAL_LAST_VERIFIED = "16 August 2026";

/**
 * Whether the text in this file is the counsel-approved wording.
 *
 * Flip to "approved" only in the same change that replaces the pre-approval
 * content with text an owner or counsel has actually signed off. The build
 * refuses to start if `LEGAL_CONTENT_APPROVED` is set while this still says
 * "awaiting-approval" (see `lib/indexing.ts`), so the environment flag and the
 * shipped words cannot drift apart in either direction.
 */
export const LEGAL_CONTENT_STATE: "awaiting-approval" | "approved" =
  "awaiting-approval";

/**
 * Phrases that may appear only while the content is unapproved. A test asserts
 * they are absent once `LEGAL_CONTENT_STATE` is "approved".
 */
export const LEGAL_PLACEHOLDER_MARKERS = [
  "Still to be written and approved",
  "reviewed by a lawyer",
  "Not yet an approved policy",
  "Not yet approved terms",
] as const;

/** Heading of the section the demo-form state note attaches to. */
export const DEMO_FORM_SECTION = "The demo request form";

/** Shown on the privacy page while the form has no delivery destination. */
export const DEMO_FORM_OFF_NOTE =
  "Right now the form is switched off, so no submission can be made and none is being received. What follows describes what happens once it is enabled.";

export interface LegalSection {
  heading: string;
  lead?: string;
  items: string[];
}

export interface LegalPage {
  eyebrow: string;
  heading: string;
  lead: string;
  gate: { label: string; body: string };
  disclosureIntro: string;
  disclosures: LegalSection[];
  gatedIntro: string;
  gated: string[];
}

export const PRIVACY: LegalPage = {
  eyebrow: "Legal",
  heading: "Privacy and data handling",
  lead: "This page has two halves. The first describes exactly what this website does with data today and is accurate as written. The second lists what a finished privacy policy still needs — the parts that commit LumenSync to something, which will be published only once they have been reviewed.",
  gate: {
    label: "Not yet an approved policy",
    body: "The technical disclosures below are factual and current. They are not a substitute for a privacy policy, and nothing here has been reviewed by a lawyer. The final policy will be published before this site is reachable on its public domain.",
  },
  disclosureIntro: `How this website behaves, verified against the code on ${LEGAL_LAST_VERIFIED}.`,
  disclosures: [
    {
      heading: "No tracking of any kind",
      items: [
        "This site sets no cookies. There is no session cookie, no preference cookie and no consent banner, because there is nothing to consent to.",
        "There is no analytics product, tag manager, advertising pixel, social widget, session recorder or A/B testing tool on any page.",
        "Nothing is written to local storage or session storage.",
        "No visitor profile is built, and nothing about a visit is shared with a third party for marketing.",
      ],
    },
    {
      heading: "No third-party requests when a page loads",
      items: [
        "Every asset — styles, scripts, fonts and images — is served from this site's own domain. Fonts are self-hosted at build time rather than fetched from a font provider.",
        "Links to the LumenSync application at app.lumensync.io are ordinary links. Nothing is sent there until a visitor chooses to follow one, and the application is a separate system with its own handling of data.",
      ],
    },
    {
      heading: "What the host necessarily sees",
      items: [
        "The site is served by its hosting provider, which — like any web host — processes the connection details needed to deliver a page: IP address, browser user-agent, the URL requested, and the time of the request. These appear in the provider's operational logs.",
        "This is required to serve the site at all. It is not used to build a profile, and LumenSync does not combine it with anything else.",
      ],
    },
    {
      heading: "The demo request form",
      lead: "The only place this site accepts personal data, and only if a person chooses to submit it. What follows describes exactly what happens to a submission.",
      items: [
        "The fields are: name, work email, company, an optional role, and an optional message describing what you would like to see.",
        "A submission is validated and forwarded once to the destination LumenSync uses to receive demo requests. The website itself has no database and stores no submission.",
        "The outcome shown to you is the real outcome. If the request cannot be delivered, you are told it was not received rather than shown a success message.",
        "One log line is written per submission: the time, the outcome, a short reference, and a one-way digest of the email address so repeat submissions can be recognised. The address itself, your name, your company and your message are not written to the log.",
        "Automated submissions are filtered with a decoy field and a signed timestamp, and repeated submissions are limited by a short-lived counter keyed to a hash of the connection address. None of this uses a cookie, a third-party bot service or any form of fingerprinting, and no raw address is retained.",
        "Submitting the form is the only way this website receives your details. Nothing on any other page collects them.",
      ],
    },
    {
      heading: "Separation from the application",
      items: [
        "This marketing website and the LumenSync application are different systems on different infrastructure. This site has no connection to the application's data.",
        "Product screenshots on this site come from a vendor-owned demonstration project containing synthetic data. No customer project, drawing, document or name appears anywhere on this site.",
        "If you use the LumenSync application, how that application handles your project data is governed by your agreement for it, not by this page.",
      ],
    },
  ],
  gatedIntro:
    "What a finished policy still needs. Each item creates an obligation, so each is a decision for the business and its counsel rather than something to be drafted here.",
  gated: [
    "The identity and registered details of the entity acting as data controller, and the address to write to.",
    "The stated purpose and lawful basis for handling demo requests.",
    "How long a demo request is kept at its destination, who inside the business can see it, and when it is deleted.",
    "How a person asks for a copy of their data, corrects it, or has it deleted — including the route to make that request and the response time committed to.",
    "Which privacy regimes are being addressed (for example UK/EU GDPR or US state privacy laws), and the rights described under each.",
    "The list of processors and sub-processors, and the position on any transfer of data between countries.",
    "The effective date, the versioning approach, and how a material change is communicated.",
    "Legal review and sign-off of the final wording before publication.",
  ],
};

export const TERMS: LegalPage = {
  eyebrow: "Legal",
  heading: "Terms and site use",
  lead: "The same split as the privacy page: what this website factually is, followed by the terms that still require review. Using the LumenSync application is governed by a separate agreement — this page is about the website you are reading.",
  gate: {
    label: "Not yet approved terms",
    body: "The description below is accurate. It is not a contract, and no term on this page has been reviewed by a lawyer. Final terms will be published before this site is reachable on its public domain.",
  },
  disclosureIntro: `What this website is, verified against the code on ${LEGAL_LAST_VERIFIED}.`,
  disclosures: [
    {
      heading: "An informational website",
      items: [
        "These pages describe the LumenSync product. There is no account to create here, nothing to buy, and no service delivered through this site.",
        "The only interactive element is the demo request form, which starts a conversation and nothing more. Submitting it does not create an agreement, a trial, or an obligation on either side.",
      ],
    },
    {
      heading: "What the content is, and is not",
      items: [
        "Product descriptions reflect the product as built at the time of writing. Software changes, and a description on a marketing page is not a specification or a warranty.",
        "Where the product's limits are relevant, this site states them rather than omitting them — including which certifications LumenSync does not hold.",
        "No pricing, service level, availability commitment or delivery date is offered anywhere on this site.",
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
      heading: "Ownership",
      items: [
        "The LumenSync name, the product interface shown in screenshots, and the text and design of this site belong to their owner.",
        "Any other product or company name used on this site is used only to describe the work LumenSync supports, and belongs to its respective owner.",
      ],
    },
  ],
  gatedIntro:
    "What finished terms still need. Each item is a commitment or a limitation of liability, so each requires review before it is published.",
  gated: [
    "The contracting entity, and how acceptance of these terms is established.",
    "Permitted use of the site and its content, and the restrictions that go with it.",
    "The intellectual property licence granted to a visitor, and its limits.",
    "Disclaimers, the warranty position, and the limitation of liability.",
    "Governing law and the venue for a dispute.",
    "How the terms may change, and what notice is given.",
    "How these terms relate to the separate agreement covering the application.",
    "Legal review and sign-off of the final wording before publication.",
  ],
};
