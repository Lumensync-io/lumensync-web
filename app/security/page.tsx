import { Container, Section, SectionHeading } from "@/components/primitives";
import { AccessDiagram } from "@/components/marketing/access-diagram";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { SurfaceSplit } from "@/components/marketing/surface-split";
import { pageMetadata } from "@/components/page-scaffold";
import { SECURITY as C } from "@/lib/content/company";

export const metadata = pageMetadata("/security");

/**
 * /security — what LumenSync does to protect a customer's project information.
 *
 * Deliberately says nothing about how LumenSync is built, reviewed, released or
 * rolled back. That material described the vendor's engineering process rather
 * than the customer's protection, and a buyer evaluating the product does not
 * need a tour of someone else's CI pipeline to decide whether their drawings
 * are safe. What remains is access, what that access covers, the boundary
 * between this website and the application, and how to ask a direct question.
 */
export default function SecurityPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <AccessDiagram
            frame={C.diagram.frame}
            description={C.diagram.description}
            user={C.diagram.user}
            authorization={C.diagram.authorization}
            data={C.diagram.data}
            denied={C.diagram.denied}
          />
        }
      />

      <FeatureGrid
        id="access"
        eyebrow={C.access.eyebrow}
        heading={C.access.heading}
        lead={C.access.lead}
        items={C.access.points}
        columns={2}
      />

      <FeatureGrid
        id="protected"
        eyebrow={C.protected.eyebrow}
        heading={C.protected.heading}
        lead={C.protected.lead}
        items={C.protected.points}
        columns={3}
        className="bg-surface-inset"
      />

      <SurfaceSplit
        id="separation"
        eyebrow={C.separation.eyebrow}
        heading={C.separation.heading}
        lead={C.separation.lead}
        website={C.separation.website}
        application={C.separation.application}
        note={C.separation.note}
      />

      <Section
        id="assurance"
        aria-labelledby="assurance-heading"
        className="border-t border-line-subtle py-12 sm:py-16"
      >
        <Container>
          <div className="max-w-2xl">
            <span id="assurance-heading">
              <SectionHeading>{C.assurance.heading}</SectionHeading>
            </span>
            {C.assurance.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-4 text-sm leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        id="security-cta"
        heading={C.cta.heading}
        body={C.cta.body}
        primary={C.cta.primary}
        secondary={C.cta.secondary}
      />
    </>
  );
}
