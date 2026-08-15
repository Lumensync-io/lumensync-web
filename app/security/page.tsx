import { Container, LinkButton, Section } from "@/components/primitives";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionIntro } from "@/components/marketing/section-intro";
import { pageMetadata } from "@/components/page-scaffold";
import { SECURITY as C } from "@/lib/content/company";

export const metadata = pageMetadata("/security");

export default function SecurityPage() {
  return (
    <>
      <PageHero hero={C.hero} />

      <FeatureGrid
        id="access"
        eyebrow={C.access.eyebrow}
        heading={C.access.heading}
        items={C.access.points}
        columns={2}
      />

      <FeatureGrid
        id="separation"
        eyebrow={C.separation.eyebrow}
        heading={C.separation.heading}
        items={C.separation.points}
        columns={2}
        className="bg-surface-inset"
      />

      <FeatureGrid
        id="practice"
        eyebrow={C.practice.eyebrow}
        heading={C.practice.heading}
        items={C.practice.points}
        columns={2}
      />

      <Section
        id="claims"
        aria-labelledby="claims-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <SectionIntro
            id="claims-heading"
            eyebrow={C.claims.eyebrow}
            heading={C.claims.heading}
            lead={C.claims.lead}
          />
          <ul className="mt-8 max-w-3xl space-y-3">
            {C.claims.items.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-line-strong"
                />
                <span className="text-sm leading-relaxed text-ink-body">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        id="report"
        aria-labelledby="report-heading"
        className="border-t border-line-subtle"
      >
        <Container>
          <div className="max-w-2xl">
            <h2
              id="report-heading"
              className="text-2xl font-bold tracking-tight text-ink-strong"
            >
              {C.contact.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-body">
              {C.contact.body}
            </p>
            <div className="mt-8">
              <LinkButton href={C.contact.cta.href} variant="primary">
                {C.contact.cta.label}
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
