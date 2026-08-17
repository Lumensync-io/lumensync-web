import { Container, Section, SectionHeading } from "@/components/primitives";
import { AccessDiagram } from "@/components/marketing/access-diagram";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionIntro } from "@/components/marketing/section-intro";
import { SurfaceSplit } from "@/components/marketing/surface-split";
import { WorkflowChain } from "@/components/marketing/workflow-chain";
import { pageMetadata } from "@/components/page-scaffold";
import { SECURITY as C } from "@/lib/content/company";

export const metadata = pageMetadata("/security");

export default function SecurityPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <AccessDiagram
            frame={C.diagram.frame}
            description={C.diagram.description}
            user={C.diagram.user}
            authorization={C.diagram.authorization}
            data={C.diagram.data}
            denied={C.diagram.denied}
          />
        }
      />

      <FeatureGrid
        id="access"
        eyebrow={C.access.eyebrow}
        heading={C.access.heading}
        lead={C.access.lead}
        items={C.access.points}
        columns={2}
      />

      <Section
        id="release"
        aria-labelledby="release-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <SectionIntro
            id="release-heading"
            eyebrow={C.release.eyebrow}
            heading={C.release.heading}
            lead={C.release.lead}
          />
          <div className="mt-10">
            <WorkflowChain
              steps={C.release.steps}
              ariaLabel="How a change reaches production"
              columns={5}
            />
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {C.release.points.map((point) => (
              <li
                key={point.title}
                className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5"
              >
                <h3 className="text-sm font-semibold text-ink-strong">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        id="fail-safe"
        aria-labelledby="fail-safe-heading"
        className="border-t border-line-subtle"
      >
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <SectionIntro
                id="fail-safe-heading"
                eyebrow={C.failSafe.eyebrow}
                heading={C.failSafe.heading}
                lead={C.failSafe.lead}
              />
              <p className="mt-6 text-sm font-medium text-ink-strong">
                {C.failSafe.examplesIntro}
              </p>
              <ul className="mt-3 space-y-2.5">
                {C.failSafe.examples.map((example) => (
                  <li key={example} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-sm leading-relaxed text-ink-body">
                      {example}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink-muted">
                {C.failSafe.closing}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6">
                <h3 className="text-sm font-semibold text-ink-strong">
                  {C.failSafe.panel.heading}
                </h3>
                <ol className="mt-5 space-y-3">
                  {C.failSafe.panel.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="text-xs font-bold tabular-nums text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-ink-body">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <SurfaceSplit
        id="separation"
        eyebrow={C.separation.eyebrow}
        heading={C.separation.heading}
        lead={C.separation.lead}
        website={C.separation.website}
        application={C.separation.application}
        note={C.separation.note}
      />

      <Section
        id="assurance"
        aria-labelledby="assurance-heading"
        className="border-t border-line-subtle py-12 sm:py-16"
      >
        <Container>
          <div className="max-w-2xl">
            <span id="assurance-heading">
              <SectionHeading>{C.assurance.heading}</SectionHeading>
            </span>
            {C.assurance.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-4 text-sm leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        id="security-cta"
        heading={C.cta.heading}
        body={C.cta.body}
        primary={C.cta.primary}
        secondary={C.cta.secondary}
      />
    </>
  );
}
