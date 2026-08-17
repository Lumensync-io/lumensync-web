import type { Boundary, Hero, Point, Step } from "./types";

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
    heading: "Built to protect the work behind every project.",
    lead: "LumenSync keeps project access controlled, scoped, and enforced by the application — not by assumptions in the browser. From drawings and fixture information to project decisions and approvals, access is limited to the people who are authorized to work with it.",
    primary: { href: "/request-demo", label: "Request a Demo" },
    secondary: { href: "/contact", label: "Ask a Security Question" },
    note: "Have a specific IT or security requirement? We'll tell you what LumenSync supports today and what it does not.",
  } satisfies Hero,

  /** Hero diagram labels. Rendered as a figure, described for screen readers. */
  diagram: {
    frame: "LumenSync Project",
    description:
      "A request from an authenticated user passes through server-side authorization before any protected project data is returned. There is no direct path from the browser to project data.",
    user: { title: "Authenticated User", tag: "Authenticated" },
    authorization: { title: "Server Authorization", tag: "Checked server-side" },
    data: { title: "Protected Project Data", tag: "Scoped" },
    denied: "No direct path from the browser to project data.",
  },

  access: {
    eyebrow: "Access",
    heading: "Security starts with access.",
    lead: "LumenSync is designed around a simple principle: project information should only be available to the people who are authorized to use it.",
    points: [
      {
        title: "Authenticated access",
        body: "The LumenSync application requires authenticated access before project information is made available. Authorization is enforced on the server so access decisions do not depend solely on what is shown or hidden in the browser.",
      },
      {
        title: "Project-scoped permissions",
        body: "Access is evaluated within the context of the organization, project, user, and requested action. Users receive access to the information and workflows appropriate to their authorized scope rather than unrestricted access across the system.",
      },
      {
        title: "Restricted actions",
        body: "Higher-impact actions are restricted to the roles permitted to perform them. That includes controlled project-management actions and other workflows where LumenSync requires additional authorization before accepting a change.",
      },
      {
        title: "Protected documents",
        body: "Project documents and drawings are not intended to function as unrestricted public files. Access is granted through controlled application workflows rather than exposing permanent public document links.",
      },
    ] satisfies Point[],
  },

  release: {
    eyebrow: "Release discipline",
    heading: "Security is part of how we build.",
    lead: "Security controls are only useful if the software continues to enforce them after every release. That is why LumenSync treats release discipline as part of the security model.",
    steps: [
      { label: "Review", detail: "Changes are read and approved before they can reach the release branch." },
      { label: "Test", detail: "Automated checks run against the change, not just against the developer's machine." },
      { label: "Release", detail: "Only reviewed, checked code is promoted to production." },
      { label: "Verify", detail: "The running release is confirmed against the code that was approved." },
      { label: "Roll back", detail: "A known-good release stays available until the new one is accepted." },
    ] satisfies Step[],
    points: [
      {
        title: "Reviewed changes",
        body: "Production changes move through a controlled source and review process before release.",
      },
      {
        title: "Automated verification",
        body: "Builds are checked with automated testing before production deployment, including tests that exercise authentication, authorization, application behavior, accessibility, and browser workflows.",
      },
      {
        title: "Production provenance",
        body: "Production releases are verified against the code that was reviewed and approved so the team can establish exactly what version is serving customers.",
      },
      {
        title: "Controlled rollback",
        body: "Known-good deployments are preserved during release verification so production can be rolled back if a new release does not meet acceptance requirements.",
      },
    ] satisfies Point[],
  },

  failSafe: {
    eyebrow: "Failure behavior",
    heading: "Designed to fail safely.",
    lead: "When LumenSync cannot confirm that an action should succeed, the preferred behavior is to stop rather than guess. That approach is used throughout sensitive workflows where a false success could create a larger operational problem.",
    examplesIntro: "Examples include:",
    examples: [
      "authorization checks before protected actions",
      "validation before accepting important workflow changes",
      "rejecting invalid or incomplete requests rather than silently accepting them",
      "surfacing delivery failures instead of presenting a false confirmation",
    ],
    closing:
      "The objective is straightforward: when the system cannot safely complete an operation, the user should know.",
    panel: {
      heading: "When LumenSync cannot safely complete an action",
      steps: [
        "Stop",
        "Reject the invalid request",
        "Preserve the current state",
        "Tell the user what happened",
      ],
    },
  },

  separation: {
    eyebrow: "Separation",
    heading: "The public website is separated from the application.",
    lead: "The website you are reading is not the LumenSync project application. The public website does not provide public access to customer projects, drawings, fixture information, or application records. Project work takes place inside the authenticated LumenSync application.",
    website: {
      title: "Marketing website",
      items: [
        "Public product information",
        "Documentation and legal content",
        "Demo-request functionality",
        "No public project access",
      ],
    },
    application: {
      title: "LumenSync application",
      items: [
        "Authenticated users",
        "Project workflows",
        "Drawings and fixture information",
        "Authorized project actions",
      ],
    },
    note: "This separation reduces the amount of application functionality exposed through the public marketing surface.",
  },

  assurance: {
    heading: "We make security claims carefully.",
    paragraphs: [
      "Security language should describe what a product actually does — not what a badge, acronym, or marketing phrase might imply. LumenSync does not currently advertise third-party security certifications or attestations that it has not completed.",
      "As the platform and customer requirements evolve, additional independent security reviews and assurance programs may become appropriate. Any such claims will be published only after they are supported by completed work.",
    ],
  },

  cta: {
    heading: "Have a security requirement?",
    body: "If your organization has a specific security, IT, access-control, procurement, or deployment requirement, talk with us before making assumptions about what LumenSync supports. We would rather give you a precise answer than a broad promise.",
    primary: { href: "/contact", label: "Ask a Security Question" },
    secondary: { href: "/request-demo", label: "Request a Demo" },
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
