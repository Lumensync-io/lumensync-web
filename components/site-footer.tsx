import Link from "next/link";
import { Logo } from "./logo";
import { productPages, APP_URL } from "@/lib/site";

const companyLinks = [
  { path: "/why-lumensync", label: "Why LumenSync" },
  { path: "/security", label: "Security" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/request-demo", label: "Request a Demo" },
];

const legalLinks = [
  { path: "/legal/privacy", label: "Privacy Policy" },
  { path: "/legal/terms", label: "Terms of Service" },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { path: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {heading}
      </h2>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.path}>
            <Link
              href={l.path}
              className="text-sm text-ink-body hover:text-ink-strong"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line-subtle bg-surface-inset">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Lighting coordination intelligence for complex commercial
              projects — drawings, schedules, submittals, controls, and field
              status, finally connected.
            </p>
            <p className="mt-4 text-xs text-ink-faint">A TradeSync product</p>
          </div>
          <FooterColumn
            heading="Product"
            links={[
              { path: "/product", label: "Overview" },
              ...productPages.map((p) => ({ path: p.path, label: p.label })),
            ]}
          />
          <FooterColumn heading="Company" links={companyLinks} />
          <div>
            <FooterColumn heading="Legal" links={legalLinks} />
            <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Customers
            </h2>
            <a
              href={APP_URL}
              className="text-sm text-ink-body hover:text-ink-strong"
            >
              Sign in to LumenSync
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-line-subtle pt-6">
          <p className="text-xs leading-relaxed text-ink-faint">
            LumenSync is a project coordination aid and does not replace
            contract drawings, specifications, approved submittals, RFIs,
            engineer-of-record direction, manufacturer instructions, or
            applicable codes.
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            © {new Date().getFullYear()} LumenSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
