import { Container, Section } from "@/components/primitives";
import { SectionIntro } from "./section-intro";

interface Surface {
  title: string;
  items: readonly string[];
}

/**
 * SurfaceSplit — two named systems side by side with an explicit gap between
 * them. Used on /security to show that the public marketing site and the
 * authenticated application are different surfaces, not two views of one.
 *
 * The separation is drawn, but it is also stated in words ("separated from")
 * so the meaning does not depend on seeing the divider.
 */
export function SurfaceSplit({
  id,
  eyebrow,
  heading,
  lead,
  website,
  application,
  note,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  lead: string;
  website: Surface;
  application: Surface;
  note: string;
}) {
  const panels = [website, application];
  return (
    <Section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-line-subtle bg-surface-inset"
    >
      <Container>
        <SectionIntro
          id={`${id}-heading`}
          eyebrow={eyebrow}
          heading={heading}
          lead={lead}
        />

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-0">
          <SurfacePanel surface={panels[0]} />

          <div
            aria-hidden="true"
            className="flex items-center justify-center gap-3 py-1 lg:flex-col lg:px-6 lg:py-0"
          >
            <span className="h-px flex-1 bg-line-subtle lg:h-full lg:w-px lg:flex-initial" />
            <span className="whitespace-nowrap rounded-full border border-line-subtle bg-surface-raised px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">
              Separated
            </span>
            <span className="h-px flex-1 bg-line-subtle lg:h-full lg:w-px lg:flex-initial" />
          </div>

          <SurfacePanel surface={panels[1]} />
        </div>

        <p className="mt-8 max-w-prose text-sm leading-relaxed text-ink-muted">
          {note}
        </p>
      </Container>
    </Section>
  );
}

function SurfacePanel({ surface }: { surface: Surface }) {
  return (
    <div className="h-full rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6">
      <h3 className="text-sm font-semibold text-ink-strong">{surface.title}</h3>
      <ul className="mt-4 space-y-2.5">
        {surface.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-strong"
            />
            <span className="text-sm leading-relaxed text-ink-body">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
