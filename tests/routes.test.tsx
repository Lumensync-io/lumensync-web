import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Metadata } from "next";

import HomePage from "@/app/page";
import ProductPage, { metadata as productMeta } from "@/app/product/page";
import DrawingsPage, {
  metadata as drawingsMeta,
} from "@/app/product/drawings/page";
import ChecksPage, { metadata as checksMeta } from "@/app/product/checks/page";
import FixturesPage, {
  metadata as fixturesMeta,
} from "@/app/product/fixtures/page";
import ControlsPage, {
  metadata as controlsMeta,
} from "@/app/product/controls/page";
import RfisPage, { metadata as rfisMeta } from "@/app/product/rfis/page";
import FieldPage, { metadata as fieldMeta } from "@/app/product/field/page";
import CloseoutPage, {
  metadata as closeoutMeta,
} from "@/app/product/closeout/page";
import WhyPage, { metadata as whyMeta } from "@/app/why-lumensync/page";
import SecurityPage, { metadata as securityMeta } from "@/app/security/page";
import AboutPage, { metadata as aboutMeta } from "@/app/about/page";
import RequestDemoPage, {
  metadata as demoMeta,
} from "@/app/request-demo/page";
import ContactPage, { metadata as contactMeta } from "@/app/contact/page";
import PrivacyPage from "@/app/legal/privacy/page";
import TermsPage from "@/app/legal/terms/page";

import { findForbiddenContent } from "./forbidden-terms";
import { productPages, findPage } from "@/lib/site";
import { PRODUCT_AREA_BLURBS } from "@/lib/content/product";
import {
  DEMO_FORM_LIVE_NOTICE,
  DEMO_FORM_UNAVAILABLE,
} from "@/lib/content/conversion";
import { DemoRequestForm } from "@/components/demo-request-form";
import { isDemoRequestEnabled } from "@/lib/demo-request/config";
import {
  DEMO_REQUEST_FIELDS,
  HONEYPOT_FIELD,
} from "@/lib/demo-request/schema";

interface RouteCase {
  path: string;
  Component: () => React.ReactElement;
  metadata: Metadata;
}

const ROUTES: RouteCase[] = [
  { path: "/product", Component: ProductPage, metadata: productMeta },
  { path: "/product/drawings", Component: DrawingsPage, metadata: drawingsMeta },
  { path: "/product/checks", Component: ChecksPage, metadata: checksMeta },
  { path: "/product/fixtures", Component: FixturesPage, metadata: fixturesMeta },
  { path: "/product/controls", Component: ControlsPage, metadata: controlsMeta },
  { path: "/product/rfis", Component: RfisPage, metadata: rfisMeta },
  { path: "/product/field", Component: FieldPage, metadata: fieldMeta },
  { path: "/product/closeout", Component: CloseoutPage, metadata: closeoutMeta },
  { path: "/why-lumensync", Component: WhyPage, metadata: whyMeta },
  { path: "/security", Component: SecurityPage, metadata: securityMeta },
  { path: "/about", Component: AboutPage, metadata: aboutMeta },
  { path: "/request-demo", Component: RequestDemoPage, metadata: demoMeta },
  { path: "/contact", Component: ContactPage, metadata: contactMeta },
];

