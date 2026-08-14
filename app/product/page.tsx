import Link from "next/link";
import {
  BodyCopy,
  Container,
  DisplayHeading,
  Eyebrow,
  LinkButton,
  Section,
} from "@/components/primitives";
import { pageMetadata } from "@/components/page-scaffold";
import { productPages } from "@/lib/site";

export const metadata = pageMetadata("/product");

export default function ProductOverviewPage() {
  return (
    <Section aria-labelledby="page-heading">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>Product</Eyebrow>
          <span id="page-heading">
            <DisplayHeading>
              One connected lighting project record.
            </DisplayHeading>
          </span>
          <BodyCopy className="mt-6">
            LumenSync organizes the lighting package, connects project
            information to the drawings, identifies coordination gaps, guides
            you directly to affected work, supports resolution, and carries
            project truth into the field and closeout.
          </BodyCopy>
          <div className="mt-8">
            <LinkButton href="/request-demo" variant="primary">
              Request a Demo
            </LinkButton>
          </div>
        </div>

        <h2 className="mt-16 text-xl font-bold tracking-tight text-ink-strong">
          Explore the platform
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productPages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="group rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5 transition-colors hover:border-accent-deep"
            >
              <h3 className="text-base font-semibold text-ink-strong group-hover:text-accent">
                {page.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
