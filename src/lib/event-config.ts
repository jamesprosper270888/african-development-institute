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
    showTestimonials: false, // named quotes under the hosts — OFF until Pam/Marcia give permission
    moneyBackGuarantee: false, // "leave at lunch, full refund" — OFF until Pam/Marcia agree
  },
  hosts: [
    {
      name: "Pam Rowe",
      role: "Co-founder, ADI · Leadership adviser and coach",
      photo: "/team/pam-rowe.jpg",
      bio: "Thirty years advising senior leaders and boards across public services, safeguarding and education. Pam has sat with Black professionals at exactly this point — the ambush appraisal, the restructure, the slow walk to the door — and has been there herself.",
      testimonial: {
        quote: "Through her balance of lived experience, wisdom, challenge and support, she had a transformative impact on me. The most significant shift has been in my self-esteem.",
        name: "Georgia Chimbani",
        title: "Corporate Director",
      },
    },
    {
      name: "Marcia Daigo",
      role: "Co-founder, ADI · Executive coach and author",
      photo: "/team/marcia-daigo.jpg",
      bio: "Executive coach and published author, fifteen years across the NHS and public sector. Marcia works with leaders who have done everything right and still find themselves squeezed: name the pattern, fortify yourself before you need to, act on your own terms.",
      testimonial: {
        quote: "Marcia is very astute and quickly gets to the heart of issues. She encourages you to trust your instincts and recognise that you already hold the answers.",
        name: "Meghan Zinkewich-Peotti",
        title: "Head of Insight and Housing Strategy",
      },
    },
  ],
  // Photos from previous ADI gatherings (members-only event, 2025)
  gallery: [
    { src: "/events/gallery/room.jpg", alt: "A small group around round tables at an ADI gathering in a hotel conference room", w: 481, h: 545 },
    { src: "/events/gallery/pam.jpg", alt: "Pam Rowe speaking to the room at an ADI gathering", w: 419, h: 558 },
    { src: "/events/gallery/marcia.jpg", alt: "Marcia Daigo at the flipchart during an ADI gathering", w: 405, h: 541 },
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
