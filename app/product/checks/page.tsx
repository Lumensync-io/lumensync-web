import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { Callout } from "@/components/marketing/callout";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SplitFeature } from "@/components/marketing/split-feature";
import { pageMetadata } from "@/components/page-scaffold";
import { CHECKS as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product/checks");

export default function ChecksPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            image={productMedia.checks.image}
            alt={productMedia.checks.alt}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={`A drawing count check: scheduled quantity, schedule source, under-placed count and findings by severity. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="engines"
        eyebrow={C.engines.eyebrow}
        heading={C.engines.heading}
        lead={C.engines.lead}
        items={C.engines.items}
        columns={2}
      />

      <SplitFeature
        id="finding"
        reverse
        eyebrow={C.finding.eyebrow}
        heading={C.finding.heading}
        points={[...C.finding.points]}
        media={
          <ProductFrame
            image={productMedia.rfiQueue.image}
            alt={productMedia.rfiQueue.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`Findings that warrant asking become RFI candidates, counted and filtered by state. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      >
        <Callout label={C.honesty.label} className="mt-8">
          {C.honesty.body}
        </Callout>
      </SplitFeature>

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid exclude="/product/checks" heading="What feeds the checks" />

      <CtaBand
        id="cta"
        heading="Find the disagreements early."
        body="See a coordination check run against a real lighting package — including what it refuses to guess."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product/rfis", label: "From finding to RFI" }}
      />
    </>
  );
}
