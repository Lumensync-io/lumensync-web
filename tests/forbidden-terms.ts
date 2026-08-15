import { createHash } from "node:crypto";
import {
  FORBIDDEN_PUBLIC_TERMS,
  FORBIDDEN_TERM_DIGESTS,
} from "@/lib/homepage-content";

/**
 * Shared forbidden-content matcher for unit + e2e tests.
 * Returns a list of human-readable hits (plain terms verbatim; hashed terms as
 * "digest:<first 8 hex>" so the private name is never printed).
 */
export function findForbiddenContent(text: string): string[] {
  const hits: string[] = [];
  for (const term of FORBIDDEN_PUBLIC_TERMS) {
    if (text.toLowerCase().includes(term.toLowerCase())) hits.push(term);
  }
  const digests = new Set(FORBIDDEN_TERM_DIGESTS);
  const tokens = text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const seen = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    for (let n = 1; n <= 3 && i + n <= tokens.length; n++) {
      const gram = tokens.slice(i, i + n).join("");
      if (seen.has(gram)) continue;
      seen.add(gram);
      const d = createHash("sha256").update(gram).digest("hex");
      if (digests.has(d)) hits.push(`digest:${d.slice(0, 8)}`);
    }
  }
  return hits;
}
