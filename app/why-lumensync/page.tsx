import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { SplitFeature } from "@/components/marketing/split-feature";
import { pageMetadata } from "@/components/page-scaffold";
import { WHY as C } from "@/lib/content/company";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/why-lumensync");

export default function WhyLumenSyncPage() {
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
            caption={`A coordination check reporting where the schedule and the drawings disagree. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="today"
        eyebrow={C.today.eyebrow}
        heading={C.today.heading}
        lead={C.today.lead}
        items={C.today.points}
        columns={2}
        className="bg-surface-inset"
      />

      <SplitFeature
        id="different"
        eyebrow={C.different.eyebrow}
        heading={C.different.heading}
        points={[...C.different.points]}
        media={
          <ProductFrame
            image={productMedia.drawingFocus.image}
            alt={productMedia.drawingFocus.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`Every condition has an address: the fixture type, and the spot on the sheet. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="monday"
        eyebrow={C.monday.eyebrow}
        heading={C.monday.heading}
        items={C.monday.points}
        columns={2}
      />

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <CtaBand
        id="cta"
        heading="Bring the job that went sideways."
        body="The most useful demos start with a package that caused a problem last year."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product", label: "See the product" }}
      />
    </>
  );
}
