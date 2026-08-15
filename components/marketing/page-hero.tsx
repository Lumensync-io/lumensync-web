import type { ReactNode } from "react";
import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  LinkButton,
  Section,
} from "@/components/primitives";
import type { Hero } from "@/lib/content/types";

/**
 * PageHero — the standard top-of-page block for every route below the
 * homepage. Renders the single <h1>, optional CTAs and an optional media
 * column. Shared so page rhythm and heading semantics stay identical
 * site-wide.
 */
export function PageHero({
  hero,
  media,
  id = "hero",
}: {
  hero: Hero;
  media?: ReactNode;
  id?: string;
}) {
  const copy = (
    <>
      <Eyebrow>{hero.eyebrow}</Eyebrow>
      <span id={`${id}-heading`}>
        <DisplayHeading>{hero.heading}</DisplayHeading>
      </span>
      <BodyCopy className="mt-6 text-ink-body">{hero.lead}</BodyCopy>
      {hero.primary || hero.secondary ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {hero.primary ? (
            <LinkButton href={hero.primary.href} variant="primary">
              {hero.primary.label}
            </LinkButton>
          ) : null}
          {hero.secondary ? (
            <LinkButton href={hero.secondary.href} variant="secondary">
              {hero.secondary.label}
            </LinkButton>
          ) : null}
        </div>
      ) : null}
      {hero.note ? (
        <p className="mt-6 max-w-prose text-sm text-ink-muted">{hero.note}</p>
      ) : null}
    </>
  );

  return (
    <Section
      id={id}
      className="pb-10 pt-12 sm:pb-14 sm:pt-16"
      aria-labelledby={`${id}-heading`}
    >
      <Container>
        {media ? (
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">{copy}</div>
            <div className="lg:col-span-6">{media}</div>
          </div>
        ) : (
          <div className="max-w-3xl">{copy}</div>
        )}
      </Container>
    </Section>
  );
}
