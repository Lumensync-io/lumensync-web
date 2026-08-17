import { Callout } from "@/components/marketing/callout";
import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  Section,
  TextLink,
} from "@/components/primitives";
import { LEGAL_EFFECTIVE_DATE, type LegalPage } from "@/lib/content/legal";

/**
 * Shared layout for the legal pages: the policy itself, then a visible list of
 * what a lawyer still has to settle. Keeping the second block on the page — and
 * distinct from the first — is deliberate. A reader can see exactly which parts
 * are settled and which are not, instead of a confident document quietly
 * papering over the gaps.
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
      {/*
        Deliberately NOT `aria-labelledby="page-heading"`. The `#policy`
        section below is already a region named with the same page heading, so
        naming this one too produced two identically-named landmarks
        (axe `landmark-unique`). Dropping the name here leaves one policy
        landmark and changes no published wording.
      */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{page.eyebrow}</Eyebrow>
            <span id="page-heading">
              <DisplayHeading>{page.heading}</DisplayHeading>
            </span>
            <p className="mt-4 text-sm text-ink-muted">
              Effective {LEGAL_EFFECTIVE_DATE}
            </p>
            <BodyCopy className="mt-6">{page.lead}</BodyCopy>
            <Callout label={page.notice.label} className="mt-8">
              {page.notice.body}
            </Callout>
          </div>
        </Container>
      </Section>

      <Section
        id="policy"
        aria-labelledby="policy-heading"
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <div className="max-w-3xl">
            <h2 id="policy-heading" className="sr-only">
              {page.heading}
            </h2>

            <div className="grid gap-10">
              {/*
                Plain <div>, not <section aria-label>. Eleven named sections
                created eleven nested `region` landmarks, which makes landmark
                navigation noisier rather than clearer. The <h3> headings still
                provide the structure, and no published wording changes.
              */}
              {page.sections.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-lg font-semibold text-ink-strong">
                    {section.heading}
                  </h3>
                  {sectionNotes[section.heading] ? (
                    <p className="mt-3 rounded-[var(--radius-control)] border border-line-strong bg-surface-raised p-3 text-sm leading-relaxed text-ink-body">
                      {sectionNotes[section.heading]}
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
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="open-items" aria-labelledby="open-items-heading">
        <Container>
          <div className="max-w-3xl">
            <h2
              id="open-items-heading"
              className="text-2xl font-bold tracking-tight text-ink-strong"
            >
              Still with counsel
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-body">
              {page.openItemsIntro}
            </p>
            <ol className="mt-6 grid gap-3">
              {page.openItems.map((item, index) => (
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
              Questions about any of this can go through the{" "}
              <TextLink href="/request-demo">demo request</TextLink>, and the{" "}
              <TextLink href="/security">security page</TextLink> covers what is
              and is not claimed about the product.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
