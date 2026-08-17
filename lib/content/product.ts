import type { Boundary, Hero, Point, Step } from "./types";

/**
 * Product-area copy. Every capability described here is present in the shipped
 * LumenSync application (verified against the demo project, 2026-08-15).
 * Boundaries are stated explicitly so the site never implies CAD/BIM authoring,
 * building-automation control, or autonomous issuance.
 */

const DEMO_CTA = { href: "/request-demo", label: "Request a Demo" } as const;

/** One-line summary per product area, used by the product navigation grid. */
export const PRODUCT_AREA_BLURBS: Record<string, string> = {
  "/product/drawings":
    "Fixture placements, markers and status on the actual sheet — and the link back to it from everywhere else.",
  "/product/checks":
    "Compare the schedule against what's on the drawings and surface conditions that need a human look.",
  "/product/fixtures":
    "Fixture schedule, versions, types and documentation held as one reviewable record.",
  "/product/controls":
    "Controls drawings and mappings coordinated against the lighting package — review-gated, never auto-applied.",
  "/product/rfis":
    "Findings become drafted RFI candidates with evidence; a manager decides what gets issued.",
  "/product/field":
    "Install progress by fixture type and by drawing, usable on a phone in the building.",
  "/product/closeout":
    "A read-only readiness view of what's still open before you hand the job over.",
};

/* ── /product ─────────────────────────────────────────────── */

