/**
 * Central site configuration: canonical URL, navigation IA, and route registry.
 * The information architecture here mirrors the approved
 * "LumenSync Public Website — Architecture & Development Plan v1.0".
 * Do not add top-level product areas that are not in the plan.
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
  /** Meta description + placeholder lead copy */
  description: string;
}

export const productPages: PageDef[] = [
  {
    path: "/product/drawings",
    label: "Drawings",
    title: "Drawing Coordination",
    description:
      "Drawing-linked project intelligence: fixture placements, revisions, and coordination findings that lead directly back to the affected work on the drawing.",
  },
  {
    path: "/product/checks",
    label: "Checks",
    title: "Automated Checks",
    description:
      "LumenSync doesn't just organize the lighting package — it checks it, surfacing coordination conditions like missing approved cut sheets, missing wattage, and schedule/controls conflicts.",
  },
  {
    path: "/product/fixtures",
    label: "Fixture Intelligence",
    title: "Fixture Intelligence",
    description:
      "One fixture record connects schedule, placement, specifications, approved cut sheets, controls, status, issues, and history.",
  },
  {
    path: "/product/controls",
    label: "Controls",
    title: "Controls Coordination",
    description:
      "Fixture-to-controls relationships and compatibility checking, so controls conflicts surface before they become field problems.",
  },
  {
    path: "/product/field",
    label: "Field Hub",
    title: "Field Hub",
    description:
      "The same project truth in the field: drawings, fixture information, status, and issues — no separate versions of the project.",
  },
  {
    path: "/product/rfis",
    label: "RFIs & Resolution",
    title: "RFIs & Resolution",
    description:
      "Generate and manage RFIs from coordination findings, with fixture and drawing context attached and resolution history preserved.",
  },
  {
    path: "/product/closeout",
    label: "Closeout",
    title: "Closeout",
    description:
      "Carry the connected project record through installation, documentation, and closeout — one continuous project history.",
  },
];

export const primaryNav: PageDef[] = [
  {
    path: "/product",
    label: "Product",
    title: "Product Overview",
    description:
      "How LumenSync creates one connected source of truth for complex commercial lighting projects.",
  },
  {
    path: "/why-lumensync",
    label: "Why LumenSync",
    title: "Why LumenSync",
    description:
      "The lighting package isn't one document. LumenSync connects the pieces and surfaces coordination gaps before they cost time in the field.",
  },
  {
    path: "/security",
    label: "Security",
    title: "Security",
    description:
      "Your projects remain your projects. How LumenSync approaches access, isolation, and data protection.",
  },
  {
    path: "/about",
    label: "Company",
    title: "About LumenSync",
    description:
      "LumenSync was developed from firsthand commercial electrical contracting experience and tested against real lighting projects.",
  },
];

export const utilityPages: PageDef[] = [
  {
    path: "/request-demo",
    label: "Request Demo",
    title: "Request a Demo",
    description:
      "See LumenSync on a real lighting package. Request a demo and we'll walk through your workflow.",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact",
    description: "Get in touch with the LumenSync team.",
  },
  {
    path: "/legal/privacy",
    label: "Privacy",
    title: "Privacy Policy",
    description: "LumenSync privacy policy.",
  },
  {
    path: "/legal/terms",
    label: "Terms",
    title: "Terms of Service",
    description: "LumenSync terms of service.",
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
