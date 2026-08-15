import type { ReactNode } from "react";
import { Container, LinkButton, Section, SectionHeading } from "@/components/primitives";

/**
 * CtaBand — closing conversion band. One primary action, one secondary.
 */
export function CtaBand({
  id,
  heading,
  body,
  primary,
  secondary,
}: {
  id: string;
  heading: ReactNode;
  body?: ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <Section
      className="border-t border-line-subtle bg-surface-inset"
      aria-labelledby={`${id}-heading`}
      id={id}
    >
      <Container className="text-center">
        <span id={`${id}-heading`}>
          <SectionHeading>{heading}</SectionHeading>
        </span>
        {body ? (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-body">
            {body}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href={primary.href} variant="primary">
            {primary.label}
          </LinkButton>
          {secondary ? (
            <LinkButton href={secondary.href} variant="secondary">
              {secondary.label}
            </LinkButton>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
