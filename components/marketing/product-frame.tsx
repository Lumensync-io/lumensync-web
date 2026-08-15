import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

/**
 * ProductFrame — presents a real LumenSync product capture inside a restrained
 * window/phone frame with an always-visible provenance caption. Every image
 * rendered here must come from `lib/product-media.ts` (synthetic demo project
 * only — see the public-asset hygiene test).
 */
export function ProductFrame({
  image,
  alt,
  caption,
  variant = "window",
  priority = false,
  sizes,
  className = "",
}: {
  image: StaticImageData;
  alt: string;
  caption: ReactNode;
  variant?: "window" | "phone";
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const isPhone = variant === "phone";
  return (
    <figure
      className={`${isPhone ? "mx-auto w-full max-w-[300px]" : "w-full"} ${className}`}
    >
      <div
        className={`overflow-hidden border border-line-strong bg-surface-overlay shadow-[var(--shadow-raised)] ${
          isPhone ? "rounded-[2rem] p-2" : "rounded-[var(--radius-card)]"
        }`}
      >
        {isPhone ? null : (
          <div
            className="flex items-center gap-1.5 border-b border-line-subtle bg-surface-inset px-3 py-2"
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="h-2 w-2 rounded-full bg-line-strong" />
            <span className="ml-2 truncate text-[11px] text-ink-faint">
              app.lumensync.io
            </span>
          </div>
        )}
        <Image
          src={image}
          alt={alt}
          priority={priority}
          sizes={
            sizes ?? (isPhone ? "300px" : "(min-width: 1024px) 50vw, 100vw")
          }
          className={`h-auto w-full ${isPhone ? "rounded-[1.5rem]" : ""}`}
        />
      </div>
      <figcaption className="mt-3 text-xs leading-relaxed text-ink-faint">
        {caption}
      </figcaption>
    </figure>
  );
}
