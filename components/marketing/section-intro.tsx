import type { ReactNode } from "react";
import { BodyCopy, Eyebrow, SectionHeading } from "@/components/primitives";

/**
 * SectionIntro — eyebrow + h2 (with a stable id for aria-labelledby) + lead.
 * Keeps every marketing section on the same heading rhythm.
 */
export function SectionIntro({
  id,
  eyebrow,
  heading,
  lead,
  align = "left",
  className = "",
}: {
  id: string;
  eyebrow?: string;
  heading: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className}`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <span id={id}>
        <SectionHeading>{heading}</SectionHeading>
      </span>
      {lead ? (
        <BodyCopy className={`mt-4 text-ink-body ${centered ? "mx-auto" : ""}`}>
          {lead}
        </BodyCopy>
      ) : null}
    </div>
  );
}
