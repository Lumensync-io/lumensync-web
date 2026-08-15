import { render, screen } from "@testing-library/react";
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

import { findForbiddenContent } from "./forbidden-terms";
import { productPages, findPage } from "@/lib/site";
import { PRODUCT_AREA_BLURBS } from "@/lib/content/product";
import { DEMO_FORM_LIVE } from "@/lib/content/conversion";

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

  it("security page claims no certifications", () => {
    render(<SecurityPage />);
    const text = document.body.textContent ?? "";
    const disclaimer =
      "No SOC 2, ISO 27001, HIPAA, FedRAMP or PCI certification or attestation is held or in progress that we are announcing here.";
    expect(text).toContain(disclaimer);
    // Outside that one disclaimer sentence, no standard may be named at all.
    const rest = text.split(disclaimer).join(" ");
    for (const standard of ["SOC 2", "ISO 27001", "HIPAA", "FedRAMP", "PCI"]) {
      expect(rest, `${standard} may only appear in the disclaimer`).not.toContain(
        standard,
      );
    }
    expect(text).not.toMatch(/\bcertified\b|\bcompliant with\b|\battested\b/i);
  });

  it("request-demo is honest about the missing submission backend", () => {
    render(<RequestDemoPage />);
    expect(DEMO_FORM_LIVE).toBe(false);
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
