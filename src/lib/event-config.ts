/**
 * Single source of truth for the "You Are Not Alone" event.
 * Everything on the event pages, thank-you page, emails and tracking reads from here,
 * so a date / price / venue change is a one-line edit.
 */
export const EVENT = {
  slug: "you-are-not-alone",
  name: "You Are Not Alone",
  tagline: "A one-day gathering for Black professionals",
  // Human-readable
  dateLong: "Saturday 26 September 2026",
  dateShort: "Sat 26 Sep 2026",
  time: "10:00am – 4:00pm",
  // Machine-readable (Europe/London)
  startsAt: "2026-09-26T10:00:00+01:00",
  endsAt: "2026-09-26T16:00:00+01:00",
  venue: {
    name: "Oatlands Park Hotel",
    address: "146 Oatlands Drive, Weybridge KT13 9HB",
    town: "Weybridge",
    travel: [
      "25 minutes from London Waterloo to Weybridge station (South Western Railway)",
      "5 minutes by taxi from Weybridge station; free on-site parking",
      "Lunch and refreshments included with every ticket",
    ],
  },
  seats: 20,
  pricing: {
    earlyBird: 24.99,
    standard: 49.99,
    currency: "GBP",
    earlyBirdSeats: 10,
    earlyBirdUntil: "2026-09-13T23:59:59+01:00",
    earlyBirdUntilLabel: "Sunday 13 September",
  },
  // GoHighLevel-hosted checkout pages (Stripe connected inside GHL).
  // TODO(James): create the £24.99 early-bird checkout in GHL and set its
  // thank-you redirect to `${APP_URL}/events/you-are-not-alone/thank-you?paid=1`.
  tickets: {
    earlyBirdUrl:
      "https://pay.africandevelopmentinstitute.com/you-are-not-alone-early-bird",
    standardUrl:
      "https://pay.africandevelopmentinstitute.com/journey-within-ticket",
  },
  // Offer components — each can be switched off without touching the page.
  offer: {
    oneToOneFollowUp: true, // 30-min 1:1 with Pam or Marcia after the event (confirm Tue 25 Aug)
    moneyBackGuarantee: false, // "leave at lunch, full refund" — OFF until Pam/Marcia agree
  },
  hosts: [
    {
      name: "Pam Rowe",
      role: "Co-founder, ADI · Coach to Black professionals and leaders",
      bio: "Pam has spent years coaching Black professionals through the moments nobody prepares you for — the appraisal that turns into an ambush, the sudden reorganisation, the slow walk to the door. She has been there herself.",
    },
    {
      name: "Marcia Daigo",
      role: "Co-founder, ADI · Coach and leadership developer",
      bio: "Marcia works with Black leaders who have done everything right and still find themselves squeezed, isolated and exhausted. Her work is about self-preservation: fortifying yourself before you need to.",
    },
  ],
} as const;

export type EventConfig = typeof EVENT;

export function isEarlyBirdOpen(now: Date = new Date()): boolean {
  return now.getTime() < new Date(EVENT.pricing.earlyBirdUntil).getTime();
}

export function eventPath(sub: "" | "/thank-you" = ""): string {
  return `/events/${EVENT.slug}${sub}`;
}

export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

/** Cookie set on a successful reservation; required to report a purchase. */
export const LEAD_COOKIE = "adi_lead";

/** Price the buyer pays right now (server-side, never trust the client). */
export function currentTicketPrice(now: Date = new Date()): number {
  return isEarlyBirdOpen(now) ? EVENT.pricing.earlyBird : EVENT.pricing.standard;
}
