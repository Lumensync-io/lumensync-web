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
 * Restrained structural placeholder used by routes whose full implementation
 * belongs to later work items. Establishes the correct heading hierarchy,
 * metadata, and page rhythm without inventing content.
 */

export function pageMetadata(path: string): Metadata {
  const page = findPage(path);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
  };
}

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
        <p className="mt-16 max-w-3xl border-t border-line-subtle pt-6 text-sm text-ink-faint">
          The full {page.label.toLowerCase()} page is being built as part of the
          LumenSync website program and will feature real product functionality
          — no mockups, no fabricated claims.
        </p>
      </Container>
    </Section>
  );
}
