"use client";

import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  Section,
} from "@/components/primitives";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section aria-labelledby="page-heading">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>Something went wrong</Eyebrow>
          <span id="page-heading">
            <DisplayHeading>We hit an unexpected error.</DisplayHeading>
          </span>
          <BodyCopy className="mt-6">
            Try again, or head back to the homepage. If the problem persists,
            please let us know through the contact page.
          </BodyCopy>
          <div className="mt-8">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-ink hover:bg-accent"
            >
              Try again
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
