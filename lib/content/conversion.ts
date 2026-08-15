import type { Hero, Point, Step } from "./types";

/**
 * Conversion copy: /request-demo and /contact.
 *
 * The demo form has no submission backend yet. The page says so plainly and
 * never fakes success. No third-party form, CRM or email vendor is used, and no
 * personal contact details are published — see the LSWEB-006 follow-up.
 */

/** Single source of truth for the "not yet live" state of the demo form. */
export const DEMO_FORM_LIVE = false;

export const DEMO_FORM_NOTICE =
  "Online demo requests aren't switched on yet — this form is intentionally inactive rather than quietly dropping your message. If you're already talking to us, reply on that thread and we'll pick it up there.";

export const REQUEST_DEMO = {
  hero: {
    eyebrow: "Request a demo",
    heading: "See LumenSync on a lighting package like yours.",
    lead: "A demo is a working session, not a slide deck. We walk a real commercial lighting package through the product — schedule, drawings, checks, findings, RFIs and field status — and you tell us where it would have caught something on your last job.",
    note: "Best suited to electrical contractors, project managers and lighting-coordination teams running complex commercial work.",
  } satisfies Hero,
  agenda: {
    eyebrow: "What we'll cover",
    heading: "About forty minutes, mostly in the product.",
    steps: [
      {
        label: "Your package, in your words",
        detail: "How the schedule, drawings, submittals and controls information reach you today, and where it usually breaks.",
      },
      {
        label: "The record",
        detail: "Bringing a fixture schedule in, versioning it, and putting fixture types on the sheet.",
      },
      {
        label: "The checks",
        detail: "Running a coordination check and reading the findings — including what LumenSync deliberately refuses to guess.",
      },
      {
        label: "The ask",
        detail: "Turning a finding into a drafted RFI candidate, and what a manager sees before issuing it.",
      },
      {
        label: "The field",
        detail: "The same record on a phone: progress by type, by drawing, and field issues coming back.",
      },
    ] satisfies Step[],
  },
  expectations: {
    eyebrow: "What to expect",
    heading: "Straight answers, including the unflattering ones.",
    points: [
      {
        title: "No fabricated proof",
        body: "We won't show you invented customers, invented metrics or a feature that doesn't exist yet. If something is on the roadmap, we'll say so.",
      },
      {
        title: "Bring your own package",
        body: "If you'd rather see it against your drawings and schedule than our demo project, say so when we talk — we'll agree how to handle your files first.",
      },
      {
        title: "You'll see the limits",
        body: "Scanned schedules, incomplete data and messy revisions are part of the demo, because they're part of the job.",
      },
    ] satisfies Point[],
  },
  fields: [
    { id: "name", label: "Name", autoComplete: "name", type: "text" },
    { id: "email", label: "Work email", autoComplete: "email", type: "email" },
    { id: "company", label: "Company", autoComplete: "organization", type: "text" },
    { id: "role", label: "Role", autoComplete: "organization-title", type: "text" },
  ],
} as const;

export const CONTACT = {
  hero: {
    eyebrow: "Contact",
    heading: "Talk to the people building it.",
    lead: "LumenSync is a small, focused product team. There's no call centre and no lead-routing maze — conversations about the product happen directly with the people working on it.",
    primary: { href: "/request-demo", label: "Request a Demo" },
  } satisfies Hero,
  routes: {
    eyebrow: "How to reach us",
    heading: "Three paths, depending on why you're here.",
    items: [
      {
        title: "Evaluating LumenSync",
        body: "Start with a demo request. It's the fastest way to get a working session with someone who can answer product questions properly.",
      },
      {
        title: "Already using LumenSync",
        body: "Sign in to the application and raise it with your project contact — your project record and history are already there.",
      },
      {
        title: "Security or privacy concern",
        body: "Use the demo request path and mark it as a security matter. Please don't post details publicly.",
      },
    ] satisfies Point[],
  },
  honesty: {
    label: "About this page",
    body: "We don't publish a general enquiries inbox or phone number yet, and we'd rather point you at a route that actually gets answered than list one that doesn't. A monitored contact channel is a tracked next step for this site.",
  },
} as const;
