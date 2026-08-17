import { Container, LinkButton, Section, TextLink } from "@/components/primitives";
import { Callout } from "@/components/marketing/callout";
import { CtaBand } from "@/components/marketing/cta-band";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionIntro } from "@/components/marketing/section-intro";
import { pageMetadata } from "@/components/page-scaffold";
import { CONTACT as C } from "@/lib/content/conversion";
import { isDemoRequestEnabled } from "@/lib/demo-request/config";
import { APP_URL } from "@/lib/site";

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  // The page describes the routes that actually work on this deployment.
  const honesty = isDemoRequestEnabled() ? C.honesty.online : C.honesty.offline;

  return (
    <>
      <PageHero
        hero={C.hero}
        media={
          <div className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              {C.asks.heading}
            </h2>
            <ul className="mt-5 space-y-3.5">
              {C.asks.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                  />
                  <span className="text-sm leading-relaxed text-ink-body">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <FeatureGrid
        id="routes"
        eyebrow={C.routes.eyebrow}
        heading={C.routes.heading}
        items={C.routes.items}
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LinkButton href="/request-demo" variant="primary">
            Request a Demo
          </LinkButton>
          <LinkButton href={APP_URL} variant="secondary">
            Sign in to LumenSync
          </LinkButton>
        </div>
      </FeatureGrid>

      <Section
        id="note"
        aria-labelledby="note-heading"
        className="border-t border-line-subtle bg-surface-inset py-12 sm:py-16"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionIntro
                id="note-heading"
                eyebrow={C.honesty.eyebrow}
                heading={C.honesty.heading}
              />
            </div>
            <div className="lg:col-span-7">
              <Callout label={C.honesty.label}>{honesty}</Callout>
              <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                Security questions are answered on the{" "}
                <TextLink href="/security">security page</TextLink>, and the{" "}
                <TextLink href="/product">product overview</TextLink> answers
                most &ldquo;does it do X?&rdquo; questions before you need to
                ask.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        id="cta"
        heading="Bring us a real lighting package."
        body="A demo request is the fastest route to a working session — with the people who build LumenSync, against a package that looks like yours."
        primary={{ href: "/request-demo", label: "Request a Demo" }}
        secondary={{ href: "/why-lumensync", label: "Why We Built It" }}
      />
    </>
  );
}
