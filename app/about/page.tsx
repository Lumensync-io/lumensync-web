import { Container, Section } from "@/components/primitives";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { SectionIntro } from "@/components/marketing/section-intro";
import { SplitFeature } from "@/components/marketing/split-feature";
import { pageMetadata } from "@/components/page-scaffold";
import { ABOUT as C } from "@/lib/content/company";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <>
      <PageHero hero={C.hero} />

      <SplitFeature
        id="origin"
        eyebrow={C.origin.eyebrow}
        heading={C.origin.heading}
        lead={C.origin.lead}
        points={[...C.origin.points]}
        media={
          <ProductFrame
            image={productMedia.drawingViewer.image}
            alt={productMedia.drawingViewer.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`The product we wanted on site: the lighting package, on the sheet. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="principles"
        eyebrow={C.principles.eyebrow}
        heading={C.principles.heading}
        items={C.principles.points}
        className="bg-surface-inset"
      />

      <Section
        id="status"
        aria-labelledby="status-heading"
        className="border-t border-line-subtle"
      >
        <Container>
          <SectionIntro
            id="status-heading"
            eyebrow="Today"
            heading={C.status.heading}
            lead={C.status.body}
          />
        </Container>
      </Section>

      <CtaBand
        id="cta"
        heading="Tell us how you run lighting today."
        body="We learn more from one honest walkthrough of your process than from a month of guessing."
        primary={C.status.cta}
        secondary={{ href: "/why-lumensync", label: "Why LumenSync" }}
      />
    </>
  );
}
