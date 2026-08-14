import Link from "next/link";

/**
 * LumenSync lockup: grid-and-node icon + wordmark.
 * Rebuilt from the approved brand asset (grid tile with central fixture node).
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="3"
        fill="#071629"
        stroke="#2F7DBD"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line x1="24" y1="3" x2="24" y2="45" stroke="#2F7DBD" strokeWidth="1.8" />
      <line x1="3" y1="24" x2="45" y2="24" stroke="#2F7DBD" strokeWidth="1.8" />
      <circle
        cx="24"
        cy="24"
        r="6.5"
        fill="#39C7F4"
        stroke="#F8FAFC"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="LumenSync home"
    >
      <LogoMark />
      <span className="text-lg font-extrabold tracking-tight">
        <span className="text-ink-strong">Lumen</span>
        <span className="text-accent-strong">Sync</span>
      </span>
    </Link>
  );
}
