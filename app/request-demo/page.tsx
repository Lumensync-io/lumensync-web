import { Container, Section, TextLink } from "@/components/primitives";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionIntro } from "@/components/marketing/section-intro";
import { StepList } from "@/components/marketing/step-list";
import { pageMetadata } from "@/components/page-scaffold";
import {
  DEMO_FORM_LIVE,
  DEMO_FORM_NOTICE,
  REQUEST_DEMO as C,
} from "@/lib/content/conversion";

export const metadata = pageMetadata("/request-demo");

function Field({
  id,
  label,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-strong">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        disabled={!DEMO_FORM_LIVE}
        aria-describedby="form-status"
        className="mt-1.5 block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink-strong placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

export default function RequestDemoPage() {
  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <div className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6 sm:p-8">
            <h2 className="text-sm font-semibold text-ink-strong">
              Request a demo
            </h2>
            <p
              id="form-status"
              className="mt-2 rounded-[var(--radius-control)] border border-line-strong bg-surface-inset/60 p-3 text-sm leading-relaxed text-ink-body"
            >
              {DEMO_FORM_NOTICE}
            </p>
            <form aria-describedby="form-status" className="mt-5">
              <div className="grid gap-5">
                {C.fields.map((f) => (
                  <Field
                    key={f.id}
                    id={f.id}
                    label={f.label}
                    type={f.type}
                    autoComplete={f.autoComplete}
                  />
                ))}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ink-strong"
                  >
                    What you&apos;d like to see{" "}
                    <span className="font-normal text-ink-faint">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    disabled={!DEMO_FORM_LIVE}
                    aria-describedby="form-status"
                    className="mt-1.5 block w-full rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink-strong disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!DEMO_FORM_LIVE}
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Request a Demo
                </button>
                <p className="text-sm text-ink-muted">
                  More on how to reach us is on the{" "}
                  <TextLink href="/contact">contact page</TextLink>.
                </p>
              </div>
            </form>
          </div>
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
