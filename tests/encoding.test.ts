import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  CORRECT_ARROW,
  CORRECT_BOX_DRAWING,
  CORRECT_ELLIPSIS,
  CORRECT_EM_DASH,
  CORRECT_LEFT_DOUBLE_QUOTE,
  CORRECT_RIGHT_SINGLE_QUOTE,
  LSWEB023_CORRUPT_ARROW,
  LSWEB023_CORRUPT_BOX_DRAWING,
  LSWEB023_CORRUPT_EM_DASH,
  countReplacementChars,
  describeFinding,
  findMojibake,
  hasByteOrderMark,
  recoverRun,
} from "./mojibake";

/**
 * Source-level encoding guard (LSWEB-025).
 *
 * LSWEB-023 introduced 80 corrupted sequences into three content modules and
 * they reached production because no test looked at encoding. This walks the
 * real files on disk — not the imported modules — so a corrupted comment or a
 * stray byte-order mark is caught too, not just corrupted exported strings.
 */
const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const SCANNED_DIRECTORIES = ["lib", "app", "components", "e2e", "tests"];
const SCANNED_EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|cjs|css|md|json)$/;
const IGNORED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".next",
  "test-results",
]);

function collectFiles(directory: string, found: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (IGNORED_DIRECTORIES.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) collectFiles(full, found);
    else if (SCANNED_EXTENSIONS.test(entry.name) && statSync(full).size < 5_000_000) {
      found.push(full);
    }
  }
  return found;
}

const SOURCE_FILES = SCANNED_DIRECTORIES.flatMap((directory) =>
  collectFiles(path.join(REPO_ROOT, directory)),
);

describe("the mojibake detector itself", () => {
  it("catches the exact corruption LSWEB-023 shipped, and recovers the right character", () => {
    // This is the proof the guard would have failed against the old content.
    expect(recoverRun(LSWEB023_CORRUPT_EM_DASH)).toBe(CORRECT_EM_DASH);
    expect(recoverRun(LSWEB023_CORRUPT_ARROW)).toBe(CORRECT_ARROW);
    expect(recoverRun(LSWEB023_CORRUPT_BOX_DRAWING)).toBe(CORRECT_BOX_DRAWING);
  });

  it("flags corrupted copy in the shape production actually served", () => {
    const asProductionServedIt = `The schedule, the types and the paperwork ${LSWEB023_CORRUPT_EM_DASH} one record.`;
    const findings = findMojibake(asProductionServedIt);
    expect(findings).toHaveLength(1);
    expect(findings[0].intended).toBe(CORRECT_EM_DASH);
  });

  it("does not ban legitimate Unicode punctuation", () => {
    // The whole point: this must stay quiet for correctly-encoded text, or it
    // would just get disabled the first time someone typed a real em dash.
    const legitimate = [
      `Fixture schedules ${CORRECT_EM_DASH} tied to the drawings.`,
      `detected ${CORRECT_ARROW} needs review ${CORRECT_ARROW} issued`,
      `the drawing${CORRECT_RIGHT_SINGLE_QUOTE}s revision`,
      `${CORRECT_LEFT_DOUBLE_QUOTE}approved${CORRECT_LEFT_DOUBLE_QUOTE}`,
      `and so on${CORRECT_ELLIPSIS}`,
      CORRECT_BOX_DRAWING.repeat(40),
      "plain ASCII copy with no punctuation at all",
    ].join("\n");
    expect(findMojibake(legitimate)).toEqual([]);
  });

  it("recovers nothing from text that is merely non-ASCII", () => {
    expect(recoverRun(CORRECT_EM_DASH)).toBeNull();
    expect(recoverRun(CORRECT_ARROW)).toBeNull();
    expect(recoverRun(CORRECT_BOX_DRAWING.repeat(3))).toBeNull();
  });
});

describe("source files are free of encoding corruption", () => {
  it("scans a meaningful number of files", () => {
    expect(SOURCE_FILES.length).toBeGreaterThan(50);
  });

  for (const file of SOURCE_FILES) {
    const relative = path.relative(REPO_ROOT, file).replace(/\\/g, "/");
    it(`${relative} is clean UTF-8`, () => {
      const text = readFileSync(file, "utf8");

      const findings = findMojibake(text);
      expect(
        findings.map(describeFinding),
        `${relative} contains double-encoded text`,
      ).toEqual([]);

      expect(
        countReplacementChars(text),
        `${relative} contains U+FFFD replacement characters`,
      ).toBe(0);

      expect(
        hasByteOrderMark(text),
        `${relative} starts with a UTF-8 byte-order mark`,
      ).toBe(false);
    });
  }
});

describe("the LSWEB-023 regression specifically", () => {
  const AFFECTED = [
    "lib/content/product.ts",
    "lib/content/company.ts",
    "lib/content/conversion.ts",
  ];

  for (const relative of AFFECTED) {
    it(`${relative} has zero corrupted em dashes, arrows or banners`, () => {
      const text = readFileSync(path.join(REPO_ROOT, relative), "utf8");
      expect(text.includes(LSWEB023_CORRUPT_EM_DASH)).toBe(false);
      expect(text.includes(LSWEB023_CORRUPT_ARROW)).toBe(false);
      expect(text.includes(LSWEB023_CORRUPT_BOX_DRAWING)).toBe(false);
      expect(findMojibake(text)).toEqual([]);
    });
  }

  it("the frozen legal copy is clean and stays that way", () => {
    const text = readFileSync(
      path.join(REPO_ROOT, "lib/content/legal.ts"),
      "utf8",
    );
    expect(findMojibake(text)).toEqual([]);
    expect(countReplacementChars(text)).toBe(0);
    expect(hasByteOrderMark(text)).toBe(false);
  });
});
