/**
 * Homepage copy + section order (single source of truth for app/page.tsx and
 * the homepage tests). Copy rules: concrete, contractor-legible, no fabricated
 * metrics/customers/claims; every capability named here is visible in the
 * shipped product (Demo project, 2026-08-15).
 */

export const HERO = {
  eyebrow: "Lighting coordination for commercial projects",
  headline: "Complex Lighting Installs, Finally Tied to the Drawings.",
  headlineAccent: "Drawings.",
  lead: "LumenSync ties fixture schedules, cut sheets, submittals, controls, checks, RFIs and field status back to the actual lighting drawings — so coordination gaps show up on the sheet, before they show up on the job.",
  audience:
    "Built for electrical contractors, project managers, foremen and lighting-coordination teams.",
  primaryCta: { href: "/request-demo", label: "Request a Demo" },
  secondaryCta: { href: "#how-it-works", label: "See how it works" },
  mediaCaption:
    "Drawing viewer — a coordination finding focused on its fixture location, with schedule progress by type alongside the sheet.",
} as const;

/** Section ids in display order (asserted by tests). */
export const HOMEPAGE_SECTION_ORDER = [
  "hero",
  "problem",
  "how-it-works",
  "drawings",
  "checks",
  "rfis",
  "field",
  "fixtures",
  "closeout",
  "cta",
] as const;

export type HomepageSectionId = (typeof HOMEPAGE_SECTION_ORDER)[number];

export const PROBLEM = {
  eyebrow: "The problem",
  heading: "A lighting package is never one document.",
  lead: "Fixture schedules, drawings, submittals, controls, revisions, RFIs and field notes all describe the same install — but they live in different files, change on different days, and get reconciled by whoever has time. That's where quantity mismatches, wrong fixtures and unplaced types slip through.",
  pieces: [
    "Lighting drawings",
    "Fixture schedule",
    "Cut sheets & submittals",
    "Controls information",
    "Revisions",
    "Discrepancies & RFIs",
    "Field status",
    "Closeout evidence",
  ],
  outcome: "One connected project record, tied to the drawings",
} as const;

export const WORKFLOW = {
  eyebrow: "How it works",
  heading: "One connected workflow — not seven separate modules.",
  lead: "Every step reads from and writes to the same lighting record, so a finding can point at a drawing location, an RFI can carry its evidence, and field status can roll up by sheet.",
  steps: [
    {
      label: "Documents & fixture info",
      detail: "Fixture schedule, fixture types, cut sheets, submittals, controls.",
    },
    {
      label: "Drawings & placements",
      detail: "Sheets with fixture markers by type; placed vs. pending.",
    },
    {
      label: "Coordination checks",
      detail: "Schedule vs. drawing counts, missing data, controls conflicts.",
    },
    {
      label: "Actionable findings",
      detail: "Severity, affected type, and a link to the spot on the drawing.",
    },
    {
      label: "RFIs",
      detail: "Drafted from findings with evidence; issued only by a manager.",
    },
    {
      label: "Field execution",
      detail: "Rough-in and wired status by type and by drawing.",
    },
    {
      label: "Closeout",
      detail: "Unresolved work, history and traceability in one place.",
    },
  ],
} as const;

export const DRAWINGS = {
  eyebrow: "Drawing-centered coordination",
  heading: "Everything points back to a spot on the sheet.",
  lead: "Fixture types are placed directly on the lighting drawings. Placements feed schedule progress, checks compare them against the schedule, and every finding or field item can be opened right where it lives on the sheet.",
  points: [
    {
      title: "Placements by fixture type",
      body: "Tap a type, tap the drawing. Markers show placed vs. pending and roll up per type against the scheduled quantity.",
    },
    {
      title: "Findings that open on the drawing",
      body: "A check result or field issue links to the affected location, so the conversation starts at the fixture — not in a spreadsheet.",
    },
    {
      title: "Sheets, revisions and sets",
      body: "Drawing records carry sheet number and revision; drawing checks flag duplicate current sheets and placements that reference superseded drawings.",
    },
  ],
  caption:
    "Drawing viewer — sheet E-101 with placed markers, placed/pending legend and per-type schedule progress.",
  cta: { href: "/product/drawings", label: "More about drawing coordination" },
} as const;