describe("core site routes (LSWEB-005)", () => {
  it.each(ROUTES)("$path renders exactly one h1", ({ Component }) => {
    render(<Component />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it.each(ROUTES)("$path uses a sane heading hierarchy", ({ Component }) => {
    render(<Component />);
    const levels = screen
      .getAllByRole("heading")
      .map((h) => Number(h.tagName.slice(1)));
    expect(levels[0]).toBe(1);
    expect(Math.max(...levels)).toBeLessThanOrEqual(3);
    // No level is skipped relative to the previous heading.
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it.each(ROUTES)(
    "$path has unique-per-page title, description and a lumensync.io canonical",
    ({ path, metadata }) => {
      const page = findPage(path)!;
      expect(metadata.title).toBe(page.title);
      expect(String(metadata.description ?? "").length).toBeGreaterThan(60);
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.openGraph?.title).toBe(page.title);
      expect(JSON.stringify(metadata)).not.toMatch(/vercel\.app/);
    },
  );

  it("every route's title and description are unique across the site", () => {
    const titles = ROUTES.map((r) => String(r.metadata.title));
    const descriptions = ROUTES.map((r) => String(r.metadata.description));
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it.each(ROUTES)("$path has no forbidden brand or customer text", ({ Component }) => {
    render(<Component />);
    expect(findForbiddenContent(document.body.textContent ?? "")).toEqual([]);
  });

  it.each(ROUTES)("$path invents no metrics or social proof", ({ Component }) => {
    render(<Component />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\$\s?\d/);
    expect(text).not.toMatch(/\b\d+\+?\s+(customers|contractors|projects|users|companies)\b/i);
    expect(text).not.toMatch(/\b(testimonial|award-winning|industry-leading|best-in-class)\b/i);
  });

  it.each(ROUTES.filter((r) => r.path !== "/request-demo"))(
    "$path routes to the demo request",
    ({ Component }) => {
      render(<Component />);
      expect(
        document.querySelectorAll('a[href="/request-demo"]').length,
      ).toBeGreaterThanOrEqual(1);
    },
  );

  it("every product page links to the other product areas", () => {
    for (const page of productPages) {
      const route = ROUTES.find((r) => r.path === page.path)!;
      const { unmount } = render(<route.Component />);
      const others = productPages.filter((p) => p.path !== page.path);
      for (const other of others) {
        expect(
          document.querySelector(`a[href="${other.path}"]`),
          `${page.path} should link to ${other.path}`,
        ).not.toBeNull();
      }
      unmount();
    }
  });

  it("every product area has a navigation blurb", () => {
    for (const page of productPages) {
      expect(PRODUCT_AREA_BLURBS[page.path]?.length ?? 0).toBeGreaterThan(30);
    }
  });

  it.each(ROUTES)("$path states product boundaries without overclaiming", ({ Component, path }) => {
    render(<Component />);
    const text = (document.body.textContent ?? "").toLowerCase();
    // No page may imply autonomous issuance or building-automation control.
    expect(text).not.toContain("automatically issues");
    expect(text).not.toContain("sends the rfi");
    if (path === "/product/controls") {
      expect(text).toContain("never touches a live system");
    }
    if (path === "/product/checks") {
      expect(text).toContain("findings, not verdicts");
    }
  });

  it("security page claims no certifications and names no standard", () => {
    render(<SecurityPage />);
    const text = document.body.textContent ?? "";
    // Stricter than the previous rule: the page used to be allowed to name
    // these inside one disclaimer sentence. It no longer carries a disclaimer,
    // so a standard appearing anywhere is a claim, and a defect.
    for (const standard of [
      "SOC 2",
      "SOC2",
      "ISO 27001",
      "HIPAA",
      "FedRAMP",
      "PCI",
    ]) {
      expect(text, `${standard} must not appear on /security`).not.toContain(
        standard,
      );
    }
    expect(text).not.toMatch(/\bcertified\b|\bcompliant with\b|\battested\b/i);
    // Nor may it imply assurance work that has not been done.
    expect(text).not.toMatch(
      /penetration test|\bpen test\b|\bSOC\b|zero trust|military-grade|bank-grade/i,
    );
    // Capabilities that are not implemented must not be advertised.
    expect(text).not.toMatch(
      /\bMFA\b|multi-factor|\bSSO\b|single sign-on|\bSCIM\b|\bSIEM\b|intrusion detection|uptime SLA|data residency|encryption at rest/i,
    );
    // Nor may it promise continuity or recovery commitments that do not exist.
    expect(text).not.toMatch(
      /\bRPO\b|\bRTO\b|24\/7|\bbackups?\b|guaranteed|cyber ?insurance/i,
    );
    // What it must do: state the access model and the release discipline.
    expect(text).toContain("Authenticated access");
    expect(text).toContain("Project-scoped permissions");
    expect(text).toContain("Controlled rollback");
    expect(text).toContain("We make security claims carefully.");
  });

  it("request-demo is inactive and says so while delivery is unconfigured", () => {
    // No delivery destination is configured in a checkout, so this renders the
    // fail-closed state — the same state a deployment without the environment
    // variables gets.
    expect(isDemoRequestEnabled()).toBe(false);
    render(<RequestDemoPage />);
    const submit = screen.getByRole("button", { name: "Request a Demo" });
    expect(submit).toBeDisabled();
    for (const input of Array.from(document.querySelectorAll("input, textarea"))) {
      expect(input).toBeDisabled();
    }
    const status = document.getElementById("form-status");
    expect(status?.textContent ?? "").toMatch(/aren't switched on yet/i);
    // Every field is still labelled for screen readers.
    for (const input of Array.from(document.querySelectorAll("input, textarea"))) {
      const id = input.getAttribute("id")!;
      expect(document.querySelector(`label[for="${id}"]`)).not.toBeNull();
    }
  });

  it("request-demo form is live and honest when delivery is configured", () => {
    render(
      <DemoRequestForm
        enabled
        unavailableNotice={DEMO_FORM_UNAVAILABLE}
        liveNotice={DEMO_FORM_LIVE_NOTICE}
      />,
    );
    expect(screen.getByRole("button", { name: "Request a Demo" })).toBeEnabled();
    for (const field of DEMO_REQUEST_FIELDS) {
      const control = document.getElementById(field.id);
      expect(control, field.id).not.toBeNull();
      expect(control).toBeEnabled();
      expect(document.querySelector(`label[for="${field.id}"]`)).not.toBeNull();
    }
    const status = document.getElementById("form-status");
    expect(status?.textContent ?? "").not.toMatch(/aren't switched on yet/i);
    // The decoy field is hidden from everyone who is not a bot.
    const honeypot = document.getElementById(HONEYPOT_FIELD)!;
    expect(honeypot.getAttribute("tabindex")).toBe("-1");
    expect(honeypot.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("legal pages separate factual disclosure from what still needs approval", () => {
    for (const [name, Component] of [
      ["privacy", PrivacyPage],
      ["terms", TermsPage],
    ] as const) {
      cleanup();
      render(<Component />);
      const text = document.body.textContent ?? "";
      expect(screen.getAllByRole("heading", { level: 1 }), name).toHaveLength(1);
      // The published version says plainly that counsel has not seen it, and
      // keeps the outstanding items visible rather than papering over them.
      expect(text, name).toMatch(/Still with counsel/);
      expect(text, name).toMatch(/has not yet been reviewed by a lawyer/);
      expect(text, name).toMatch(/Effective/);
      // No commitment that was not actually decided.
      expect(text, name).not.toMatch(/we (guarantee|promise|warrant)\b/i);
      expect(text, name).not.toMatch(/\bwe will never\b/i);
      expect(text, name).not.toMatch(/\b\d+\s+(days?|months?|years?)\b/i);
      expect(text, name).not.toMatch(/governed by the laws|exclusive jurisdiction/i);
    }
  });

  it("contact page publishes no invented contact endpoint", () => {
    render(<ContactPage />);
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/@[a-z0-9-]+\.[a-z]{2,}/i);
    expect(text).not.toMatch(/\(\d{3}\)|\d{3}-\d{3}-\d{4}/);
    expect(document.querySelector('a[href="/request-demo"]')).not.toBeNull();
  });

  it("homepage still renders after the shared-component refactor", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
