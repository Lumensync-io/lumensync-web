/**
 * Demo-request field definitions and validation.
 *
 * Pure and dependency-free on purpose: the same rules run in the browser for
 * immediate feedback and on the server as the authority. The server never
 * trusts a client-side result — it re-runs `validateDemoRequest` on the parsed
 * request body.
 */

/** Requests larger than this are rejected before parsing. */
export const MAX_BODY_BYTES = 16_384;

/** Name of the decoy field. A real person never fills this in. */
export const HONEYPOT_FIELD = "website";

/** Shortest plausible time a person needs to complete the form. */
export const MIN_FILL_MS = 3_000;

/** Form tokens go stale so a harvested one cannot be replayed indefinitely. */
export const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

export type FieldId = "name" | "email" | "company" | "role" | "message";

export interface FieldDef {
  id: FieldId;
  label: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  required: boolean;
  maxLength: number;
  hint?: string;
}

export const DEMO_REQUEST_FIELDS: readonly FieldDef[] = [
  {
    id: "name",
    label: "Name",
    type: "text",
    autoComplete: "name",
    required: true,
    maxLength: 80,
  },
  {
    id: "email",
    label: "Work email",
    type: "email",
    autoComplete: "email",
    required: true,
    maxLength: 160,
  },
  {
    id: "company",
    label: "Company",
    type: "text",
    autoComplete: "organization",
    required: true,
    maxLength: 120,
  },
  {
    id: "role",
    label: "Role",
    type: "text",
    autoComplete: "organization-title",
    required: false,
    maxLength: 80,
    hint: "Optional",
  },
  {
    id: "message",
    label: "What you'd like to see",
    type: "textarea",
    required: false,
    maxLength: 2_000,
    hint: "Optional",
  },
] as const;

export type DemoRequestValues = Record<FieldId, string>;

export type FieldErrors = Partial<Record<FieldId | "form", string>>;

export type ValidationResult =
  | { ok: true; values: DemoRequestValues }
  | { ok: false; errors: FieldErrors };

/**
 * C0/C1 controls, zero-width marks, line and paragraph separators, and the
 * BOM. Tab, newline and carriage return are excluded so they are handled as
 * whitespace: "a\r\nb" must collapse to "a b", not "ab".
 */
const CONTROL_CHARS =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029\ufeff]/g;

/**
 * Strip control characters and collapse whitespace. Header injection (CR/LF)
 * and zero-width padding are removed here rather than detected later.
 */
export function normalize(value: unknown, allowNewlines = false): string {
  if (typeof value !== "string") return "";
  if (!allowNewlines) {
    return value.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
  }
  return value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Deliberately conservative. A stricter grammar than RFC 5322 rejects a few
 * exotic-but-legal addresses; that is preferable to accepting something we
 * cannot reply to, and the failure is visible to the person typing.
 */
const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export function isValidEmail(value: string): boolean {
  if (value.length < 6 || value.length > 160) return false;
  return EMAIL_PATTERN.test(value);
}

export function validateDemoRequest(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { ok: false, errors: { form: "The submission could not be read." } };
  }

  const raw = input as Record<string, unknown>;
  const errors: FieldErrors = {};
  const values = {} as DemoRequestValues;

  for (const field of DEMO_REQUEST_FIELDS) {
    const value = normalize(raw[field.id], field.type === "textarea");
    values[field.id] = value;

    if (!value) {
      if (field.required) errors[field.id] = `${field.label} is required.`;
      continue;
    }
    if (value.length > field.maxLength) {
      errors[field.id] =
        `${field.label} must be ${field.maxLength} characters or fewer.`;
      continue;
    }
    if (field.id === "email") {
      if (!isValidEmail(value)) {
        errors.email = "Enter an email address we can reply to.";
      }
      continue;
    }
    if (field.required && value.length < 2) {
      errors[field.id] = `${field.label} looks too short.`;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, values };
}
