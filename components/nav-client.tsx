"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { PageDef } from "@/lib/site";

/* ── Desktop "Product" disclosure menu ─────────────────────── */

export function ProductMenu({ items }: { items: PageDef[] }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-ink-body hover:text-ink-strong"
      >
        Product
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 3l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open ? (
        <div
          id={menuId}
          className="absolute left-0 top-full mt-2 w-64 rounded-[var(--radius-card)] border border-line-subtle bg-surface-overlay p-2 shadow-[var(--shadow-raised)]"
        >
          <Link
            href="/product"
            onClick={close}
            className="block rounded-[var(--radius-control)] px-3 py-2 text-sm font-semibold text-ink-strong hover:bg-surface-raised"
          >
            Overview
          </Link>
          <div className="my-1 border-t border-line-subtle" aria-hidden="true" />
          {items.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={close}
              className="block rounded-[var(--radius-control)] px-3 py-2 text-sm text-ink-body hover:bg-surface-raised hover:text-ink-strong"
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Mobile navigation (accessible disclosure) ─────────────── */

export function MobileNav({
  primary,
  product,
  appUrl,
}: {
  primary: PageDef[];
  product: PageDef[];
  appUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const restNav = primary.filter((p) => p.path !== "/product");

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] text-ink-strong"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          {open ? (
            <path
              d="M4 4l14 14M18 4L4 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h16M3 11h16M3 16h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open ? (
        <div
          id={panelId}
          // Positioned relative to the sticky header (which is a containing
          // block because of `backdrop-blur`), so `absolute` + explicit height
          // rather than `fixed` — otherwise the panel collapses behind the page.
          className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line-subtle bg-surface-base px-5 pb-10 pt-4"
        >
          <nav aria-label="Mobile primary">
            <p className="px-1 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Product
            </p>
            <Link
              href="/product"
              onClick={close}
              className="block min-h-11 rounded-[var(--radius-control)] px-3 py-2.5 text-base font-medium text-ink-strong hover:bg-surface-raised"
            >
              Overview
            </Link>
            {product.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={close}
                className="block min-h-11 rounded-[var(--radius-control)] px-3 py-2.5 text-base text-ink-body hover:bg-surface-raised hover:text-ink-strong"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-3 border-t border-line-subtle" aria-hidden="true" />
            {restNav.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={close}
                className="block min-h-11 rounded-[var(--radius-control)] px-3 py-2.5 text-base font-medium text-ink-strong hover:bg-surface-raised"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-3 border-t border-line-subtle" aria-hidden="true" />
            <a
              href={appUrl}
              onClick={close}
              className="block min-h-11 rounded-[var(--radius-control)] px-3 py-2.5 text-base text-ink-body hover:bg-surface-raised"
            >
              Sign In
            </a>
            <Link
              href="/request-demo"
              onClick={close}
              className="mt-3 block min-h-11 rounded-[var(--radius-control)] bg-accent-strong px-3 py-2.5 text-center text-base font-semibold text-accent-ink"
            >
              Request a Demo
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
