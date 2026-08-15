import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { SectionIntro } from "./section-intro";
import { PRODUCT_AREA_BLURBS } from "@/lib/content/product";
import { productPages } from "@/lib/site";

/**
 * ProductNavGrid — the seven product areas as cards. Used on /product and at
 * the foot of every product page so a visitor can move sideways without
 * returning to the navigation.
 */
export function ProductNavGrid({
  id = "areas",
  eyebrow = "Product areas",
  heading = "Explore the product",
  lead,
  exclude,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  heading?: string;
  lead?: string;
  /** Path of the current page, omitted from the grid. */
  exclude?: string;
  className?: string;
}) {
  const items = productPages.filter((p) => p.path !== exclude);
  return (
    <Section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`border-t border-line-subtle ${className}`}
    >
      <Container>
        <SectionIntro
          id={`${id}-heading`}
          eyebrow={eyebrow}
          heading={heading}
          lead={lead}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((page) => (
            <li key={page.path}>
              <Link
                href={page.path}
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5 transition-colors hover:border-accent-deep"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-ink-strong group-hover:text-accent">
                  {page.title}
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                </span>
                <span className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {PRODUCT_AREA_BLURBS[page.path]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
