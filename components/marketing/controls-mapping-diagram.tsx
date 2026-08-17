interface Side {
  title: string;
  tag: string;
}

/**
 * ControlsMappingDiagram — the /product/controls hero visual.
 *
 * Drawn from the design system's own surfaces rather than a product capture:
 * there is no controls-specific screenshot in `lib/product-media.ts`, and
 * inventing one would be a fabricated product screen. This states the page's
 * actual thesis instead — the fixture schedule and the controls package are
 * compared through a mapping that a manager enters and someone approves, and a
 * disagreement becomes a finding rather than a silent change.
 *
 * Labels are real text so a screen reader reads the relationship in order; the
 * connectors are decorative, and the caption restates the flow for anyone who
 * cannot see the arrangement.
 */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 26 14"
      fill="none"
      aria-hidden="true"
      className={`text-line-strong ${className}`}
    >
      <path
        d="M0 7h18M14.5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SideCard({ side }: { side: Side }) {
  return (
    <div className="rounded-[var(--radius-control)] border border-line-subtle bg-surface-base px-4 py-3">
      <p className="text-sm font-semibold text-ink-strong">{side.title}</p>
      <p className="mt-1 text-xs text-ink-muted">{side.tag}</p>
    </div>
  );
}

export function ControlsMappingDiagram({
  frame,
  schedule,
  controls,
  mapping,
  outcome,
  description,
}: {
  frame: string;
  schedule: Side;
  controls: Side;
  mapping: Side;
  outcome: string;
  description: string;
}) {
  return (
    <figure className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {frame}
      </p>

      <div className="mt-5 grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <SideCard side={schedule} />
        <div className="flex justify-center sm:rotate-0">
          <Arrow className="rotate-90 sm:rotate-0" />
        </div>
        <SideCard side={controls} />
      </div>

      <div className="mt-3 flex justify-center">
        <Arrow className="rotate-90" />
      </div>

      <div className="rounded-[var(--radius-control)] border border-accent/60 bg-surface-overlay px-4 py-3">
        <p className="text-sm font-semibold text-ink-strong">{mapping.title}</p>
        <p className="mt-1 text-xs text-accent">{mapping.tag}</p>
      </div>

      <figcaption className="mt-5 border-t border-line-subtle pt-4 text-xs leading-relaxed text-ink-muted">
        <span className="sr-only">{description} </span>
        <span aria-hidden="true">{outcome}</span>
      </figcaption>
    </figure>
  );
}
