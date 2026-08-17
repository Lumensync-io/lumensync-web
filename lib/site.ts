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

/**
 * The canonical public host.
 *
 * `www` rather than the apex, for two concrete reasons: the apex already
 * permanently redirects to `www` in production, and the protected legacy
 * customer routes are bound to the `www` hostname at the edge. Canonicalising
 * on `www` therefore means no canonical URL points at a redirect and no
 * existing customer bookmark has to change at cutover.
 */
export const CANONICAL_HOST = "www.lumensync.io";
export const SITE_URL = `https://${CANONICAL_HOST}`;
export const APP_URL = "https://app.lumensync.io";

export const SITE_TAGLINE =
  "Complex Lighting Installs, Finally Tied to the Drawings.";

/**
 * The homepage document title.
 *
 * Deliberately shorter than `SITE_TAGLINE`: the tagline is the approved on-page
 * headline and stays exactly as it is, but at 68 characters the combined
 * "LumenSync — <tagline>" title was cut off mid-phrase in search results. This
 * keeps the brand and the positioning inside the ~60-character window.
 */
export const SITE_TITLE =
  "LumenSync — Lighting Coordination Tied to the Drawings";

/**
 * The homepage meta description. Kept under 160 characters so search results
 * show the whole sentence rather than truncating the payoff.
 */
export const SITE_DESCRIPTION =
  "Fixture schedules, submittals, controls, checks, RFIs and field status, connected to the actual lighting drawings — so gaps surface on the sheet, not on site.";

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
    // Not "Why LumenSync": with the global "%s — LumenSync" template that
    // rendered as "Why LumenSync — LumenSync".
    title: "Why We Built It",
    description:
      "Why commercial lighting coordination goes wrong late, and the four decisions behind the product: the drawing as index, findings not verdicts, human decisions, nothing lost.",
  },
  {
    path: "/security",
    label: "Security",
    title: "Security",
    description:
      "How LumenSync protects project information: authenticated access, project-scoped authorization, permission-controlled actions, and protected drawings and records.",
  },
  {
    path: "/about",
    label: "Company",
    // Same defect as /why-lumensync: "About LumenSync" rendered as
    // "About LumenSync — LumenSync" under the global title template.
    title: "About",
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
      "What the LumenSync website does with personal information: no cookies, no analytics, no third-party requests, and a demo request form the site never stores.",
  },
  {
    path: "/legal/terms",
    label: "Terms",
    title: "Terms of Service",
    description:
      "The terms for using the LumenSync website: an informational site with no account, no purchase and no service delivered through it. The application is governed separately.",
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
