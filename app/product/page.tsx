import { Container, Section } from "@/components/primitives";
import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SectionIntro } from "@/components/marketing/section-intro";
import { WorkflowChain } from "@/components/marketing/workflow-chain";
import { pageMetadata } from "@/components/page-scaffold";
import { PRODUCT_OVERVIEW as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product");

export default function ProductPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            image={productMedia.drawingFocus.image}
            alt={productMedia.drawingFocus.alt}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={`Drawing viewer — a coordination finding focused on its fixture location. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="spine"
        eyebrow={C.spine.eyebrow}
        heading={C.spine.heading}
        lead={C.spine.lead}
        items={C.spine.points}
      />

      <Section
        id="flow"
        aria-labelledby="flow-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <SectionIntro
            id="flow-heading"
            eyebrow={C.flow.eyebrow}
            heading={C.flow.heading}
            lead={C.flow.lead}
          />
          <div className="mt-10">
            <WorkflowChain
              ariaLabel="LumenSync product workflow"
              steps={C.flow.steps.map((s) => ({
                label: s.label,
                detail: s.detail,
              }))}
            />
          </div>
        </Container>
      </Section>

      <ProductNavGrid
        id="areas"
        heading="Seven areas, one record"
        lead="Each area reads and writes the same project data. Start anywhere."
      />

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <CtaBand
        id="cta"
        heading="See it on a package like yours."
        body="We'll walk a real commercial lighting package end to end — schedule, drawings, checks, RFIs and field status."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/why-lumensync", label: "Why LumenSync" }}
      />
    </>
  );
}
