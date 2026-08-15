import { Container, Section } from "@/components/primitives";
import { SectionIntro } from "./section-intro";
import type { Boundary } from "@/lib/content/types";

function Mark({ kind }: { kind: "is" | "isNot" }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      aria-hidden="true"
      className={`mt-0.5 shrink-0 ${kind === "is" ? "text-accent" : "text-ink-faint"}`}
    >
      {kind === "is" ? (
        <path
          d="M3 8l3.2 3.2L12 4.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M4 4l7 7M11 4l-7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

/**
 * BoundaryColumns — an explicit "what this is / what this is not" pair.
 * Each column is labelled in words as well as by icon, so nothing is conveyed
 * by colour or shape alone.
 */
export function BoundaryColumns({
  id,
  boundary,
  eyebrow = "Scope",
}: {
  id: string;
  boundary: Boundary;
  eyebrow?: string;
}) {
  return (
    <Section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-line-subtle bg-surface-inset"
    >
      <Container>
        <SectionIntro
          id={`${id}-heading`}
          eyebrow={eyebrow}
          heading={boundary.heading}
          lead={boundary.lead}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {(
            [
              { kind: "is" as const, title: "What LumenSync does", items: boundary.is },
              {
                kind: "isNot" as const,
                title: "What LumenSync does not do",
                items: boundary.isNot,
              },
            ]
          ).map((col) => (
            <div
              key={col.kind}
              className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Mark kind={col.kind} />
                    <span
                      className={`text-sm leading-relaxed ${
                        col.kind === "is" ? "text-ink-body" : "text-ink-muted"
                      }`}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
