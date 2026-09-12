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
    // Verified 12 Sep 2026: resolves to the hotel's own Google Maps place
    // listing at 51.3750155, -0.4448101, not a search result, so it opens with
    // directions and the venue's own photos rather than a guess.
    mapsUrl: "https://maps.app.goo.gl/hKDL7Z3raLovvELy9",
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
    // "Bring someone who gets it": one standard price, two seats. Approved by
    // Pam 11 Sep 2026 for the final two weeks. It is the same £49.99 either
    // way, so nobody who books alone has overpaid; they simply did not bring
    // anyone. Live automatically the minute the early bird closes. See
    // pairTicketUrl(), which stays null until then so the offer cannot leak
    // early and undercut the deadline.
    pairSeats: 2,
    pairPerSeatLabel: "£25 each",
  },
  // GoHighLevel Payment Links (Stripe connected inside GHL). Both redirect to
  // `${APP_URL}/events/you-are-not-alone/thank-you?paid=1` so the purchase is tracked.
  // Use ticketUrl() rather than reading these directly: it picks the right one by date.
  tickets: {
    // GHL Payment Link (product 6a8b0a5fdc20627c4df323db, £24.99, stock 10,
    // auto-deactivates 14 Sep 2026, redirects to /thank-you?paid=1).
    earlyBirdReady: true,
    earlyBirdUrl:
      "https://link.africandevelopmentinstitute.com/payment-link/6a8b0ff1f9c8c807930b9939",
    // GHL Payment Link (product 6aa29874118a3782882c56c9, £49.99, created 10 Sep 2026,
    // auto-deactivates 27 Sep 2026, redirects to /thank-you?paid=1). With standardReady
    // false, nothing links to a standard checkout and guests are told Pam or Marcia
    // will take payment.
    standardReady: true,
    standardUrl:
      "https://link.africandevelopmentinstitute.com/payment-link/6aa299a4ceb12d9fc1a8c1dc",
    // "Bring someone who gets it." A dedicated two-seat GHL link goes here if
    // one is ever created (cleaner reporting: the product name says two).
    // Left empty it falls back to standardUrl, which is correct rather than a
    // compromise: the pair offer IS the standard price, so the same checkout
    // sells it. That is why this offer needs no GHL work to go live Monday.
    pairReady: true,
    pairUrl: "",
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

/** The standard-ticket checkout, or null until it has been set up in GHL. */
export function standardTicketUrl(): string | null {
  return EVENT.tickets.standardReady && EVENT.tickets.standardUrl
    ? EVENT.tickets.standardUrl
    : null;
}

/**
 * Where "pay now" points right now, matching currentTicketPrice(): the
 * early-bird link until the deadline, the standard link after it. Null when
 * that checkout is not live, so callers fall back to "we will be in touch".
 */
export function ticketUrl(now: Date = new Date()): string | null {
  if (isEarlyBirdOpen(now)) {
    return EVENT.tickets.earlyBirdReady ? EVENT.tickets.earlyBirdUrl : null;
  }
  return standardTicketUrl();
}

/**
 * The "bring someone who gets it" checkout: one standard price, two seats.
 *
 * Null while the early bird is still open, and that is the point. Pam and
 * Marcia were asked to keep the offer quiet until Sunday midnight, because an
 * offer people can see coming kills the deadline they are being pushed
 * towards. This function is what enforces that promise, so nothing has to be
 * deployed or switched on at midnight: the page revalidates every 60 seconds
 * and the offer appears on its own.
 */
export function pairTicketUrl(now: Date = new Date()): string | null {
  if (isEarlyBirdOpen(now)) return null;
  if (!EVENT.tickets.pairReady) return null;
  return EVENT.tickets.pairUrl || standardTicketUrl();
}