export const PRODUCT_OVERVIEW = {
  hero: {
    eyebrow: "Product",
    heading: "One lighting record, seven ways to work with it.",
    lead: "LumenSync holds the lighting package as a single project record — schedule, types, documentation, drawings, placements, findings, RFIs and field status — and keeps every part of it pointed at the same sheet.",
    primary: DEMO_CTA,
    secondary: { href: "/why-lumensync", label: "Why LumenSync" },
    note: "Built for electrical contractors, project managers, foremen and lighting-coordination teams.",
  } satisfies Hero,
  spine: {
    eyebrow: "The spine",
    heading: "The drawing is the connective tissue.",
    lead: "Most lighting tools organize documents. LumenSync organizes the project around where the work physically happens: fixture types are placed on the sheet, checks compare the schedule to those placements, findings link back to a location, RFIs carry that evidence, and the field crew works from the same markers.",
    points: [
      {
        title: "One record, not seven exports",
        body: "Schedule lines, fixture types, drawings, placements, findings, RFI candidates and field status all reference each other inside one project.",
      },
      {
        title: "Every finding has a place",
        body: "A coordination condition is tied to a fixture type and, where a placement exists, to a spot on a sheet you can open.",
      },
      {
        title: "People stay in control",
        body: "LumenSync prepares, compares and drafts. Approving a mapping, resolving a finding and issuing an RFI are all human actions.",
      },
    ] satisfies Point[],
  },
  flow: {
    eyebrow: "How the pieces connect",
    heading: "From the package you were handed to the job you hand over.",
    lead: "Each step writes into the same record the next step reads.",
    steps: [
      {
        label: "Bring the package in",
        detail: "Fixture schedule (CSV, Excel or detected from a PDF), fixture types, cut sheets, submittals, control drawings.",
      },
      {
        label: "Put it on the sheet",
        detail: "Drawing records with sheet number and revision; fixture types placed as markers.",
      },
      {
        label: "Run the checks",
        detail: "Schedule quantities against active placements; schedule types against what's actually on the drawings.",
      },
      {
        label: "Work the findings",
        detail: "Severity, counts and the delta — acknowledge, resolve, ignore, raise a field issue or start an RFI.",
      },
      {
        label: "Issue what needs asking",
        detail: "Drafted RFI candidates with evidence; a manager reviews and issues.",
      },
      {
        label: "Install and track",
        detail: "Status per placement rolls up by fixture type and by drawing for the field.",
      },
      {
        label: "Close it out",
        detail: "A readiness view of open field issues, RFIs, cut-sheet evidence, drawings of record and checks.",
      },
    ] satisfies Step[],
  },
  boundary: {
    heading: "What LumenSync is — and isn't.",
    lead: "The product is deliberately narrow. Lighting coordination is the whole job.",
    is: [
      "A lighting-specific coordination record for commercial projects",
      "A way to tie schedules, documents and controls information to drawings",
      "A review-first checking and RFI-preparation workflow",
      "A field view of install progress against the schedule",
    ],
    isNot: [
      "Construction-management, scheduling, accounting or procurement software",
      "A CAD or BIM authoring tool — LumenSync reads drawings, it doesn't draft them",
      "A building-automation or lighting-control system",
      "An estimating or takeoff platform",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/drawings ────────────────────────────────────── */

export const DRAWINGS = {
  hero: {
    eyebrow: "Drawings",
    heading: "Coordination becomes real when it's on the sheet.",
    lead: "Upload the lighting drawings, place fixture types where they belong, and everything else in LumenSync gains an address — a finding, a field issue or an RFI can open the exact sheet and location it came from.",
    primary: DEMO_CTA,
    secondary: { href: "/product/checks", label: "See how checks use it" },
  } satisfies Hero,
  viewer: {
    eyebrow: "Drawing viewer",
    heading: "Markers, status and the schedule side by side.",
    lead: "The viewer is built for coordination, not drafting: place a type, see what's placed against what's scheduled, and filter down to the question you're actually asking.",
    points: [
      {
        title: "Place by fixture type",
        body: "Pick a type, tap the sheet, add an optional label — the marker appears immediately and the type's placed count updates.",
      },
      {
        title: "Filter by type and status",
        body: "Show one type or all of them; filter to Not Started, Rough In or Wired to see what's left on that sheet.",
      },
      {
        title: "Zoom, pan and focus",
        body: "Scroll to zoom, drag to pan, and open a link that focuses a specific location so two people are looking at the same fixture.",
      },
      {
        title: "Schedule progress alongside",
        body: "A per-type progress panel sits next to the sheet: placed against scheduled quantity, for every type in the package.",
      },
    ] satisfies Point[],
  },
  records: {
    eyebrow: "Drawing records",
    heading: "Which sheet is current — and what's pointing at the old one.",
    lead: "Drawings are records, not just files: each carries a name, sheet number, revision and source. Drawing checks look at that set and flag duplicate current sheets, and placements that still reference a superseded or non-current drawing.",
    points: [
      {
        title: "Sheet number and revision",
        body: "Records carry the identifiers coordination actually uses, so a reference to \"E-101\" means something specific.",
      },
      {
        title: "Revision supersession",
        body: "When a sheet is superseded, LumenSync can flag field placements still tied to the previous revision instead of letting them quietly drift.",
      },
      {
        title: "Drawing sets",
        body: "Multi-sheet uploads can be split into individual drawing records so each sheet stands on its own.",
      },
    ] satisfies Point[],
  },
  audience: {
    eyebrow: "Who this is for",
    heading: "The same sheet, three different jobs.",
    items: [
      {
        title: "Project managers",
        body: "Answer \"where is this actually happening?\" without opening five PDFs, and send someone a link to the exact location.",
      },
      {
        title: "Foremen",
        body: "See what's placed on your sheet, what's still Not Started, and what changed since the last revision.",
      },
      {
        title: "Field crews",
        body: "Work from markers on the drawing instead of a separate spreadsheet that stopped matching weeks ago.",
      },
    ] satisfies Point[],
  },
  boundary: {
    heading: "Reading drawings, not drafting them.",
    is: [
      "Viewing uploaded lighting drawings with fixture markers and status",
      "Linking findings, RFIs and field work to a sheet and location",
      "Tracking sheet number, revision and supersession",
    ],
    isNot: [
      "CAD or BIM authoring, editing or export",
      "Full-document redlining or markup collaboration",
      "Automatic recognition of every symbol on a sheet",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/checks ──────────────────────────────────────── */

export const CHECKS = {
  hero: {
    eyebrow: "Coordination checks",
    heading: "Findings, not verdicts.",
    lead: "LumenSync compares the current fixture schedule against what's actually placed on the drawings and reports where they disagree. Every result is a condition for a person to review — labeled as a potential coordination issue, never as a confirmed error.",
    primary: DEMO_CTA,
    secondary: { href: "/product/rfis", label: "From finding to RFI" },
  } satisfies Hero,
  engines: {
    eyebrow: "What gets compared",
    heading: "Two checks, run against the current package.",
    lead: "Both read the schedule source in use on the project and the active placements on the current drawings. Voided placements are excluded; archived findings stay read-only.",
    items: [
      {
        title: "Drawing count check",
        body: "Fixture schedule quantities against active drawing placements: under-placed and over-placed types, unlinked placements, and placements whose type no longer exists in the schedule.",
      },
      {
        title: "Schedule vs drawing reconciliation",
        body: "Fixture-type coverage across the project: types scheduled but never placed, placements with no matching schedule line, and excess placements per type.",
      },
    ] satisfies Point[],
  },
  finding: {
    eyebrow: "Anatomy of a finding",
    heading: "Enough context to decide in one screen.",
    points: [
      {
        title: "Severity and the numbers",
        body: "Each finding names the fixture type, the condition, a severity, the scheduled and placed counts, and the delta between them.",
      },
      {
        title: "Actions in place",
        body: "Acknowledge it, resolve it, ignore it, raise a field issue, or start an RFI candidate that carries the finding's evidence with it.",
      },
      {
        title: "A route back to the drawing",
        body: "Where the condition involves a placement, the finding links straight to that location on the sheet.",
      },
      {
        title: "Re-run without losing history",
        body: "Run the check again after a schedule or placement change: results that no longer apply are superseded and archived rather than silently deleted, and run history is kept.",
      },
    ] satisfies Point[],
  },
  honesty: {
    label: "Fail-closed by design",
    body: "If the schedule source is unclear or the underlying data can't be read, LumenSync says so and stops. It does not guess a quantity, invent a match, or present an assumption as a result. Checks are an assist for review — they do not certify that a package is correct.",
  },
  boundary: {
    heading: "What the checks do and don't claim.",
    is: [
      "Comparing project data that is already in LumenSync",
      "Flagging conditions that merit human review",
      "Keeping a run history and superseding stale findings",
    ],
    isNot: [
      "A guarantee that every coordination problem is detected",
      "Code, photometric or engineering review",
      "Automatic correction of the schedule or the drawings",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/fixtures ────────────────────────────────────── */

export const FIXTURES = {
  hero: {
    eyebrow: "Fixture information",
    heading: "The schedule, the types and the paperwork — one record.",
    lead: "Import the fixture schedule, keep it versioned, and hold each fixture type's specification and documentation against it. Everything the checks, the drawings and the field crew use comes from here.",
    primary: DEMO_CTA,
    secondary: { href: "/product/checks", label: "How checks use this" },
  } satisfies Hero,
  intake: {
    eyebrow: "Getting the schedule in",
    heading: "Four ways in — all of them reviewable.",
    lead: "Nothing is committed to the authoritative schedule until a person approves it.",
    steps: [
      {
        label: "Import CSV or Excel",
        detail: "Column mapping and validation, with version history kept.",
      },
      {
        label: "Add lines manually",
        detail: "Type code and scheduled quantity, straight into the current schedule.",
      },
      {
        label: "Detect from a PDF",
        detail: "Scan an uploaded submittal or drawing for a fixture schedule; detected rows are staged for review.",
      },
      {
        label: "OCR selected pages",
        detail: "For scanned or unreadable sheets, OCR up to a few pages — again, staged for review, never committed automatically.",
      },
    ] satisfies Step[],
  },
  record: {
    eyebrow: "What a fixture record holds",
    heading: "The fields coordination actually argues about.",
    lead: "Fixture types carry a type code and description plus manufacturer, model or catalog number, wattage and voltage. Where the source documents provide them, additional characteristics such as lumens, color temperature, CRI, mounting and control behavior are held on the same record.",
    points: [
      {
        title: "Schedule and versions",
        body: "The committed schedule is a version: quantities per type, with earlier versions retained so you can see what changed.",
      },
      {
        title: "Specification fields",
        body: "Manufacturer, model, watts and voltage sit with the type — the same values a check or a submittal review needs.",
      },
      {
        title: "Cut sheets and submittals",
        body: "Approved cut-sheet evidence is tracked per fixture type and feeds the closeout readiness view.",
      },
      {
        title: "Placement context",
        body: "Each type shows how many are scheduled and how many are placed on drawings, so gaps are visible in the same table.",
      },
    ] satisfies Point[],
  },
  gaps: {
    label: "Missing information is a finding too",
    body: "Real packages arrive incomplete. LumenSync does not fill in a blank wattage, mounting type or cut sheet — it keeps the gap visible, and a missing field can itself become a coordination finding or an RFI candidate for the design team.",
  },
  boundary: {
    heading: "A coordination record, not a catalog.",
    is: [
      "Holding the project's fixture schedule, types and documentation",
      "Versioning the schedule and staging detected rows for review",
      "Tracking which types still lack approved documentation",
    ],
    isNot: [
      "A manufacturer product database or specification service",
      "Photometric calculation or lighting design",
      "Pricing, procurement or purchase-order management",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/controls ────────────────────────────────────── */

export const CONTROLS = {
  hero: {
    eyebrow: "Controls coordination",
    heading: "Keep the controls package talking to the lighting package.",
    lead: "Control drawings, wiring diagrams and controls documents live with the project, and zone assignments are mapped against the fixture schedule — so a mismatch between what's scheduled and what the controls package says surfaces as a coordination question, not a startup surprise.",
    primary: DEMO_CTA,
    secondary: { href: "/product/checks", label: "How checks work" },
  } satisfies Hero,

  /** Hero diagram labels. Conceptual, not a product capture. */
  diagram: {
    frame: "Controls coordination",
    schedule: { title: "Fixture schedule", tag: "Types, quantities, scheduled behavior" },
    controls: { title: "Controls package", tag: "Zones, wiring, control documents" },
    mapping: { title: "Approved mapping", tag: "Manager-entered, review-gated" },
    outcome: "A disagreement becomes a coordination finding, never a silent change.",
    description:
      "The fixture schedule and the controls package are compared through a mapping that a manager enters and someone with authority approves. Where the two disagree, LumenSync raises a coordination finding rather than changing anything.",
  },

  documents: {
    eyebrow: "Controls documents",
    heading: "Everything controls-related in one place.",
    points: [
      {
        title: "Control drawings",
        body: "Upload wiring diagrams, panel schedules and risers directly to the project's control drawings section.",
      },
      {
        title: "Routed from Files",
        body: "Any file classified as a control drawing or controls document in the project's Files tab appears here automatically — no duplicate uploads.",
      },
      {
        title: "Kept with the lighting record",
        body: "Controls documentation sits beside the fixture schedule and the drawings it relates to, not in a separate folder tree.",
      },
    ] satisfies Point[],
  },
  mappings: {
    eyebrow: "Controls mappings",
    heading: "Manager-entered, review-gated, never auto-applied.",
    lead: "Mappings tie fixture types to control zones and control behavior. They are entered by a manager, start in a needs-review state, and only approved mappings feed the coordination checks.",
    steps: [
      { label: "Enter", detail: "A manager records the mapping against the controls package." },
      { label: "Review", detail: "It sits in Needs review until someone with authority confirms it." },
      { label: "Approve", detail: "Approved mappings — and only approved mappings — feed coordination checks." },
      { label: "Compare", detail: "Scheduled control behavior against the mapped controls package; mismatches become findings to review." },
    ] satisfies Step[],
    note: "Nothing entered here is sent to the design team or to a controls vendor. It stays inside the project record until a person issues an RFI.",
  },
  boundary: {
    heading: "Coordinating controls information is not operating a control system.",
    lead: "LumenSync helps you reconcile what the documents say. It never touches a live system.",
    is: [
      "Holding control drawings and controls documents with the project",
      "Mapping fixture types to control zones and behavior, under review",
      "Flagging mismatches between the schedule and the controls package",
    ],
    isNot: [
      "A building-automation system or lighting-control platform",
      "Device programming, addressing, scene setup or commissioning",
      "A connection to any live controls hardware or network",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/rfis ────────────────────────────────────────── */

export const RFIS = {
  hero: {
    eyebrow: "RFIs",
    heading: "LumenSync does the preparation. You decide what gets asked.",
    lead: "Coordination findings become RFI candidates with their evidence attached and a draft question written. They sit in a queue until a manager reviews, completes and issues them — nothing leaves the project on its own.",
    primary: DEMO_CTA,
    secondary: { href: "/product/checks", label: "Where findings come from" },
  } satisfies Hero,
  workflow: {
    eyebrow: "The workflow",
    heading: "Finding → evidence → draft → review → issue.",
    steps: [
      { label: "Finding", detail: "A check surfaces a discrepancy, or a person raises one." },
      { label: "Evidence", detail: "Schedule rows, scan results and drawing references are attached to the candidate." },
      { label: "Draft", detail: "A structured issue summary and formal question are prepared for review." },
      { label: "Manager review", detail: "Readiness gates: evidence present, drawing reference attached, question written." },
      { label: "Issue", detail: "A manager issues it; a permanent RFI number is assigned and the history is kept." },
    ] satisfies Step[],
  },
  queue: {
    eyebrow: "The queue",
    heading: "See what's real before it becomes an email.",
    lead: "Candidates are counted by state — detected, needs review, ready to issue, issued — and filtered by readiness, evidence, key fields and classification, so a PM can work the list instead of re-deriving it.",
    points: [
      {
        title: "Confidence, stated plainly",
        body: "System-generated candidates carry a confidence indicator and a low-confidence label where the underlying evidence is weak. The number is a review aid, not a promise.",
      },
      {
        title: "Blocking issues are explicit",
        body: "A candidate that can't be issued says why — for example a missing drawing reference or an unreviewed status — instead of failing silently at the end.",
      },
      {
        title: "Duplicates are superseded",
        body: "Re-running a checker supersedes stale candidates for the same condition rather than stacking near-identical RFIs.",
      },
      {
        title: "Export when it's issued",
        body: "Issued RFIs keep their number, evidence and status history, and can be downloaded as a PDF to send through your normal channel.",
      },
    ] satisfies Point[],
  },
  honesty: {
    label: "Human issuance, always",
    body: "Every candidate opens with a draft banner stating that LumenSync generated it and that nothing is sent until a manager issues it. Issuance happens in one place, by a person with authority on the project.",
  },
  boundary: {
    heading: "Preparation, not automation.",
    is: [
      "Drafting RFI candidates from coordination findings",
      "Attaching evidence and drawing references",
      "Manager-gated issuance with a permanent number and audit history",
      "PDF export of an issued RFI",
    ],
    isNot: [
      "Sending RFIs to the design team on your behalf",
      "Automatic or unattended issuance",
      "A live integration with a GC's RFI system",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/field ───────────────────────────────────────── */

export const FIELD = {
  hero: {
    eyebrow: "Field",
    heading: "What's left, by type and by sheet — on the phone in your pocket.",
    lead: "The field view runs off the same schedule and the same drawings as the office. Scheduled, wired, remaining. Open the sheet, find the marker, keep going.",
    primary: DEMO_CTA,
    secondary: { href: "/product/drawings", label: "See the drawing viewer" },
    note: "Written for foremen and field leadership, not for a procurement committee.",
  } satisfies Hero,
  progress: {
    eyebrow: "Progress you can trust",
    heading: "Counted from placements, not from a status meeting.",
    lead: "Every placement on a drawing carries a status — Not Started, Rough In, Wired — and that rolls up automatically: per fixture type, per drawing, and across the job.",
    points: [
      {
        title: "By fixture type",
        body: "Scheduled, wired and remaining for each type, with the types that aren't on a drawing yet called out instead of hidden.",
      },
      {
        title: "By drawing",
        body: "A by-drawing view for walking a floor: what's on this sheet, what's roughed in, what's trimmed out.",
      },
      {
        title: "Straight to the sheet",
        body: "Each type links to the drawing it's placed on, so \"where are the remaining twelve?\" takes one tap.",
      },
      {
        title: "Field issues from the field",
        body: "Hit something that doesn't match the drawing? A field issue carries the type and location back to the office — and shows up in the closeout readiness view until it's dealt with.",
      },
    ] satisfies Point[],
  },
  jobsite: {
    eyebrow: "Usable in the building",
    heading: "Designed for a phone, a glove and bad lighting.",
    points: [
      {
        title: "One-hand layout",
        body: "Progress, counts and type cards stack down a phone screen with tap targets sized for the jobsite.",
      },
      {
        title: "The same numbers as the office",
        body: "No separate field spreadsheet, no re-keying, no arguing about whose copy is current.",
      },
      {
        title: "Everything anchored to a drawing",
        body: "Fixture markers, not a list of codes — you look at the sheet you're already standing under.",
      },
    ] satisfies Point[],
  },
  boundary: {
    heading: "A field view of the lighting record.",
    is: [
      "Install progress by fixture type and by drawing",
      "Placement status updated against the sheet",
      "Field issues raised with type and location attached",
    ],
    isNot: [
      "Timekeeping, payroll, manpower or daily-report software",
      "An offline-first application",
      "A replacement for the contract drawings or approved submittals",
    ],
  } satisfies Boundary,
} as const;

/* ── /product/closeout ────────────────────────────────────── */

export const CLOSEOUT = {
  hero: {
    eyebrow: "Closeout",
    heading: "Know what's still open before you say you're done.",
    lead: "Closeout readiness is a read-only view built from the project's own data: open field issues, unconfirmed RFI candidates, fixture types missing cut-sheet evidence, drawings of record on file, and the state of the last checks run.",
    primary: DEMO_CTA,
    secondary: { href: "/product/checks", label: "How checks feed this" },
  } satisfies Hero,
  readiness: {
    eyebrow: "Closeout readiness",
    heading: "Five categories, one honest summary.",
    lead: "Each category is Ready, Needs review, Blocking or Not tracked, with the count that produced it. Nothing here is a self-assessment — it reads the same records the rest of the project runs on.",
    items: [
      {
        title: "Field issues",
        body: "Issues raised from the field that are still open for review.",
      },
      {
        title: "RFIs",
        body: "Issued RFIs and any candidates still waiting to be confirmed or dismissed.",
      },
      {
        title: "Fixture cut-sheet evidence",
        body: "Fixture types that still have no approved cut-sheet evidence attached.",
      },
      {
        title: "Drawings of record",
        body: "Whether the project has drawing records on file to hand over against.",
      },
      {
        title: "Consistency checks",
        body: "Whether the last coordination run finished clean or left open findings.",
      },
    ] satisfies Point[],
    caption:
      "Closeout readiness — five tracked categories with the counts behind each status.",
  },
  outcome: {
    eyebrow: "Why it lands better",
    heading: "The handover is only as good as the record behind it.",
    points: [
      {
        title: "Unresolved work is visible",
        body: "Open items are counted in one place instead of being reconstructed from memory and email in the last week.",
      },
      {
        title: "Evidence stays attached",
        body: "Issued RFIs keep their number, evidence and status history; superseded findings are archived rather than erased.",
      },
      {
        title: "Traceable decisions",
        body: "What was asked, what came back, and what was installed all sit against the same fixture types and drawings.",
      },
    ] satisfies Point[],
  },
  boundary: {
    heading: "A readiness view, not a document generator.",
    is: [
      "A read-only summary of open items across the lighting record",
      "Counts drawn from field issues, RFIs, cut-sheet evidence, drawings and checks",
      "Traceability of what was raised and how it resolved",
    ],
    isNot: [
      "Automatic production of O&M manuals, warranties or as-built drawing sets",
      "A contractual certification that a project is complete",
      "A substitute for the closeout requirements in your contract documents",
    ],
  } satisfies Boundary,
} as const;
