import type { Boundary, Hero, Point } from "./types";

/**
 * Company / trust copy: /why-lumensync, /security, /about.
 *
 * Security claims are limited to behaviour that is actually implemented and
 * verifiable. No certifications, audits or third-party assessments are claimed.
 * The About page states no founding date, headcount, funding, customer count or
 * office location, because none of those are verified public facts.
 */

const DEMO_CTA = { href: "/request-demo", label: "Request a Demo" } as const;

/* ── /why-lumensync ───────────────────────────────────────── */

export const WHY = {
  hero: {
    eyebrow: "Why LumenSync",
    heading: "Because the lighting package is the one that bites you late.",
    lead: "Fixture counts, substitutions, missing cut sheets, controls that don't match the schedule — none of it is hard on its own. It goes wrong because the information lives in six places and only meets on the jobsite.",
    primary: DEMO_CTA,
    secondary: { href: "/product", label: "See the product" },
  } satisfies Hero,
  today: {
    eyebrow: "How it goes today",
    heading: "Spreadsheets, PDFs, email and memory.",
    lead: "Every contractor doing complex lighting has a version of this: a schedule someone exported in March, a set of drawings that has been revised twice since, a submittal folder nobody has reconciled, and one person who knows how it all fits together.",
    points: [
      {
        title: "The schedule and the drawings drift",
        body: "Quantities change on one and not the other, and nobody finds out until a type runs short in the field.",
      },
      {
        title: "Documentation is filed, not connected",
        body: "The approved cut sheet exists — in an email thread — and no one can say which types still don't have one.",
      },
      {
        title: "Questions get asked late",
        body: "The RFI that should have gone out at rough-in gets written the week the fixtures land.",
      },
      {
        title: "The field runs on a copy",
        body: "A printed sheet or an exported spreadsheet becomes the field's truth, and it stops matching the office within days.",
      },
    ] satisfies Point[],
  },
  different: {
    eyebrow: "What's different here",
    heading: "Four decisions the product is built on.",
    points: [
      {
        title: "The drawing is the index",
        body: "Not a folder tree. If a condition matters, it has a fixture type and — where a placement exists — a spot on a sheet you can open.",
      },
      {
        title: "Findings, not verdicts",
        body: "LumenSync tells you where the package disagrees with itself and leaves the judgement to you. It never presents an assumption as a fact.",
      },
      {
        title: "Preparation is automated; decisions aren't",
        body: "Drafting an RFI, comparing counts, staging a detected schedule — machine work. Approving, resolving and issuing — human work, every time.",
      },
      {
        title: "Nothing disappears",
        body: "Superseded findings are archived, issued RFIs keep their number and evidence, and schedule versions are retained. The record survives the argument.",
      },
    ] satisfies Point[],
  },
  monday: {
    eyebrow: "What actually changes",
    heading: "On a live job, in the first week.",
    points: [
      {
        title: "You can answer \"how many, and where?\"",
        body: "Scheduled against placed, per type, with the sheet one tap away.",
      },
      {
        title: "The open questions are a list",
        body: "Not a feeling. Findings and RFI candidates are counted, filtered and assigned a state.",
      },
      {
        title: "The field and the office read the same thing",
        body: "One record, one set of markers, one set of counts.",
      },
      {
        title: "Closeout starts on day one",
        body: "Cut-sheet evidence and open items are tracked as you go, not reconstructed at the end.",
      },
    ] satisfies Point[],
  },
  boundary: {
    heading: "Deliberately narrow.",
    lead: "LumenSync is not trying to run your company. It is trying to make one difficult part of the work legible.",
    is: [
      "Lighting coordination for complex commercial projects",
      "A shared record between the office and the field",
      "A review-first assist for finding and asking",
    ],
    isNot: [
      "A replacement for your project-management, accounting or scheduling systems",
      "A general document-management platform",
      "A guarantee of a coordination-free job",
    ],
  } satisfies Boundary,
} as const;

/* ── /security ────────────────────────────────────────────── */

