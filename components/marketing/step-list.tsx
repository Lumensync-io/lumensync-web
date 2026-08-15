import type { Step } from "@/lib/content/types";

/**
 * StepList — an ordered, vertically-ruled sequence. Order is carried by the
 * <ol>; the numerals and the rule are presentational.
 */
export function StepList({
  steps,
  ariaLabel,
  className = "",
}: {
  steps: readonly Step[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <ol
      aria-label={ariaLabel}
      className={`space-y-3 border-l border-line-strong pl-5 ${className}`}
    >
      {steps.map((step, i) => (
        <li key={step.label} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[1.45rem] top-1.5 h-2.5 w-2.5 rounded-full border border-accent bg-surface-base"
          />
          <p className="text-sm font-semibold text-ink-strong">
            <span className="mr-2 tabular-nums text-accent">{i + 1}.</span>
            {step.label}
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
            {step.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
