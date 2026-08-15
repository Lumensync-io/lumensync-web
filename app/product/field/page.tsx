import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SplitFeature } from "@/components/marketing/split-feature";
import { pageMetadata } from "@/components/page-scaffold";
import { FIELD as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product/field");

export default function FieldPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            variant="phone"
            image={productMedia.fieldMobile.image}
            alt={productMedia.fieldMobile.alt}
            priority
            caption={`Field on a phone — progress, counts and per-type cards with drawing links. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <SplitFeature
        id="progress"
        eyebrow={C.progress.eyebrow}
        heading={C.progress.heading}
        lead={C.progress.lead}
        points={[...C.progress.points]}
        media={
          <ProductFrame
            image={productMedia.fieldDesktop.image}
            alt={productMedia.fieldDesktop.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`The same numbers in the office — scheduled, wired and remaining by fixture type. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <FeatureGrid
        id="jobsite"
        eyebrow={C.jobsite.eyebrow}
        heading={C.jobsite.heading}
        items={C.jobsite.points}
        className="bg-surface-inset"
      />

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid exclude="/product/field" heading="What the field reads from" />

      <CtaBand
        id="cta"
        heading="Give the crew the same record as the office."
        body="No second spreadsheet, no re-keying, no arguing about whose copy is current."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product/drawings", label: "See the drawing viewer" }}
      />
    </>
  );
}
