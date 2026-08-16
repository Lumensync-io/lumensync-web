import { Callout } from "@/components/marketing/callout";
import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  Section,
  TextLink,
} from "@/components/primitives";
import type { LegalPage } from "@/lib/content/legal";

/**
 * Shared layout for the legal pages. The factual disclosures and the items
 * awaiting legal approval are rendered as two visually distinct blocks so a
 * reader can never mistake an outstanding item for a published commitment.
 */
export function LegalPageBody({
  page,
  sectionNotes = {},
}: {
  page: LegalPage;
  /** Keyed by section heading — states the live behaviour of that section. */
  sectionNotes?: Record<string, string>;
}) {
  return (
    <>
      <Section aria-labelledby="page-heading">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{page.eyebrow}</Eyebrow>
            <span id="page-heading">
              <DisplayHeading>{page.heading}</DisplayHeading>
            </span>
            <BodyCopy className="mt-6">{page.lead}</BodyCopy>
            <Callout label={page.gate.label} className="mt-8">
              {page.gate.body}
            </Callout>
          </div>
        </Container>
      </Section>

      <Section
        id="disclosures"
        aria-labelledby="disclosures-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <div className="max-w-3xl">
            <h2
              id="disclosures-heading"
              className="text-2xl font-bold tracking-tight text-ink-strong"
            >
              How this site actually works
            </h2>
            <p className="mt-3 text-sm text-ink-muted">{page.disclosureIntro}</p>

            <div className="mt-10 grid gap-10">
              {page.disclosures.map((section) => (
                <section key={section.heading} aria-label={section.heading}>
                  <h3 className="text-lg font-semibold text-ink-strong">
                    {section.heading}
                  </h3>
                  {sectionNotes[section.heading] ? (
                    <p className="mt-3 rounded-[var(--radius-control)] border border-line-strong bg-surface-raised p-3 text-sm leading-relaxed text-ink-body">
                      {sectionNotes[section.heading]}
                    </p>
                  ) : null}
                  {section.lead ? (
                    <p className="mt-2 text-base leading-relaxed text-ink-body">
                      {section.lead}
                    </p>
                  ) : null}
                  <ul className="mt-4 grid gap-3 border-l border-line-strong pl-5">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="text-base leading-relaxed text-ink-body"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="pending" aria-labelledby="pending-heading">
        <Container>
          <div className="max-w-3xl">
            <h2
              id="pending-heading"
              className="text-2xl font-bold tracking-tight text-ink-strong"
            >
              Still to be written and approved
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-body">
              {page.gatedIntro}
            </p>
            <ol className="mt-6 grid gap-3">
              {page.gated.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 min-w-6 font-mono text-sm text-ink-faint"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base leading-relaxed text-ink-body">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm leading-relaxed text-ink-muted">
              Questions about any of this before it is finished can go through
              the <TextLink href="/request-demo">demo request</TextLink>, and the{" "}
              <TextLink href="/security">security page</TextLink> covers what is
              and is not claimed about the product.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
