interface DiagramNode {
  title: string;
  tag: string;
}

/**
 * AccessDiagram — the /security hero visual.
 *
 * Drawn entirely from the design system's own surfaces, borders and type: no
 * imagery, no icon set, no illustration. It says one thing, and it is a thing
 * the product actually does — a request travels user → server authorization →
 * project data, and never user → project data.
 *
 * The labels are real text rather than a picture of text, so the diagram is
 * readable by a screen reader in the order the flow runs; the connectors are
 * decorative and hidden. `description` restates the flow as a caption for
 * anyone who cannot see the arrangement.
 */
function Connector() {
  return (
    <div aria-hidden="true" className="flex justify-center py-2">
      <svg width="14" height="26" viewBox="0 0 14 26" fill="none" className="text-line-strong">
        <path
          d="M7 0v18M3 14.5l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Node({
  node,
  emphasis = false,
}: {
  node: DiagramNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-control)] border px-4 py-3 ${
        emphasis
          ? "border-accent/60 bg-surface-overlay"
          : "border-line-subtle bg-surface-base"
      }`}
    >
      <p className="text-sm font-semibold text-ink-strong">{node.title}</p>
      <p
        className={`mt-1 text-xs ${emphasis ? "text-accent" : "text-ink-muted"}`}
      >
        {node.tag}
      </p>
    </div>
  );
}

export function AccessDiagram({
  frame,
  description,
  user,
  authorization,
  data,
  denied,
}: {
  frame: string;
  description: string;
  user: DiagramNode;
  authorization: DiagramNode;
  data: DiagramNode;
  denied: string;
}) {
  return (
    <figure className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {frame}
      </p>

      <div className="mt-5">
        <Node node={user} />
        <Connector />
        <Node node={authorization} emphasis />
        <Connector />
        <Node node={data} />
      </div>

      <figcaption className="mt-5 border-t border-line-subtle pt-4 text-xs leading-relaxed text-ink-muted">
        <span className="sr-only">{description} </span>
        <span aria-hidden="true">{denied}</span>
      </figcaption>
    </figure>
  );
}
