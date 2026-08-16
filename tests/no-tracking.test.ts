import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The V1 decision is that this site carries no analytics and no tracking of any
 * kind. The privacy page states that as fact, so it is enforced here rather
 * than left to reviewer memory: any attempt to add a tag manager, a pixel, a
 * cookie or browser storage fails this suite.
 */

const ROOT = process.cwd();
const SOURCE_DIRS = ["app", "components", "lib"];
const SOURCE_EXTENSIONS = [".ts", ".tsx", ".css"];

function collect(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      collect(path, found);
    } else if (SOURCE_EXTENSIONS.some((ext) => entry.endsWith(ext))) {
      found.push(path);
    }
  }
  return found;
}

const files = SOURCE_DIRS.flatMap((dir) => collect(join(ROOT, dir)));
const sources = files.map((file) => ({
  file: file.replace(ROOT, "").replace(/\\/g, "/"),
  text: readFileSync(file, "utf8"),
}));

const TRACKING_PATTERNS: [string, RegExp][] = [
  ["Google Analytics / gtag", /gtag\(|googletagmanager|google-analytics|\bga\(/i],
  [
    "Tag manager or pixel",
    /\bfbq\(|facebook\.net|hotjar\.com|clarity\.ms|cdn\.segment\.(com|io)|mixpanel\.com|amplitude\.com|posthog\.com|plausible\.io|usefathom\.com|matomo\.(cloud|org)|heapanalytics\.com/i,
  ],
  ["Vercel analytics packages", /@vercel\/(analytics|speed-insights)/i],
  ["Cookies", /document\.cookie|\bSet-Cookie\b|\bcookies\(\)/i],
  ["Browser storage", /localStorage|sessionStorage|indexedDB/i],
  ["Third-party script tag", /<script[^>]+src=["']https?:\/\//i],
  ["Third-party iframe", /<iframe[^>]+src=["']https?:\/\//i],
  ["Remote font", /fonts\.googleapis\.com|fonts\.gstatic\.com|@import\s+url\(["']?https?:/i],
];

describe("no analytics, no tracking, no cookies", () => {
  it.each(TRACKING_PATTERNS)("has no %s anywhere in the source", (_label, pattern) => {
    const hits = sources
      .filter((source) => pattern.test(source.text))
      .map((source) => source.file);
    expect(hits).toEqual([]);
  });

  it("declares no analytics or tracking dependency", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    const deps = Object.keys({
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    });
    const suspicious = deps.filter((name) =>
      /analytics|tracking|gtag|segment|mixpanel|amplitude|posthog|hotjar|insight/i.test(
        name,
      ),
    );
    expect(suspicious).toEqual([]);
  });

  it("keeps the runtime dependency surface small", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    // next, react, react-dom. A new runtime dependency is a deliberate choice,
    // not something that should arrive quietly with a feature.
    expect(Object.keys(pkg.dependencies ?? {}).sort()).toEqual([
      "next",
      "react",
      "react-dom",
    ]);
  });
});

describe("delivery credentials never reach the browser", () => {
  it("keeps the demo-request configuration out of client components", () => {
    const clientFiles = sources.filter((source) =>
      /^["']use client["']/m.test(source.text),
    );
    expect(clientFiles.length).toBeGreaterThan(0);
    for (const source of clientFiles) {
      expect(source.text, source.file).not.toMatch(/demo-request\/config/);
      expect(source.text, source.file).not.toMatch(
        /DEMO_REQUEST_(WEBHOOK_URL|WEBHOOK_TOKEN|FORM_SECRET)/,
      );
      expect(source.text, source.file).not.toMatch(/process\.env/);
    }
  });

  it("never exposes a delivery variable through NEXT_PUBLIC_", () => {
    for (const source of sources) {
      expect(source.text, source.file).not.toMatch(/NEXT_PUBLIC_DEMO_REQUEST/);
    }
  });
});
