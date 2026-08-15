import { Container, Section } from "@/components/primitives";
import { SectionIntro } from "./section-intro";
import type { Point } from "@/lib/content/types";

/**
 * FeatureGrid — a labelled section whose body is a grid of titled points.
 * Used wherever a page needs "here are the parts of this" without media.
 */
export function FeatureGrid({
  id,
  eyebrow,
  heading,
  lead,
  items,
  columns = 3,
  className = "",
  children,
}: {
  id: string;
  eyebrow?: string;
  heading: string;
  lead?: string;
  items: readonly Point[];
  columns?: 2 | 3 | 4;
  className?: string;
  children?: React.ReactNode;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <Section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`border-t border-line-subtle ${className}`}
    >
      <Container>
        <SectionIntro
          id={`${id}-heading`}
          eyebrow={eyebrow}
          heading={heading}
          lead={lead}
        />
        <ul className={`mt-10 grid gap-4 ${cols}`}>
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5"
            >
              <h3 className="text-sm font-semibold text-ink-strong">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
        {children}
      </Container>
    </Section>
  );
}
