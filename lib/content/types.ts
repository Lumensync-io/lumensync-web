/**
 * Shared content shapes for the public site. Page copy lives in
 * `lib/content/*.ts` so pages stay presentational and tests can assert against
 * the same source the pages render.
 */

export interface Cta {
  href: string;
  label: string;
}

/** A titled point used in feature grids and split-feature bullet lists. */
export interface Point {
  title: string;
  body: string;
}

/** One step in an ordered workflow. */
export interface Step {
  label: string;
  detail: string;
}

/** Page-level hero. */
export interface Hero {
  eyebrow: string;
  heading: string;
  lead: string;
  primary?: Cta;
  secondary?: Cta;
  /** Optional short line under the CTAs (audience, availability, scope). */
  note?: string;
}

/** "What this is / what this is not" — keeps product boundaries explicit. */
export interface Boundary {
  heading: string;
  lead?: string;
  is: string[];
  isNot: string[];
}
