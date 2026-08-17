/**
 * Mojibake detection (LSWEB-025).
 *
 * LSWEB-023 shipped 54 double-encoded em dashes, 4 arrows and 22 corrupted
 * comment banners to production. They rendered as visible garbage on 14 of 16
 * public routes and three consecutive green test runs missed them, because
 * nothing asserted encoding. This is that assertion.
 *
 * How it works
 * ------------
 * Mojibake is what you get when UTF-8 bytes are decoded as CP1252 and then
 * re-encoded as UTF-8. It therefore always appears as a CONTIGUOUS RUN of
 * non-ASCII characters which, when each character is mapped back to the CP1252
 * byte it came from, forms valid UTF-8 that is SHORTER than the run.
 *
 * So we do not pattern-match against a blocklist of garbage sequences — we
 * reverse the corruption and see whether it round-trips. That matters because
 * it means legitimate Unicode is safe by construction:
 *
 *   - em dash U+2014      -> CP1252 byte 0x94, invalid standalone UTF-8 -> not flagged
 *   - arrow U+2192        -> no CP1252 byte at all                      -> not flagged
 *   - curly quote U+2019  -> CP1252 byte 0x92, invalid standalone UTF-8 -> not flagged
 *   - box drawing U+2500  -> no CP1252 byte at all                      -> not flagged
 *
 * This file is deliberately written in pure ASCII: every non-ASCII character it
 * needs is constructed from its codepoint. A guard that could itself be
 * corrupted would be worthless.
 */

/** CP1252 0x80-0x9F -> Unicode. Undefined slots map to the C1 control of the same value. */
const CP1252_HIGH = [
  0x20ac, 0x0081, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6,
  0x2030, 0x0160, 0x2039, 0x0152, 0x008d, 0x017d, 0x008f, 0x0090, 0x2018,
  0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x02dc, 0x2122, 0x0161,
  0x203a, 0x0153, 0x009d, 0x017e, 0x0178,
];

const CODEPOINT_TO_BYTE = new Map<number, number>();
for (let byte = 0; byte <= 0xff; byte += 1) {
  const codepoint =
    byte >= 0x80 && byte <= 0x9f ? CP1252_HIGH[byte - 0x80] : byte;
  if (!CODEPOINT_TO_BYTE.has(codepoint)) CODEPOINT_TO_BYTE.set(codepoint, byte);
}

const STRICT_UTF8 = new TextDecoder("utf-8", { fatal: true });
const REPLACEMENT_CHAR = String.fromCharCode(0xfffd);
const BYTE_ORDER_MARK = String.fromCharCode(0xfeff);
const NON_ASCII_RUN = /[^\x00-\x7F]+/gu;

export interface MojibakeFinding {
  /** Character offset of the corrupted run. */
  index: number;
  /** The corrupted text exactly as it appears. */
  run: string;
  /** What the text was before it was corrupted — the correct replacement. */
  intended: string;
}

/**
 * Reverse a single candidate run. Returns the intended text, or null when the
 * run is legitimate Unicode rather than mojibake.
 */
export function recoverRun(run: string): string | null {
  const bytes: number[] = [];
  for (const character of run) {
    const byte = CODEPOINT_TO_BYTE.get(character.codePointAt(0) as number);
    if (byte === undefined) return null;
    bytes.push(byte);
  }

  let decoded: string;
  try {
    decoded = STRICT_UTF8.decode(new Uint8Array(bytes));
  } catch {
    return null;
  }

  if (decoded.includes(REPLACEMENT_CHAR)) return null;
  // Control characters mean we decoded noise, not text.
  if ([...decoded].some((c) => (c.codePointAt(0) as number) < 0x20)) return null;
  // Real mojibake always expands: n corrupted characters from fewer real ones.
  if ([...decoded].length >= [...run].length) return null;
  return decoded;
}

/** Every confirmed mojibake run in `text`. Legitimate Unicode is ignored. */
export function findMojibake(text: string): MojibakeFinding[] {
  const findings: MojibakeFinding[] = [];
  for (const match of text.matchAll(NON_ASCII_RUN)) {
    const run = match[0];
    const intended = recoverRun(run);
    if (intended !== null) {
      findings.push({ index: match.index ?? 0, run, intended });
    }
  }
  return findings;
}

/** Unicode replacement characters — a decode already went wrong upstream. */
export function countReplacementChars(text: string): number {
  return text.split(REPLACEMENT_CHAR).length - 1;
}

export function hasByteOrderMark(text: string): boolean {
  return text.startsWith(BYTE_ORDER_MARK);
}

/** Codepoint listing, for failure messages that survive any console encoding. */
export function describeCodepoints(text: string): string {
  return [...text]
    .map(
      (c) =>
        `U+${(c.codePointAt(0) as number)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")}`,
    )
    .join(" ");
}

export function describeFinding(finding: MojibakeFinding): string {
  return `offset ${finding.index}: ${describeCodepoints(
    finding.run,
  )} should be ${describeCodepoints(finding.intended)}`;
}

/**
 * The exact corruption LSWEB-023 shipped, rebuilt from codepoints so the
 * fixture cannot be silently "fixed" by an editor or a stray reformat.
 *
 * LSWEB023_CORRUPT_EM_DASH is what an em dash looked like in production:
 * U+00E2 U+20AC U+201D, i.e. bytes C3 A2 E2 82 AC E2 80 9D.
 */
export const LSWEB023_CORRUPT_EM_DASH = String.fromCharCode(
  0x00e2,
  0x20ac,
  0x201d,
);
export const LSWEB023_CORRUPT_ARROW = String.fromCharCode(
  0x00e2,
  0x2020,
  0x2019,
);
export const LSWEB023_CORRUPT_BOX_DRAWING = String.fromCharCode(
  0x00e2,
  0x201d,
  0x20ac,
);
export const CORRECT_EM_DASH = String.fromCharCode(0x2014);
export const CORRECT_ARROW = String.fromCharCode(0x2192);
export const CORRECT_BOX_DRAWING = String.fromCharCode(0x2500);
export const CORRECT_RIGHT_SINGLE_QUOTE = String.fromCharCode(0x2019);
export const CORRECT_LEFT_DOUBLE_QUOTE = String.fromCharCode(0x201c);
export const CORRECT_ELLIPSIS = String.fromCharCode(0x2026);
