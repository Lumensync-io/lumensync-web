/**
 * Central site configuration: canonical URL, navigation IA, and route registry.
 * The information architecture here mirrors the approved
 * "LumenSync Public Website — Architecture & Development Plan v1.0".
 * Do not add top-level product areas that are not in the plan.
 *
 * `title` and `description` are the page's real SEO metadata — they are used by
 * `pageMetadata()` and by the sitemap, so each must be unique.
 */

export const SITE_NAME = "LumenSync";
export const SITE_URL = "https://lumensync.io";
export const APP_URL = "https://app.lumensync.io";

export const SITE_TAGLINE =
  "Complex Lighting Installs, Finally Tied to the Drawings.";

export const SITE_DESCRIPTION =
  "LumenSync ties fixture schedules, cut sheets, submittals, controls, checks, RFIs and field status back to the actual lighting drawings — so coordination gaps show up on the sheet, before they show up on the job.";

export interface PageDef {
  /** Route path beginning with "/" */
  path: string;
  /** Short navigation label */
  label: string;
  /** Document title (before the site suffix) */
  title: string;
  /** Meta description */
  description: string;
}

export const productPages: PageDef[] = [
  {
    path: "/product/drawings",
    label: "Drawings",
    title: "Drawing Coordination",
    description:
      "Place fixture types on the lighting drawings, track status on the sheet, and open findings, RFIs and field work at the exact location they came from.",
  },
  {
    path: "/product/checks",
    label: "Checks",
    title: "Coordination Checks",
    description:
      "LumenSync compares the fixture schedule against what is placed on the drawings and reports the disagreements as reviewable findings — never as confirmed errors.",
  },
  {
    path: "/product/fixtures",
    label: "Fixture Intelligence",
    title: "Fixture Information",
    description:
      "Import and version the fixture schedule, hold manufacturer, model, wattage and voltage per type, and track which types still lack approved cut-sheet evidence.",
  },
  {
    path: "/product/controls",
    label: "Controls",
    title: "Controls Coordination",
    description:
      "Keep control drawings and controls documents with the lighting package, map fixture types to control zones under review, and surface mismatches as findings.",
  },
  {
    path: "/product/field",
    label: "Field Hub",
    title: "Field Hub",
    description:
      "Install progress by fixture type and by drawing, on a phone: scheduled, wired and remaining, with every type linked to the sheet it is placed on.",
  },
  {
    path: "/product/rfis",
    label: "RFIs & Resolution",
    title: "RFIs & Resolution",
    description:
      "Coordination findings become drafted RFI candidates with evidence attached. A manager reviews and issues; LumenSync never sends an RFI on its own.",
  },
  {
    path: "/product/closeout",
    label: "Closeout",
    title: "Closeout Readiness",
    description:
      "A read-only readiness view of open field issues, unconfirmed RFIs, missing cut-sheet evidence, drawings of record and the state of the last checks run.",
  },
];

export const primaryNav: PageDef[] = [
  {
    path: "/product",
    label: "Product",
    title: "Product Overview",
    description:
      "One lighting record — schedule, types, documentation, drawings, placements, findings, RFIs and field status — with the drawing as the connective tissue.",
  },
  {
    path: "/why-lumensync",
    label: "Why LumenSync",
    title: "Why LumenSync",
    description:
      "Why commercial lighting coordination goes wrong late, and the four decisions LumenSync is built on: the drawing as index, findings not verdicts, human decisions, nothing lost.",
  },
  {
    path: "/security",
    label: "Security",
    title: "Security",
    description:
      "How LumenSync handles access, tenant boundaries, server-side authorisation, environment separation and gated releases — and which certifications we do not claim.",
  },
  {
    path: "/about",
    label: "Company",
    title: "About LumenSync",
    description:
      "LumenSync is an independent software product built around one problem: making complex commercial lighting coordination legible, from schedule to closeout.",
  },
];

export const utilityPages: PageDef[] = [
  {
    path: "/request-demo",
    label: "Request Demo",
    title: "Request a Demo",
    description:
      "See LumenSync walked through a real commercial lighting package — schedule, drawings, checks, findings, RFIs and field status — in about forty minutes.",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact",
    description:
      "How to reach the LumenSync team, whether you are evaluating the product, already using it, or reporting a security concern.",
  },
  {
    path: "/legal/privacy",
    label: "Privacy",
    title: "Privacy Policy",
    description:
      "The LumenSync privacy policy. The final policy text is being prepared and will be published here before the site goes live on its production domain.",
  },
  {
    path: "/legal/terms",
    label: "Terms",
    title: "Terms of Service",
    description:
      "The LumenSync terms of service. The final terms are being prepared and will be published here before the site goes live on its production domain.",
  },
];

/** Every indexable route, used by the sitemap. */
export const allPages: PageDef[] = [
  {
    path: "/",
    label: "Home",
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
  },
  ...primaryNav,
  ...productPages,
  ...utilityPages,
];

export function findPage(path: string): PageDef | undefined {
  return allPages.find((p) => p.path === path);
}
