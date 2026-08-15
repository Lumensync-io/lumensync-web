import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SplitFeature } from "@/components/marketing/split-feature";
import { pageMetadata } from "@/components/page-scaffold";
import { CLOSEOUT as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product/closeout");

export default function CloseoutPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            image={productMedia.closeoutReadiness.image}
            alt={productMedia.closeoutReadiness.alt}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={`${C.readiness.caption} ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <SplitFeature
        id="readiness"
        eyebrow={C.readiness.eyebrow}
        heading={C.readiness.heading}
        lead={C.readiness.lead}
        points={[...C.readiness.items]}
        media={
          <ProductFrame
            image={productMedia.closeoutReadiness.image}
            alt={productMedia.closeoutReadiness.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`Every status is produced from project records — not from a self-assessment. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="outcome"
        eyebrow={C.outcome.eyebrow}
        heading={C.outcome.heading}
        items={C.outcome.points}
        className="bg-surface-inset"
      />

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid
        exclude="/product/closeout"
        heading="What closeout readiness reads"
      />

      <CtaBand
        id="cta"
        heading="Start closeout on day one."
        body="Cut-sheet evidence, open findings and field issues tracked as you go — not reconstructed in the last week."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product", label: "Product overview" }}
      />
    </>
  );
}
