import { Container, LinkButton, Section, TextLink } from "@/components/primitives";
import { Callout } from "@/components/marketing/callout";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { PageHero } from "@/components/marketing/page-hero";
import { pageMetadata } from "@/components/page-scaffold";
import { CONTACT as C } from "@/lib/content/conversion";
import { APP_URL } from "@/lib/site";

export const metadata = pageMetadata("/contact");

export default function ContactPage() {
  return (
    <>
      <PageHero hero={C.hero} />

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
        className="border-t border-line-subtle bg-surface-inset"
      >
        <Container>
          <div className="max-w-2xl">
            <h2
              id="note-heading"
              className="text-2xl font-bold tracking-tight text-ink-strong"
            >
              Straight about how to reach us
            </h2>
            <Callout label={C.honesty.label} className="mt-6">
              {C.honesty.body}
            </Callout>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">
              Security concerns are covered on the{" "}
              <TextLink href="/security">security page</TextLink>, and the{" "}
              <TextLink href="/product">product overview</TextLink> answers most
              &ldquo;does it do X?&rdquo; questions before you need to ask.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
