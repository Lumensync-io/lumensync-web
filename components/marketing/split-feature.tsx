import type { ReactNode } from "react";
import { Container, Section, TextLink } from "@/components/primitives";
import { SectionIntro } from "./section-intro";

export interface FeaturePoint {
  title: string;
  body: string;
}

/**
 * SplitFeature — content column + product media column. Used by every
 * homepage product section so the rhythm, heading level and media treatment
 * stay identical. `reverse` swaps columns on large screens only; on phones the
 * media always follows the copy.
 */
export function SplitFeature({
  id,
  eyebrow,
  heading,
  lead,
  points,
  media,
  reverse = false,
  cta,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  heading: ReactNode;
  lead?: ReactNode;
  points?: FeaturePoint[];
  media: ReactNode;
  reverse?: boolean;
  cta?: { href: string; label: string };
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Section
      aria-labelledby={`${id}-heading`}
      className={`border-t border-line-subtle ${className}`}
      id={id}
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div
            className={`lg:col-span-5 ${reverse ? "lg:order-2" : "lg:order-1"}`}
          >
            <SectionIntro
              id={`${id}-heading`}
              eyebrow={eyebrow}
              heading={heading}
              lead={lead}
            />
            {points && points.length > 0 ? (
              <ul className="mt-8 space-y-5">
                {points.map((pt) => (
                  <li key={pt.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                    />
                    <div>
                      <p className="text-sm font-semibold text-ink-strong">
                        {pt.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {pt.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
            {children}
            {cta ? (
              <p className="mt-8 text-sm">
                <TextLink href={cta.href}>{cta.label} →</TextLink>
              </p>
            ) : null}
          </div>
          <div
            className={`lg:col-span-7 ${reverse ? "lg:order-1" : "lg:order-2"}`}
          >
            {media}
          </div>
        </div>
      </Container>
    </Section>
  );
}
