import type { ReactNode } from "react";

/**
 * Callout — a short, bordered note used for "how LumenSync stays honest"
 * statements (review-required, nothing auto-issued, coordination aid). Uses an
 * icon + label, never colour alone.
 */
export function Callout({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-line-strong bg-surface-inset/60 p-4 ${className}`}
      role="note"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-strong">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          className="text-accent"
        >
          <path
            d="M7 1.5 12 3.5v3.3c0 2.9-2.1 5.1-5 5.7-2.9-.6-5-2.8-5-5.7V3.5L7 1.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path
            d="M4.8 7.1l1.5 1.5 3-3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-ink-body">
        {children}
      </div>
    </div>
  );
}
