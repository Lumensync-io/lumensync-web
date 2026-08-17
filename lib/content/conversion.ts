import type { Hero, Point, Step } from "./types";

/**
 * Conversion copy: /request-demo and /contact.
 *
 * The demo form is live only when the deployment has a delivery destination
 * configured (see `lib/demo-request/config.ts`). Both states are honest: when
 * it is off, the page says so instead of accepting a message it cannot deliver;
 * when it is on, the submitter is told the true outcome. No third-party form,
 * CRM or analytics vendor is embedded in the page in either state.
 */

/** Shown on the page, and returned by the API, when delivery is unconfigured. */
export const DEMO_FORM_UNAVAILABLE =
  "Online demo requests aren't switched on yet â€” this form is intentionally inactive rather than quietly dropping your message. If you're already talking to us, reply on that thread and we'll pick it up there.";

/** Shown above the form when delivery is configured. */
export const DEMO_FORM_LIVE_NOTICE =
  "Tell us enough to make the session useful. This goes straight to the product team â€” no marketing sequence, no reseller, and nothing shared with a third party.";

export const REQUEST_DEMO = {
  hero: {
    eyebrow: "Request a demo",
    heading: "See LumenSync on a lighting package like yours.",
    lead: "A demo is a working session, not a slide deck. We walk a real commercial lighting package through the product â€” schedule, drawings, checks, findings, RFIs and field status â€” and you tell us where it would have caught something on your last job.",
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
        detail: "Running a coordination check and reading the findings â€” including what LumenSync deliberately refuses to guess.",
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
        body: "If you'd rather see it against your drawings and schedule than our demo project, say so when we talk â€” we'll agree how to handle your files first.",
      },
      {
        title: "You'll see the limits",
        body: "Scanned schedules, incomplete data and messy revisions are part of the demo, because they're part of the job.",
      },
    ] satisfies Point[],
  },
} as const;

export const CONTACT = {
  hero: {
    eyebrow: "Contact",
    heading: "Talk to the people building it.",
    lead: "LumenSync is a small, focused product team. There's no call center and no lead-routing maze â€” conversations about the product happen directly with the people working on it.",
    primary: { href: "/request-demo", label: "Request a Demo" },
    secondary: { href: "/product", label: "Product Overview" },
    note: "Most questions get answered fastest in a working session against a real lighting package.",
  } satisfies Hero,

  /** Hero panel: what people actually bring to a first conversation. */
  asks: {
    heading: "What people usually ask",
    items: [
      "Will it handle a package this size, with this many fixture types?",
      "How does it compare a schedule against what is placed on the sheet?",
      "What do our IT and security reviewers need to know?",
      "What does it not do, so we know where it stops?",
      "How would this fit how our project managers and field crews already work?",
    ],
  },
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
        body: "Sign in to the application and raise it with your project contact â€” your project record and history are already there.",
      },
      {
        title: "Security or privacy concern",
        body: "Use the demo request path and mark it as a security matter. Please don't post details publicly.",
      },
    ] satisfies Point[],
  },
  honesty: {
    eyebrow: "Straight answers",
    heading: "Straight about how to reach us",
    label: "About this page",
    /** Delivery unconfigured: the demo form cannot be offered as a route. */
    offline:
      "We don't publish a general inquiries inbox or phone number, and online demo requests aren't switched on yet either â€” we'd rather point you at a route that actually gets answered than list one that doesn't. Getting the demo request monitored is the next step for this site.",
    /** Delivery configured: the form is the monitored route. */
    online:
      "We don't publish a general inquiries inbox or phone number â€” a published address collects more automated mail than real questions. The demo request form is the monitored route, it reaches the product team directly, and it tells you plainly whether your message got through.",
  },
} as const;
