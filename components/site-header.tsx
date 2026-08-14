import { Logo } from "./logo";
import { LinkButton } from "./primitives";
import { MobileNav, ProductMenu } from "./nav-client";
import { primaryNav, productPages, APP_URL } from "@/lib/site";
import Link from "next/link";

export function SiteHeader() {
  const restNav = primaryNav.filter((p) => p.path !== "/product");
  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-surface-base/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo />

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <ProductMenu items={productPages} />
          {restNav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-ink-body hover:text-ink-strong"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LinkButton href={APP_URL} variant="ghost">
            Sign In
          </LinkButton>
          <LinkButton href="/request-demo" variant="primary">
            Request a Demo
          </LinkButton>
        </div>

        {/* Mobile navigation */}
        <MobileNav primary={primaryNav} product={productPages} appUrl={APP_URL} />
      </div>
    </header>
  );
}
