import type { StaticImageData } from "next/image";
import drawingFocus from "@/public/product/drawing-focus.webp";
import drawingViewer from "@/public/product/drawing-viewer.webp";
import checks from "@/public/product/checks.webp";
import rfiQueue from "@/public/product/rfi-queue.webp";
import rfiReview from "@/public/product/rfi-review.webp";
import fixtureSchedule from "@/public/product/fixture-schedule.webp";
import fieldDesktop from "@/public/product/field-desktop.webp";
import fieldMobile from "@/public/product/field-mobile.webp";
import closeoutReadiness from "@/public/product/closeout-readiness.webp";

/**
 * Registry of every real-product capture that may appear on the public site.
 *
 * PROVENANCE: all captures were taken 2026-08-15 from the LumenSync Demo
 * Organization → "Demo Retail Lighting Coordination" (job DEMO-2026-001), a
 * vendor-owned, non-customer tenant seeded with synthetic data (fixture types
 * A1…ZZ-SMOKE-116, "Demo Lighting Co.", a QA test drawing sheet E-101). No
 * customer project, drawing, document, name, address, or account information
 * is present. Captures were clipped below the app header/user chrome.
 *
 * `tests/public-assets.test.ts` enforces that every file under
 * `public/product/` is registered here and that this registry only lists
 * demo-tenant captures.
 */
export const PRODUCT_MEDIA_SOURCE =
  "LumenSync demo project (DEMO-2026-001) — synthetic data, not a customer project.";

export interface ProductMedia {
  file: string; // filename under public/product/
  image: StaticImageData;
  alt: string;
  surface: string; // which product surface this shows
}

export const productMedia = {
  drawingFocus: {
    file: "drawing-focus.webp",
    image: drawingFocus,
    surface: "Drawing viewer — focused fixture location",
    alt: "LumenSync drawing viewer zoomed to a lighting plan with fixture markers A1, C3 and E1; one C3 marker is highlighted as the focused location, with per-type schedule progress listed beside the sheet.",
  },
  drawingViewer: {
    file: "drawing-viewer.webp",
    image: drawingViewer,
    surface: "Drawing viewer — sheet E-101 with placements",
    alt: "LumenSync drawing viewer showing sheet E-101 with placed fixture markers by type, a placed/pending legend, and a schedule-progress panel listing each fixture type's placed count against its scheduled quantity.",
  },
  checks: {
    file: "checks.webp",
    image: checks,
    surface: "Coordination Checks — Drawing Count Check",
    alt: "LumenSync Coordination Checks card for the Drawing Count Check: scheduled quantity, schedule source, under-placed and over-placed counts, and active findings sorted by severity with Ack, Resolve, Ignore and Field Issue actions.",
  },
  rfiQueue: {
    file: "rfi-queue.webp",
    image: rfiQueue,
    surface: "RFIs — candidate queue",
    alt: "LumenSync RFI queue with Detected, Needs Review, Ready to Issue and Issued counters, filter chips for status, readiness, evidence and classification, and two system-generated candidates awaiting review.",
  },
  rfiReview: {
    file: "rfi-review.webp",
    image: rfiReview,
    surface: "RFI review workspace",
    alt: "LumenSync RFI review workspace: a draft banner stating review is required and nothing is sent until a manager issues it, discrepancy details, linked evidence items, and an issue-readiness panel listing blocking items.",
  },
  fixtureSchedule: {
    file: "fixture-schedule.webp",
    image: fixtureSchedule,
    surface: "Fixture schedule — types, scheduled and placed",
    alt: "LumenSync fixture schedule table listing fixture types with scheduled and placed quantities, beside import options for CSV or Excel, the schedule builder, and manual line entry.",
  },
  fieldDesktop: {
    file: "field-desktop.webp",
    image: fieldDesktop,
    surface: "Field — installation progress by fixture type",
    alt: "LumenSync Field view showing scheduled, wired and remaining totals and per-fixture-type progress cards, each linking to its location on drawing E-101.",
  },
  fieldMobile: {
    file: "field-mobile.webp",
    image: fieldMobile,
    surface: "Field — phone layout",
    alt: "LumenSync Field view on a phone: overall install progress, scheduled, wired and remaining counts, and fixture-type cards with 'View on E-101' links.",
  },
  closeoutReadiness: {
    file: "closeout-readiness.webp",
    image: closeoutReadiness,
    surface: "Closeout readiness — tracked categories",
    alt: "LumenSync closeout readiness view: an overall needs-review summary with counts of clear, needs-review, blocking and not-tracked categories, above a checklist covering field issues, RFIs, fixture cut-sheet evidence, drawings of record and consistency checks.",
  },
} satisfies Record<string, ProductMedia>;

export type ProductMediaKey = keyof typeof productMedia;
