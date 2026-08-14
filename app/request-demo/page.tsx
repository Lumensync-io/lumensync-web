import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  Section,
  TextLink,
} from "@/components/primitives";
import { pageMetadata } from "@/components/page-scaffold";

export const metadata = pageMetadata("/request-demo");

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  optional = false,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink-strong"
      >
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-ink-faint">(optional)</span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        disabled
        aria-describedby="form-status"
        className="mt-1.5 block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink-strong placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

export default function RequestDemoPage() {
  return (
    <Section aria-labelledby="page-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <Eyebrow>Request a Demo</Eyebrow>
            <span id="page-heading">
              <DisplayHeading>
                See LumenSync on a real lighting package.
              </DisplayHeading>
            </span>
            <BodyCopy className="mt-6">
              We&apos;ll walk through how LumenSync connects drawings, fixture
              schedules, submittals, controls, and field status on a project
              like yours — and how automated Checks surface coordination gaps
              before they become field problems.
            </BodyCopy>
          </div>

          <div className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6 sm:p-8">
            <form aria-describedby="form-status">
              <div className="grid gap-5">
                <Field id="name" label="Name" autoComplete="name" />
                <Field
                  id="email"
                  label="Work email"
                  type="email"
                  autoComplete="email"
                />
                <Field
                  id="company"
                  label="Company"
                  autoComplete="organization"
                />
                <Field
                  id="role"
                  label="Role"
                  autoComplete="organization-title"
                />
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ink-strong"
                  >
                    Message{" "}
                    <span className="font-normal text-ink-faint">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    disabled
                    aria-describedby="form-status"
                    className="mt-1.5 block w-full rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink-strong disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Request a Demo
                </button>
                <p id="form-status" className="text-sm text-ink-muted">
                  Online demo requests open with a later release. Until then,
                  reach us at{" "}
                  <TextLink href="/contact">the contact page</TextLink>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
