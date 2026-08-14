import { describe, expect, it } from "vitest";
import {
  allPages,
  productPages,
  primaryNav,
  SITE_URL,
  APP_URL,
} from "@/lib/site";

describe("site configuration (Plan v1.0 IA)", () => {
  it("has unique route paths", () => {
    const paths = allPages.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("contains every required Plan v1.0 route", () => {
    const required = [
      "/",
      "/product",
      "/product/drawings",
      "/product/checks",
      "/product/fixtures",
      "/product/controls",
      "/product/field",
      "/product/rfis",
      "/product/closeout",
      "/why-lumensync",
      "/security",
      "/about",
      "/request-demo",
      "/contact",
      "/legal/privacy",
      "/legal/terms",
    ];
    const paths = allPages.map((p) => p.path);
    for (const route of required) {
      expect(paths).toContain(route);
    }
  });

  it("never includes legacy customer routes", () => {
    const paths = allPages.map((p) => p.path);
    expect(paths.some((p) => p.includes("cactus-club"))).toBe(false);
    expect(paths.some((p) => p.includes("project-login"))).toBe(false);
  });

  it("has exactly seven product feature pages", () => {
    expect(productPages).toHaveLength(7);
  });

  it("keeps Product as the first primary nav area", () => {
    expect(primaryNav[0]?.path).toBe("/product");
  });

  it("points at the correct production and app domains", () => {
    expect(SITE_URL).toBe("https://lumensync.io");
    expect(APP_URL).toBe("https://app.lumensync.io");
  });

  it("gives every page a title and description", () => {
    for (const page of allPages) {
      expect(page.title.length).toBeGreaterThan(3);
      expect(page.description.length).toBeGreaterThan(10);
    }
  });
});
