import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCT_MEDIA_SOURCE, productMedia } from "@/lib/product-media";
import { findForbiddenContent } from "./forbidden-terms";

/**
 * Public-repository asset hygiene gate. `lumensync-web` is PUBLIC, so every
 * image under public/product/ must be a registered demo-tenant capture, and
 * no tracked text may name customers, parent brands or credentials.
 */
const ROOT = path.resolve(import.meta.dirname, "..");
const PRODUCT_DIR = path.join(ROOT, "public", "product");

const SECRET_PATTERNS: RegExp[] = [
  /service_role/i,
  /sb_secret_/i,
  /eyJhbGciOi[A-Za-z0-9_-]{20,}/, // JWT
  /[a-z]{20}\.supabase\.co/i,
  /sb-[a-z]{20}-auth-token/i,
  /AccountKey=/i,
  /SharedAccessSignature/i,
  /[?&]sig=[A-Za-z0-9%]{20,}/,
  /ghp_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /AKIA[0-9A-Z]{12,}/,
  /vercel_[a-z0-9]{20,}/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  // Any real e-mail address. RFC 2606 reserves example.com/net/org precisely so
  // that documentation and test fixtures can name an address that can never
  // belong to a person, so those are the one allowed shape.
  /\b[A-Za-z0-9._%+-]+@(?!lumensync\.io\b)(?!(?:[A-Za-z0-9-]+\.)*example\.(com|net|org)\b)[A-Za-z0-9.-]+\.[a-z]{2,}\b/,
  /\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/, // phone
];

function walk(dir: string, out: string[] = []) {
  for (const entry of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", ".vercel"].includes(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe("public asset hygiene", () => {
  it("every file under public/product is a registered demo-tenant capture", () => {
    const files = readdirSync(PRODUCT_DIR).filter((f) =>
      statSync(path.join(PRODUCT_DIR, f)).isFile(),
    );
    const registered = new Set(Object.values(productMedia).map((m) => m.file));
    for (const f of files) {
      expect(registered.has(f), `unregistered public asset: ${f}`).toBe(true);
      expect(f.endsWith(".webp"), `non-webp asset: ${f}`).toBe(true);
    }
    for (const f of registered) {
      expect(files.includes(f), `registered asset missing on disk: ${f}`).toBe(
        true,
      );
    }
  });

  it("registry states the synthetic demo-tenant provenance", () => {
    expect(PRODUCT_MEDIA_SOURCE).toMatch(/demo project/i);
    expect(PRODUCT_MEDIA_SOURCE).toMatch(/not a customer/i);
    for (const m of Object.values(productMedia)) {
      expect(m.alt.length).toBeGreaterThan(40);
      expect(m.surface.length).toBeGreaterThan(5);
    }
  });

  it("no forbidden names or secret-like strings in tracked text", () => {
    const offenders: string[] = [];
    const files = walk(ROOT).filter((f) =>
      /\.(tsx?|mts|mjs|css|md|svg|txt|json|ya?ml)$/.test(f),
    );
    for (const full of files) {
      const rel = path.relative(ROOT, full);
      if (rel === "package-lock.json") continue;
      // This file defines the patterns; skip it to avoid self-matching.
      if (rel === path.join("tests", "public-assets.test.ts")) continue;
      const text = readFileSync(full, "utf8");
      // The forbidden-term list itself is allowed to contain the plain terms.
      if (!rel.endsWith(path.join("lib", "homepage-content.ts"))) {
        for (const hit of findForbiddenContent(text)) {
          // Test/spec files may reference the plain hype/brand terms in
          // assertions, but never the hashed customer/private names.
          if (!hit.startsWith("digest:") && /^(tests|e2e)[\\/]/.test(rel))
            continue;
          offenders.push(`${rel}: ${hit}`);
        }
      }
      for (const re of SECRET_PATTERNS) {
        if (re.test(text)) offenders.push(`${rel}: ${re}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
