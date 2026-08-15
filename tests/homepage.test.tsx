import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { HERO, HOMEPAGE_SECTION_ORDER } from "@/lib/homepage-content";
import { PRODUCT_MEDIA_SOURCE } from "@/lib/product-media";
import { findForbiddenContent } from "./forbidden-terms";

function renderHome() {
  return render(<HomePage />);
}

describe("homepage (WEB-004)", () => {
  it("renders exactly one h1 with the approved headline", () => {
    renderHome();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(HERO.headline);
  });

  it("hero primary CTA targets /request-demo and secondary targets how-it-works", () => {
    renderHome();
    const hero = document.getElementById("hero")!;
    const primary = within(hero).getByRole("link", {
      name: HERO.primaryCta.label,
    });
    expect(primary).toHaveAttribute("href", "/request-demo");
    const secondary = within(hero).getByRole("link", {
      name: HERO.secondaryCta.label,
    });
    expect(secondary).toHaveAttribute("href", "#how-it-works");
    expect(document.getElementById("how-it-works")).not.toBeNull();
  });

  it("renders every planned section in the approved order", () => {
    renderHome();
    const ids = HOMEPAGE_SECTION_ORDER.map((id) => document.getElementById(id));
    ids.forEach((el, i) => {
      expect(el, `section #${HOMEPAGE_SECTION_ORDER[i]} missing`).not.toBeNull();
    });
    for (let i = 1; i < ids.length; i++) {
      const before = ids[i - 1]!.compareDocumentPosition(ids[i]!);
      expect(before & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });

  it("every section is a labelled landmark region", () => {
    renderHome();
    for (const id of HOMEPAGE_SECTION_ORDER) {
      const el = document.getElementById(id)!;
      expect(el.tagName).toBe("SECTION");
      const labelledBy = el.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();
      expect(document.getElementById(labelledBy!)).not.toBeNull();
    }
  });

  it("uses only h2 for section headings and h3 beneath them", () => {
    renderHome();
    const levels = screen
      .getAllByRole("heading")
      .map((h) => Number(h.tagName.slice(1)));
    expect(levels.filter((l) => l === 1)).toHaveLength(1);
    expect(levels.every((l) => l <= 3)).toBe(true);
  });

  it("every product capture has descriptive alt text and a provenance caption", () => {
    renderHome();
    const imgs = screen.getAllByRole("img");
    expect(imgs.length).toBeGreaterThanOrEqual(6);
    for (const img of imgs) {
      expect((img.getAttribute("alt") ?? "").length).toBeGreaterThan(40);
    }
    const captions = Array.from(document.querySelectorAll("figcaption"));
    expect(captions.length).toBeGreaterThanOrEqual(6);
    const withProvenance = captions.filter((c) =>
      c.textContent?.includes(PRODUCT_MEDIA_SOURCE),
    );
    // Every distinct product surface is attributed at least once per section.
    expect(withProvenance.length).toBeGreaterThanOrEqual(6);
  });

  it("contains no forbidden brand, customer or hype terms", () => {
    renderHome();
    const text = document.body.textContent ?? "";
    expect(findForbiddenContent(text)).toEqual([]);
  });

  it("does not invent metrics: no percentages or dollar claims in copy", () => {
    renderHome();
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/\$\s?\d/);
    expect(text).not.toMatch(/\b(customers|testimonial|award|ROI)\b/i);
  });

  it("links each product section to its Plan v1.0 product page", () => {
    renderHome();
    const targets = [
      "/product/drawings",
      "/product/checks",
      "/product/rfis",
      "/product/field",
      "/product/fixtures",
    ];
    for (const href of targets) {
      const link = document.querySelector(`a[href="${href}"]`);
      expect(link, `missing link to ${href}`).not.toBeNull();
    }
  });
});