export const CHECKS = {
  eyebrow: "Coordination checks",
  heading: "LumenSync compares the package to itself — and tells you where it disagrees.",
  lead: "Checks read the current fixture schedule and the current drawing placements and flag conditions worth a human look: under- or over-placed types, types on the schedule but not on the drawings, missing wattage or mounting data, and drawing/version problems.",
  points: [
    {
      title: "Findings, not verdicts",
      body: "Each finding carries a severity, the affected type, scheduled vs. placed counts and the delta. Findings are labeled as potential issues and require human review — they do not indicate confirmed errors.",
    },
    {
      title: "Act on it in place",
      body: "Acknowledge, resolve or ignore a finding, raise a field issue, or start an RFI — with the finding's evidence attached.",
    },
    {
      title: "Re-run as the package changes",
      body: "New schedule version or new placements? Run the check again. Findings that no longer apply are superseded, not silently deleted.",
    },
  ],
  honesty: {
    label: "Fail-closed by design",
    body: "When the schedule source is unclear or data is missing, LumenSync says so and stops — it does not guess a quantity or fabricate a match.",
  },
  caption:
    "Coordination Checks — Drawing Count Check with scheduled quantity, under-placed count and active findings by severity.",
  cta: { href: "/product/checks", label: "More about checks" },
} as const;

export const RFIS = {
  eyebrow: "RFIs",
  heading: "From finding to issued RFI — with a manager's hand on the switch.",
  lead: "LumenSync drafts RFI candidates from coordination findings and attaches the evidence. People review, complete and issue them. Nothing is sent until a manager issues it.",
  steps: [
    { label: "Finding", detail: "A check surfaces a discrepancy." },
    { label: "Evidence", detail: "Schedule rows, drawing references, scan results attached." },
    { label: "Draft", detail: "Structured question and issue summary written for review." },
    { label: "Manager review", detail: "Readiness gates: evidence, drawing reference, formal question." },
    { label: "Issue", detail: "A permanent RFI number is assigned; history is kept." },
  ],
  honesty: {
    label: "Review required",
    body: "Every candidate opens with a draft banner. Missing drawing references or unreviewed candidates block issuance until a person clears them.",
  },
  caption:
    "RFI review workspace — draft banner, discrepancy details, linked evidence and the issue-readiness panel.",
  cta: { href: "/product/rfis", label: "More about RFIs & resolution" },
} as const;

export const FIELD = {
  eyebrow: "Field",
  heading: "The same record, in the foreman's pocket.",
  lead: "Field shows install progress by fixture type — scheduled, wired, remaining — and links each type to its sheet. No separate field version of the project, no re-keying.",
  points: [
    {
      title: "Progress by type and by drawing",
      body: "Rough-in and wired counts per fixture type, with a by-drawing view for walking a floor.",
    },
    {
      title: "\"View on E-101\"",
      body: "Every type card opens the drawing it belongs to, so the crew sees the same markers the PM sees.",
    },
    {
      title: "Field issues from the finding",
      body: "A coordination finding can become a field issue in one step, carrying the type and location with it.",
    },
  ],
  caption:
    "Field — phone layout showing overall progress, scheduled/wired/remaining and per-type cards with drawing links.",
  cta: { href: "/product/field", label: "More about the Field Hub" },
} as const;

export const FIXTURES = {
  eyebrow: "Fixture information",
  heading: "One fixture record — schedule, type, documents, controls.",
  lead: "The fixture schedule is versioned and importable from CSV or Excel. Each fixture type carries manufacturer, model, watts and voltage. Cut sheets, submittals and controls information hang off the same record.",
  points: [
    {
      title: "Schedule & versions",
      body: "Import a schedule, add lines manually, or build one from a document with the schedule builder — candidates are staged for review before anything is committed.",
    },
    {
      title: "Fixture types",
      body: "Type code, description, manufacturer, model number, watts and voltage — the fields checks and the field crew actually use.",
    },
    {
      title: "Cut sheets, submittals, controls",
      body: "Approved documentation and controls relationships live with the fixture type, so a missing approved cut sheet is a finding, not a surprise.",
    },
  ],
  caption:
    "Fixture schedule — types with scheduled and placed quantities, alongside import, schedule-builder and manual entry.",
  cta: { href: "/product/fixtures", label: "More about fixture intelligence" },
} as const;

