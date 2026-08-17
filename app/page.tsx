import type { Metadata } from "next";
import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  LinkButton,
  Section,
} from "@/components/primitives";
import { Callout } from "@/components/marketing/callout";
import { CtaBand } from "@/components/marketing/cta-band";
import { ProductFrame } from "@/components/marketing/product-frame";
import { SectionIntro } from "@/components/marketing/section-intro";
import { SplitFeature } from "@/components/marketing/split-feature";
import { WorkflowChain } from "@/components/marketing/workflow-chain";
import {
  CHECKS,
  CLOSEOUT,
  DRAWINGS,
  FIELD,
  FINAL_CTA,
  FIXTURES,
  HERO,
  PROBLEM,
  RFIS,
  WORKFLOW,
} from "@/lib/homepage-content";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import { SITE_OG_IMAGE } from "@/components/page-scaffold";

/**
 * The homepage sets an absolute title, so it overrides the layout default
 * rather than inheriting it — which is why shortening the layout title alone
 * left the 68-character version live. Both now come from `SITE_TITLE`.
 * `SITE_TAGLINE` is untouched and still supplies the approved on-page H1.
 */
export const metadata: Metadata = {
  title: { absolute: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
};

function Provenance({ children }: { children: string }) {
  return (
    <>
      {children}{" "}
      <span className="text-ink-faint/80">· {PRODUCT_MEDIA_SOURCE}</span>
    </>
  );
}

export default function HomePage() {
  const headlineLead = HERO.headline.replace(HERO.headlineAccent, "").trimEnd();
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Section
        id="hero"
        className="pb-12 pt-14 sm:pb-16 sm:pt-20"
        aria-labelledby="hero-heading"
      >
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Eyebrow>{HERO.eyebrow}</Eyebrow>
              <span id="hero-heading">
                <DisplayHeading>
                  {headlineLead}{" "}
                  <span className="text-accent">{HERO.headlineAccent}</span>
                </DisplayHeading>
              </span>
              <BodyCopy className="mt-6 text-ink-body">{HERO.lead}</BodyCopy>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href={HERO.primaryCta.href} variant="primary">
                  {HERO.primaryCta.label}
                </LinkButton>
                <LinkButton href={HERO.secondaryCta.href} variant="secondary">
                  {HERO.secondaryCta.label}
                </LinkButton>
              </div>
              <p className="mt-6 text-sm text-ink-muted">{HERO.audience}</p>
            </div>
            <div className="lg:col-span-6">
              <ProductFrame
                image={productMedia.drawingFocus.image}
                alt={productMedia.drawingFocus.alt}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                caption={<Provenance>{HERO.mediaCaption}</Provenance>}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Problem ──────────────────────────────────────────── */}
      <Section
        id="problem"
        className="border-t border-line-subtle bg-surface-inset"
        aria-labelledby="problem-heading"
      >
        <Container>
          <SectionIntro
            id="problem-heading"
            eyebrow={PROBLEM.eyebrow}
            heading={PROBLEM.heading}
            lead={PROBLEM.lead}
          />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEM.pieces.map((piece) => (
              <li
                key={piece}
                className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised px-4 py-3 text-sm font-medium text-ink-body"
              >
                {piece}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-accent-deep bg-surface-raised px-4 py-3 text-sm font-semibold text-accent">
            <span aria-hidden="true">→</span>
            {PROBLEM.outcome}
          </p>
        </Container>
      </Section>

      {/* ── How it works ─────────────────────────────────────── */}
      <Section
        id="how-it-works"
        className="scroll-mt-20 border-t border-line-subtle"
        aria-labelledby="how-it-works-heading"
      >
        <Container>
          <SectionIntro
            id="how-it-works-heading"
            eyebrow={WORKFLOW.eyebrow}
            heading={WORKFLOW.heading}
            lead={WORKFLOW.lead}
          />
          <div className="mt-10">
            <WorkflowChain
              ariaLabel="LumenSync connected workflow"
              steps={[...WORKFLOW.steps]}
            />
          </div>
        </Container>
      </Section>

      {/* ── Drawings ─────────────────────────────────────────── */}
      <SplitFeature
        id="drawings"
        eyebrow={DRAWINGS.eyebrow}
        heading={DRAWINGS.heading}
        lead={DRAWINGS.lead}
        points={[...DRAWINGS.points]}
        cta={DRAWINGS.cta}
        media={
          <ProductFrame
            image={productMedia.drawingViewer.image}
            alt={productMedia.drawingViewer.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={<Provenance>{DRAWINGS.caption}</Provenance>}
          />
        }
      />

      {/* ── Checks ───────────────────────────────────────────── */}
      <SplitFeature
        id="checks"
        reverse
        eyebrow={CHECKS.eyebrow}
        heading={CHECKS.heading}
        lead={CHECKS.lead}
        points={[...CHECKS.points]}
        cta={CHECKS.cta}
        media={
          <ProductFrame
            image={productMedia.checks.image}
            alt={productMedia.checks.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={<Provenance>{CHECKS.caption}</Provenance>}
          />
        }
      >
        <Callout label={CHECKS.honesty.label} className="mt-8">
          {CHECKS.honesty.body}
        </Callout>
      </SplitFeature>

      {/* ── RFIs ─────────────────────────────────────────────── */}
      <SplitFeature
        id="rfis"
        eyebrow={RFIS.eyebrow}
        heading={RFIS.heading}
        lead={RFIS.lead}
        cta={RFIS.cta}
        media={
          <ProductFrame
            image={productMedia.rfiReview.image}
            alt={productMedia.rfiReview.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={<Provenance>{RFIS.caption}</Provenance>}
          />
        }
      >
        <ol
          aria-label="RFI workflow"
          className="mt-8 space-y-3 border-l border-line-strong pl-5"
        >
          {RFIS.steps.map((step, i) => (
            <li key={step.label} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[1.45rem] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-surface-base"
              />
              <p className="text-sm font-semibold text-ink-strong">
                <span className="mr-2 tabular-nums text-accent">{i + 1}.</span>
                {step.label}
              </p>
              <p className="mt-0.5 text-sm text-ink-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
        <Callout label={RFIS.honesty.label} className="mt-8">
          {RFIS.honesty.body}
        </Callout>
      </SplitFeature>

      {/* ── Field ────────────────────────────────────────────── */}
      <SplitFeature
        id="field"
        reverse
        eyebrow={FIELD.eyebrow}
        heading={FIELD.heading}
        lead={FIELD.lead}
        points={[...FIELD.points]}
        cta={FIELD.cta}
        media={
          <div className="grid items-start gap-6 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <ProductFrame
                variant="phone"
                image={productMedia.fieldMobile.image}
                alt={productMedia.fieldMobile.alt}
                caption={<Provenance>{FIELD.caption}</Provenance>}
              />
            </div>
            <div className="hidden sm:col-span-3 sm:block">
              <ProductFrame
                image={productMedia.fieldDesktop.image}
                alt={productMedia.fieldDesktop.alt}
                sizes="(min-width: 1024px) 34vw, 60vw"
                caption="Field — desktop layout with scheduled, wired and remaining totals."
              />
            </div>
          </div>
        }
      />

      {/* ── Fixtures ─────────────────────────────────────────── */}
      <SplitFeature
        id="fixtures"
        eyebrow={FIXTURES.eyebrow}
        heading={FIXTURES.heading}
        lead={FIXTURES.lead}
        points={[...FIXTURES.points]}
        cta={FIXTURES.cta}
        media={
          <ProductFrame
            image={productMedia.fixtureSchedule.image}
            alt={productMedia.fixtureSchedule.alt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            caption={<Provenance>{FIXTURES.caption}</Provenance>}
          />
        }
      />

      {/* ── Closeout / confidence ────────────────────────────── */}
      <Section
        id="closeout"
        className="border-t border-line-subtle bg-surface-inset"
        aria-labelledby="closeout-heading"
      >
        <Container>
          <SectionIntro
            id="closeout-heading"
            eyebrow={CLOSEOUT.eyebrow}
            heading={CLOSEOUT.heading}
            lead={CLOSEOUT.lead}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CLOSEOUT.outcomes.map((o) => (
              <li
                key={o.title}
                className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5"
              >
                <h3 className="text-sm font-semibold text-ink-strong">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {o.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <CtaBand
        id="cta"
        heading={FINAL_CTA.heading}
        body={FINAL_CTA.body}
        primary={FINAL_CTA.primary}
        secondary={FINAL_CTA.secondary}
      />
    </>
  );
}
