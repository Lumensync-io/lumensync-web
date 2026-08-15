import { Container, Section } from "@/components/primitives";
import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { Callout } from "@/components/marketing/callout";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SectionIntro } from "@/components/marketing/section-intro";
import { SplitFeature } from "@/components/marketing/split-feature";
import { StepList } from "@/components/marketing/step-list";
import { pageMetadata } from "@/components/page-scaffold";
import { FIXTURES as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product/fixtures");

export default function FixturesPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            image={productMedia.fixtureSchedule.image}
            alt={productMedia.fixtureSchedule.alt}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={`The fixture schedule — types with scheduled and placed quantities, beside import and review options. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <Section
        id="intake"
        aria-labelledby="intake-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionIntro
                id="intake-heading"
                eyebrow={C.intake.eyebrow}
                heading={C.intake.heading}
                lead={C.intake.lead}
              />
            </div>
            <div className="lg:col-span-7">
              <StepList
                ariaLabel="Ways to bring a fixture schedule into LumenSync"
                steps={C.intake.steps}
              />
            </div>
          </div>
        </Container>
      </Section>

      <SplitFeature
        id="record"
        reverse
        eyebrow={C.record.eyebrow}
        heading={C.record.heading}
        lead={C.record.lead}
        points={[...C.record.points]}
        media={
          <ProductFrame
            image={productMedia.checks.image}
            alt={productMedia.checks.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`Schedule quantities are what the coordination checks compare against. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      >
        <Callout label={C.gaps.label} className="mt-8">
          {C.gaps.body}
        </Callout>
      </SplitFeature>

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid
        exclude="/product/fixtures"
        heading="What the fixture record feeds"
      />

      <CtaBand
        id="cta"
        heading="Bring your schedule — messy is fine."
        body="Scanned sheets, partial data and mid-project revisions are the normal case, not the exception."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product/checks", label: "See coordination checks" }}
      />
    </>
  );
}