export const CLOSEOUT = {
  eyebrow: "Closeout & confidence",
  heading: "Finish with fewer surprises and a record you can hand over.",
  lead: "Because findings, RFIs and field status share one record, what's unresolved is visible for the whole job — and what was decided, when and by whom is preserved.",
  outcomes: [
    {
      title: "Fewer coordination surprises",
      body: "Quantity mismatches, unplaced types and missing data surface while there is still time to ask.",
    },
    {
      title: "Clearer unresolved work",
      body: "Open findings, RFI candidates and remaining installs are counted in the same place, not reconstructed from email.",
    },
    {
      title: "Traceability",
      body: "Issued RFIs keep their number, evidence and status history; findings that no longer apply are superseded, not erased.",
    },
    {
      title: "A better handoff",
      body: "Closeout works from the same drawings, schedule and documents the project was built on.",
    },
  ],
  disclaimer:
    "LumenSync is a project coordination aid. It does not replace contract drawings, specifications, approved submittals, RFIs, engineer-of-record direction, manufacturer instructions or applicable codes.",
} as const;

export const FINAL_CTA = {
  heading: "See LumenSync on a lighting package like yours.",
  body: "We'll walk through drawings, checks, RFIs and field status on a real project workflow — no slideware.",
  primary: { href: "/request-demo", label: "Request a Demo" },
  secondary: { href: "/contact", label: "Contact us" },
} as const;

/**
 * Plain-text terms that must never appear on the public site: unapproved
 * parent-brand framing, legacy customer routes, and hype vocabulary.
 */
export const FORBIDDEN_PUBLIC_TERMS = [
  "TradeSync",
  "project-login",
  "revolutionary",
  "game-changing",
  "single pane of glass",
  "AI-powered",
] as const;

/**
 * SHA-256 digests of additional forbidden identifiers (customer / private
 * names and legacy customer routes). Stored as hashes so the public repository
 * does not itself publish the names. Matching: lowercase the text, split into
 * alphanumeric tokens, hash every 1–3 token concatenation, compare.
 * See `tests/forbidden-terms.ts`.
 */
export const FORBIDDEN_TERM_DIGESTS: readonly string[] = [
  "5066383a8f60e6fdf54b72301848a8e8faa243d609d6fc918fc8add3329256c7",
  "24ec3dbcf80772bb2e19b3fd8ddf50b8ab705d264eb534e43d602cc793f46f5a",
  "ff485a611463861dc3b1d2ecb0fb590dd1e7b973130c86e3828b862b45e9b493",
  "d3326f7a091468ad8963bb5118d3ae47333ca4a69874711f0dd0e86ac1c44da4",
  "caaeac3184e90c7f8587d692f03105bfe111982ab663ed6c6e1d0237eb3420f2",
  "dab591faba53fefd5a87e3c635edb4e8f994c7750393acfde3e50665e4f13c18",
  "fc45bcb49826ef1098c41b6472c39d3d05cfa5f1124b52c95448155f8eac1950",
  "bbd4b13180c5305756bdf01d350830c10afaee85d3563163ae5ad4fe59eef74b",
  "ef8dc5d70e256f21dfcecb56914d8d70257fa0856bf9aa7954aefc16376a46bf",
  "de48e9def452a512de133fc2ad4094b6d0579143c06fca6dca41a40c1deb70be",
  "338bcb252079b5bd03fd0c35f590b514a12f6fe82ac1f58fa2c4a86349b6ace3",
  "a7328a7522d0b6f18e033811dc23631c8b691233b28988bd7b5fb5bc4e14cb85",
];
