import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  LinkButton,
  Section,
  SectionHeading,
} from "@/components/primitives";
import { SITE_DESCRIPTION } from "@/lib/site";

const scopeItems = [
  "Drawing Coordination",
  "Fixture Schedules",
  "Cut Sheets",
  "Controls",
  "Checks",
  "RFIs",
  "Field Status",
];

const packagePieces = [
  "Drawings",
  "Fixture Schedule",
  "Submittals",
  "Controls",
  "RFIs",
  "Revisions",
  "Field Information",
];

const workflowSteps = [
  {
    title: "Bring in the lighting package",
    body: "Drawings, fixture schedules, cut sheets, submittals, and controls information enter LumenSync.",
  },
  {
    title: "Build the lighting record",
    body: "Fixture types, drawing locations, schedule data, approved documentation, and controls relationships connect into one record.",
  },
  {
    title: "Check the coordination",
    body: "LumenSync identifies conditions requiring attention — missing approved cut sheets, missing wattage, schedule and controls conflicts.",
  },
  {
    title: "Resolve issues in context",
    body: "Open a finding, go straight to the affected drawing, review connected information, and take linked action — including RFIs.",
  },
  {
    title: "Carry truth into the field",
    body: "The same project record continues through field coordination, installation, documentation, and closeout.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section className="pb-10 sm:pb-14" aria-labelledby="hero-heading">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Lighting Coordination Intelligence</Eyebrow>
            <span id="hero-heading">
              <DisplayHeading>
                Complex Lighting Installs, Finally Tied to the{" "}
                <span className="text-accent">Drawings.</span>
              </DisplayHeading>
            </span>
            <BodyCopy className="mt-6">{SITE_DESCRIPTION}</BodyCopy>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/request-demo" variant="primary">
                Request a Demo
              </LinkButton>
              <LinkButton href="/product" variant="secondary">
                See LumenSync in Action
              </LinkButton>
            </div>
          </div>

          {/* Product frame placeholder — replaced with real product UI in the
              product-media work item. Deliberately not a fake screenshot. */}
          <div
            className="mt-14 rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6 shadow-[var(--shadow-raised)] sm:p-10"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2 border-b border-line-subtle pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 text-xs text-ink-faint">
                LumenSync — live product demonstration coming to this space
              </span>
            </div>
            <div className="grid gap-4 pt-6 sm:grid-cols-3">
              <div className="rounded-md border border-line-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Check
                </p>
                <p className="mt-2 text-sm text-ink-body">
                  Missing approved cut sheet
                </p>
                <p className="mt-3 text-xs font-medium text-accent">
                  View on Drawing →
                </p>
              </div>
              <div className="rounded-md border border-line-subtle p-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Drawing
                </p>
                <div className="mt-3 grid h-28 grid-cols-6 gap-px opacity-60">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border border-line-subtle" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Scope strip */}
      <Section className="border-y border-line-subtle bg-surface-inset py-10 sm:py-12">
        <Container>
          <p className="text-center text-sm font-medium text-ink-muted">
            Built for complex commercial lighting coordination
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {scopeItems.map((item) => (
              <li
                key={item}
                className="text-sm font-semibold tracking-wide text-ink-body"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* The problem → connected record */}
      <Section aria-labelledby="problem-heading">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>The Problem</Eyebrow>
            <span id="problem-heading">
              <SectionHeading>
                Your lighting package isn&apos;t one document.
              </SectionHeading>
            </span>
            <BodyCopy className="mt-4">
              The information that defines a commercial lighting install lives
              across drawings, schedules, submittals, controls documents, RFIs,
              revisions, and field notes. Those pieces are deeply connected —
              but traditional workflows treat them independently.
            </BodyCopy>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {packagePieces.map((piece) => (
              <div
                key={piece}
                className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised px-4 py-3 text-sm font-medium text-ink-body"
              >
                {piece}
              </div>
            ))}
            <div className="rounded-[var(--radius-card)] border border-accent-deep bg-surface-raised px-4 py-3 text-sm font-semibold text-accent">
              → One connected LumenSync project record
            </div>
          </div>
        </Container>
      </Section>

      {/* Workflow */}
      <Section
        className="border-t border-line-subtle"
        aria-labelledby="workflow-heading"
      >
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>How It Works</Eyebrow>
            <span id="workflow-heading">
              <SectionHeading>
                From lighting package to project truth.
              </SectionHeading>
            </span>
          </div>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {workflowSteps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5"
              >
                <p className="text-sm font-bold text-accent">{i + 1}</p>
                <h3 className="mt-2 text-sm font-semibold text-ink-strong">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section
        className="border-t border-line-subtle bg-surface-inset"
        aria-labelledby="cta-heading"
      >
        <Container className="text-center">
          <span id="cta-heading">
            <SectionHeading>
              Your next lighting package shouldn&apos;t live in six places.
            </SectionHeading>
          </span>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton href="/request-demo" variant="primary">
              Request a LumenSync Demo
            </LinkButton>
            <LinkButton href="/product" variant="secondary">
              See the Product
            </LinkButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
