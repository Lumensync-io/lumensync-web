export interface WorkflowStep {
  label: string;
  detail: string;
  href?: string;
}

/**
 * WorkflowChain — an ordered list rendered as a connected chain of steps.
 * Arrows are decorative; order is conveyed by the <ol> itself. Stacks
 * vertically on phones, becomes a horizontal chain on large screens.
 */
export function WorkflowChain({
  steps,
  ariaLabel,
}: {
  steps: WorkflowStep[];
  ariaLabel: string;
}) {
  return (
    <ol
      aria-label={ariaLabel}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2"
    >
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex lg:flex-col">
          <div className="flex w-full flex-col rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-4">
            <span className="text-xs font-bold tabular-nums text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 text-sm font-semibold text-ink-strong">
              {step.label}
            </span>
            <span className="mt-1 text-xs leading-relaxed text-ink-muted">
              {step.detail}
            </span>
          </div>
          {i < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-line-strong lg:block"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6h7M6 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
