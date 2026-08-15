import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SplitFeature } from "@/components/marketing/split-feature";
import { pageMetadata } from "@/components/page-scaffold";
import { DRAWINGS as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product/drawings");

export default function DrawingsPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            image={productMedia.drawingViewer.image}
            alt={productMedia.drawingViewer.alt}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={`Sheet E-101 with placed markers, the placed/pending legend and per-type schedule progress. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <SplitFeature
        id="viewer"
        eyebrow={C.viewer.eyebrow}
        heading={C.viewer.heading}
        lead={C.viewer.lead}
        points={[...C.viewer.points]}
        media={
          <ProductFrame
            image={productMedia.drawingFocus.image}
            alt={productMedia.drawingFocus.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`A focused fixture location — opened from a finding, with schedule progress alongside. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="records"
        eyebrow={C.records.eyebrow}
        heading={C.records.heading}
        lead={C.records.lead}
        items={C.records.points}
      />

      <FeatureGrid
        id="audience"
        eyebrow={C.audience.eyebrow}
        heading={C.audience.heading}
        items={C.audience.items}
        className="bg-surface-inset"
      />

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid exclude="/product/drawings" heading="Where drawings connect" />

      <CtaBand
        id="cta"
        heading="Put your lighting drawings to work."
        body="See placements, findings and field status on your own sheets."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product/checks", label: "See coordination checks" }}
      />
    </>
  );
}
