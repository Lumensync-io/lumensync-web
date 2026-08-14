import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

/* ── Layout primitives ─────────────────────────────────────── */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={`py-16 sm:py-24 ${className}`} {...rest}>
      {children}
    </section>
  );
}

/* ── Typography primitives ─────────────────────────────────── */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
      {children}
    </p>
  );
}

export function DisplayHeading({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-ink-strong sm:text-5xl lg:text-6xl">
      {children}
    </h1>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-balance text-2xl font-bold tracking-tight text-ink-strong sm:text-3xl">
      {children}
    </h2>
  );
}

export function BodyCopy({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-prose text-base leading-relaxed sm:text-lg ${className}`}>
      {children}
    </p>
  );
}

/* ── Actions ───────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 py-2.5 text-sm font-semibold transition-colors";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-strong text-accent-ink hover:bg-accent focus-visible:bg-accent",
  secondary:
    "border border-line-strong text-ink-strong hover:border-accent hover:text-accent",
  ghost: "text-ink-body hover:text-ink-strong",
};

export function LinkButton({
  href,
  variant = "primary",
  children,
  className = "",
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = `${buttonBase} ${buttonVariants[variant]} ${className}`;
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `font-medium text-accent underline-offset-4 hover:underline ${className}`;
  if (href.startsWith("http")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
