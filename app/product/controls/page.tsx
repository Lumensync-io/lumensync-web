import { Container, Section } from "@/components/primitives";
import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { Callout } from "@/components/marketing/callout";
import { ControlsMappingDiagram } from "@/components/marketing/controls-mapping-diagram";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SectionIntro } from "@/components/marketing/section-intro";
import { StepList } from "@/components/marketing/step-list";
import { pageMetadata } from "@/components/page-scaffold";
import { CONTROLS as C } from "@/lib/content/product";

export const metadata = pageMetadata("/product/controls");

export default function ControlsPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ControlsMappingDiagram
            frame={C.diagram.frame}
            schedule={C.diagram.schedule}
            controls={C.diagram.controls}
            mapping={C.diagram.mapping}
            outcome={C.diagram.outcome}
            description={C.diagram.description}
          />
        }
      />

      <FeatureGrid
        id="documents"
        eyebrow={C.documents.eyebrow}
        heading={C.documents.heading}
        items={C.documents.points}
      />

      <Section
        id="mappings"
        aria-labelledby="mappings-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionIntro
                id="mappings-heading"
                eyebrow={C.mappings.eyebrow}
                heading={C.mappings.heading}
                lead={C.mappings.lead}
              />
            </div>
            <div className="lg:col-span-7">
              <StepList
                ariaLabel="Controls mapping lifecycle"
                steps={C.mappings.steps}
              />
              <Callout label="Nothing leaves the project" className="mt-8">
                {C.mappings.note}
              </Callout>
            </div>
          </div>
        </Container>
      </Section>

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid
        exclude="/product/controls"
        heading="Controls in the wider record"
      />

      <CtaBand
        id="cta"
        heading="Reconcile the controls package before startup."
        body="See how mapped control zones are compared against the lighting schedule — under review, never applied automatically."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product/checks", label: "See coordination checks" }}
      />
    </>
  );
}
