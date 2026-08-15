import type { Metadata } from "next";
import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  LinkButton,
  Section,
} from "@/components/primitives";
import { findPage } from "@/lib/site";

/**
 * Per-route metadata built from the single route registry in `lib/site.ts`, so
 * title, description, canonical and Open Graph can never drift apart. The
 * canonical is always a path resolved against `metadataBase`
 * (https://lumensync.io) — never a deployment host.
 */
export function pageMetadata(path: string): Metadata {
  const page = findPage(path);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: page.title,
      description: page.description,
    },
    twitter: {
      title: page.title,
      description: page.description,
    },
  };
}

/**
 * Restrained structural placeholder for routes whose full implementation
 * belongs to a later work item. Establishes heading hierarchy and page rhythm
 * without inventing content.
 */
export function PageScaffold({
  path,
  eyebrow,
  children,
}: {
  path: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  const page = findPage(path);
  if (!page) return null;
  return (
    <Section aria-labelledby="page-heading">
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <span id="page-heading">
            <DisplayHeading>{page.title}</DisplayHeading>
          </span>
          <BodyCopy className="mt-6">{page.description}</BodyCopy>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/request-demo" variant="primary">
              Request a Demo
            </LinkButton>
            <LinkButton href="/product" variant="secondary">
              Product Overview
            </LinkButton>
          </div>
        </div>
        {children}
      </Container>
    </Section>
  );
}