export const SECURITY = {
  hero: {
    eyebrow: "Security",
    heading: "Your project data stays inside your project.",
    lead: "Security is designed into the application and the release process rather than bolted on afterwards. This page describes what LumenSync actually does today — no certifications are claimed and none are implied.",
    primary: { href: "/request-demo", label: "Ask a security question" },
    secondary: { href: "/product", label: "See the product" },
  } satisfies Hero,
  access: {
    eyebrow: "Access",
    heading: "Authenticated, scoped and checked on the server.",
    points: [
      {
        title: "Authenticated application access",
        body: "The LumenSync application requires a sign-in. There is no anonymous access to project data.",
      },
      {
        title: "Organisation and project boundaries",
        body: "Projects belong to an organisation, and membership determines what a signed-in person can reach. Cross-tenant access is denied — including when a URL is entered directly.",
      },
      {
        title: "Role-based authorisation",
        body: "Roles separate what a viewer, an installer and a project manager can do. Manager-only actions — approving a controls mapping, changing an RFI's status, issuing an RFI — are restricted to those roles.",
      },
      {
        title: "Enforced server-side",
        body: "Authorisation is applied on the server for reads and writes, not only by hiding buttons in the interface. Document and drawing access is granted through short-lived, per-request links rather than public URLs.",
      },
    ] satisfies Point[],
  },
  separation: {
    eyebrow: "Separation",
    heading: "This website and the application are different systems.",
    points: [
      {
        title: "The marketing site holds no customer data",
        body: "The site you are reading is a separate, statically-built application. It has no database connection, no customer records and no access to the LumenSync application.",
      },
      {
        title: "Product imagery is synthetic",
        body: "Every product screenshot on this site comes from a vendor-owned demonstration project with synthetic data. No customer project, drawing, document or name appears anywhere on this site.",
      },
      {
        title: "The application source is private",
        body: "The application repository is private. This public website repository contains no application code, credentials or configuration.",
      },
      {
        title: "Non-production environments are protected",
        body: "Preview deployments of this site sit behind access protection and are marked non-indexable, so unreleased work is not exposed to search engines or the public.",
      },
    ] satisfies Point[],
  },
  practice: {
    eyebrow: "Engineering practice",
    heading: "Changes are reviewed, tested and traceable.",
    points: [
      {
        title: "Gated releases",
        body: "Changes reach the main branch through pull requests with required automated checks — lint, type-check, unit tests, production build and end-to-end tests — and branch protection prevents force-pushes.",
      },
      {
        title: "Release provenance",
        body: "Deployed application builds are stamped with the exact commit they were built from, so what is running can always be identified.",
      },
      {
        title: "Auditability",
        body: "Consequential actions in the application — such as RFI status changes and issuance — are recorded with the acting user, the before and after state, and a timestamp.",
      },
      {
        title: "Transport security",
        body: "Both the application and this website are served over HTTPS by their hosting providers.",
      },
    ] satisfies Point[],
  },
  claims: {
    eyebrow: "What we don't claim",
    heading: "Plainly, so you can plan around it.",
    lead: "LumenSync is an independent product under active development. We would rather tell you what we haven't done than let a badge imply otherwise.",
    items: [
      "No SOC 2, ISO 27001, HIPAA, FedRAMP or PCI certification or attestation is held or in progress that we are announcing here.",
      "No third-party penetration test or security audit is being claimed.",
      "No specific encryption, retention, uptime or recovery guarantee is being made on this page.",
      "Detailed security architecture is shared under a direct conversation, not published publicly.",
    ],
  },
  contact: {
    heading: "Reporting a concern",
    body: "If you believe you have found a security issue in LumenSync, contact us through the demo request form and mark it as a security matter. Please do not post details publicly.",
    cta: { href: "/request-demo", label: "Contact us about security" },
  },
} as const;

/* ── /about ───────────────────────────────────────────────── */

export const ABOUT = {
  hero: {
    eyebrow: "About",
    heading: "Built by people who were losing the argument about fixture counts.",
    lead: "LumenSync is an independent software product focused on one job: making complex commercial lighting coordination legible. It exists because the people who built it kept watching the same avoidable problems arrive on the jobsite.",
    primary: DEMO_CTA,
    secondary: { href: "/why-lumensync", label: "Why LumenSync" },
  } satisfies Hero,
  origin: {
    eyebrow: "Where it came from",
    heading: "The problem came first.",
    lead: "Commercial lighting packages are unusually fragmented: a schedule from one source, drawings from another, submittals and cut sheets from a third, controls information from a fourth — all describing the same install, none of them reconciled against each other until something is wrong in the field. LumenSync was designed around that specific problem by people with hands-on commercial electrical experience, and shaped against real lighting packages rather than a whiteboard.",
    points: [
      {
        title: "Narrow on purpose",
        body: "We are not building a construction platform. Lighting coordination is a big enough problem to deserve its own tool.",
      },
      {
        title: "Grounded in real packages",
        body: "Features are shaped by what actual drawings and schedules look like — including the messy, scanned and incomplete ones.",
      },
      {
        title: "Independent",
        body: "LumenSync is its own product with its own roadmap. It is not a portal for, or an add-on to, any contractor's business.",
      },
    ] satisfies Point[],
  },
  principles: {
    eyebrow: "What we believe",
    heading: "Three rules we build against.",
    points: [
      {
        title: "Show the work",
        body: "If the product flags something, it shows the evidence and the numbers behind it. No unexplained scores, no black boxes.",
      },
      {
        title: "Never fake certainty",
        body: "Incomplete source data stays visibly incomplete. The product stops rather than guessing, and says what it could not determine.",
      },
      {
        title: "People make the calls",
        body: "Approving, resolving and issuing are human decisions. Software should do the assembly work and then get out of the way.",
      },
    ] satisfies Point[],
  },
  status: {
    heading: "Where we are now",
    body: "LumenSync is in active development and is being proven on real commercial lighting packages. We are working directly with the teams using it, which means the roadmap is still shaped by conversations rather than a form. If the problem on this site sounds like your problem, we would like to hear how you run it today.",
    cta: DEMO_CTA,
  },
} as const;
