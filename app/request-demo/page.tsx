import { Container, Section } from "@/components/primitives";
import { DemoRequestForm } from "@/components/demo-request-form";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionIntro } from "@/components/marketing/section-intro";
import { StepList } from "@/components/marketing/step-list";
import { pageMetadata } from "@/components/page-scaffold";
import { isDemoRequestEnabled } from "@/lib/demo-request/config";
import {
  DEMO_FORM_LIVE_NOTICE,
  DEMO_FORM_UNAVAILABLE,
  REQUEST_DEMO as C,
} from "@/lib/content/conversion";

export const metadata = pageMetadata("/request-demo");

export default function RequestDemoPage() {
  // Read on the server for this deployment; only the boolean reaches the
  // browser. The destination and its credentials never leave the server.
  const enabled = isDemoRequestEnabled();

  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <DemoRequestForm
            enabled={enabled}
            unavailableNotice={DEMO_FORM_UNAVAILABLE}
            liveNotice={DEMO_FORM_LIVE_NOTICE}
          />
        }
      />

      <Section
        id="agenda"
        aria-labelledby="agenda-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <SectionIntro
                id="agenda-heading"
                eyebrow={C.agenda.eyebrow}
                heading={C.agenda.heading}
              />
            </div>
            <div className="lg:col-span-7">
              <StepList ariaLabel="Demo agenda" steps={C.agenda.steps} />
            </div>
          </div>
        </Container>
      </Section>

      <FeatureGrid
        id="expectations"
        eyebrow={C.expectations.eyebrow}
        heading={C.expectations.heading}
        items={C.expectations.points}
      />
    </>
  );
}
