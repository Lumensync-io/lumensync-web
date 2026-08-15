import { BoundaryColumns } from "@/components/marketing/boundary-columns";
import { Callout } from "@/components/marketing/callout";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductFrame } from "@/components/marketing/product-frame";
import { ProductNavGrid } from "@/components/marketing/product-nav-grid";
import { SplitFeature } from "@/components/marketing/split-feature";
import { StepList } from "@/components/marketing/step-list";
import { pageMetadata } from "@/components/page-scaffold";
import { RFIS as C } from "@/lib/content/product";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";

export const metadata = pageMetadata("/product/rfis");

export default function RfisPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <ProductFrame
            image={productMedia.rfiReview.image}
            alt={productMedia.rfiReview.alt}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            caption={`The review workspace — draft banner, discrepancy details, linked evidence and issue readiness. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <SplitFeature
        id="workflow"
        eyebrow={C.workflow.eyebrow}
        heading={C.workflow.heading}
        media={
          <ProductFrame
            image={productMedia.rfiQueue.image}
            alt={productMedia.rfiQueue.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`The candidate queue — detected, needs review, ready to issue and issued, with readiness and evidence filters. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      >
        <StepList
          ariaLabel="RFI workflow"
          steps={C.workflow.steps}
          className="mt-8"
        />
        <Callout label={C.honesty.label} className="mt-8">
          {C.honesty.body}
        </Callout>
      </SplitFeature>

      <SplitFeature
        id="queue"
        reverse
        eyebrow={C.queue.eyebrow}
        heading={C.queue.heading}
        lead={C.queue.lead}
        points={[...C.queue.points]}
        media={
          <ProductFrame
            image={productMedia.checks.image}
            alt={productMedia.checks.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={`Candidates originate in coordination findings, with the counts that produced them. ${PRODUCT_MEDIA_SOURCE}`}
          />
        }
      />

      <BoundaryColumns id="scope" boundary={C.boundary} />

      <ProductNavGrid exclude="/product/rfis" heading="Where RFIs come from" />

      <CtaBand
        id="cta"
        heading="Ask the right question, earlier."
        body="See a finding become a drafted RFI with its evidence attached — and what a manager checks before issuing it."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/product/checks", label: "See coordination checks" }}
      />
    </>
  );
}
