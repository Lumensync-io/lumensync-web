"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEMO_REQUEST_FIELDS,
  HONEYPOT_FIELD,
  validateDemoRequest,
  type FieldErrors,
} from "@/lib/demo-request/schema";

/**
 * The demo-request form.
 *
 * Two honest states. When the deployment has no delivery destination
 * configured, the form renders visibly inactive and says so — it never accepts
 * a submission it cannot deliver. When it is live, the outcome shown to the
 * person is the real outcome: a request is reported as received only after the
 * destination has accepted it.
 */

const INPUT_CLASS =
  "mt-1.5 block min-h-11 w-full rounded-[var(--radius-control)] border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink-strong placeholder:text-ink-faint disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger-strong";

type Phase = "ready" | "submitting" | "sent" | "failed";

export function DemoRequestForm({
  enabled,
  unavailableNotice,
  liveNotice,
}: {
  enabled: boolean;
  unavailableNotice: string;
  liveNotice: string;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void fetch("/api/demo-request", { headers: { accept: "application/json" } })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { enabled?: boolean; token?: string } | null) => {
        if (!cancelled && data?.enabled && data.token) setToken(data.token);
      })
      .catch(() => {
        /* Leaving the token unset simply means the first submit reports honestly. */
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (phase === "sent" || phase === "failed") resultRef.current?.focus();
  }, [phase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(
      DEMO_REQUEST_FIELDS.map((field) => [field.id, String(data.get(field.id) ?? "")]),
    );

    const local = validateDemoRequest(values);
    if (!local.ok) {
      setErrors(local.errors);
      setFormError(null);
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setPhase("submitting");
    setErrors({});
    setFormError(null);

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? ""),
          formToken: token,
        }),
      });
      const body: {
        ok?: boolean;
        message?: string;
        reference?: string;
        errors?: FieldErrors;
      } = await response.json().catch(() => ({}));

      if (response.ok && body.ok) {
        setReference(body.reference ?? null);
        setPhase("sent");
        return;
      }
      if (body.errors) setErrors(body.errors);
      setFormError(
        body.message ??
          "We could not deliver your request just now, so please treat it as not received.",
      );
      setPhase("failed");
    } catch {
      setFormError(
        "Your request did not reach us — the connection failed, so please treat it as not sent.",
      );
      setPhase("failed");
    }
  }

  if (phase === "sent") {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6 sm:p-8"
      >
        <h2 className="text-lg font-semibold text-ink-strong">Request received.</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-body">
          It reached us — a person reads these, and you will get a reply from
          someone who can answer product questions rather than an automated
          sequence.
        </p>
        {reference ? (
          <p className="mt-3 text-sm text-ink-muted">
            Your reference is <span className="font-mono">{reference}</span>.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line-subtle bg-surface-raised p-6 sm:p-8">
      <h2 className="text-sm font-semibold text-ink-strong">Request a demo</h2>
      <p
        id="form-status"
        className="mt-2 rounded-[var(--radius-control)] border border-line-strong bg-surface-inset/60 p-3 text-sm leading-relaxed text-ink-body"
      >
        {enabled ? liveNotice : unavailableNotice}
      </p>

      {formError ? (
        <p
          ref={resultRef}
          tabIndex={-1}
          role="alert"
          className="mt-4 rounded-[var(--radius-control)] border border-danger-strong bg-danger-soft p-3 text-sm leading-relaxed text-ink-strong"
        >
          {formError}
        </p>
      ) : null}

      <noscript>
        <p className="mt-4 text-sm leading-relaxed text-ink-body">
          This form needs JavaScript to submit. If it is switched off, reply on
          an existing thread with us instead.
        </p>
      </noscript>

      <form onSubmit={handleSubmit} aria-describedby="form-status" className="mt-5" noValidate>
        <div className="grid gap-5">
          {DEMO_REQUEST_FIELDS.map((field) => {
            const error = errors[field.id];
            const describedBy = error ? `${field.id}-error` : undefined;
            return (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-ink-strong"
                >
                  {field.label}
                  {field.hint ? (
                    <span className="font-normal text-ink-faint"> ({field.hint})</span>
                  ) : null}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    rows={4}
                    maxLength={field.maxLength}
                    disabled={!enabled || phase === "submitting"}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={INPUT_CLASS}
                  />
                ) : (
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    maxLength={field.maxLength}
                    disabled={!enabled || phase === "submitting"}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={INPUT_CLASS}
                  />
                )}
                {error ? (
                  <p id={`${field.id}-error`} className="mt-1.5 text-sm text-danger-ink">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}

          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor={HONEYPOT_FIELD}>Website</label>
            <input
              id={HONEYPOT_FIELD}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
              disabled={!enabled || phase === "submitting"}
            />
          </div>

          <button
            type="submit"
            disabled={!enabled || phase === "submitting"}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phase === "submitting" ? "Sending…" : "Request a Demo"}
          </button>
        </div>
      </form>
    </div>
  );
}
