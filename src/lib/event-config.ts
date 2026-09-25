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
  // 30 since 20 Sep, the day the last-chance price went live (see pricing).
  //
  // The room at Oatlands Park holds 30, and that is now the real ceiling. The
  // pair and standard checkouts are DEACTIVATED in GHL, so the only way to buy
  // is the last-chance link, whose stock is 15. Fifteen people are already
  // committed (six members free plus ten paid, Ngozi is both), so 15 + 15 = 30
  // exactly. Change that GHL stock and this number has to change with it: it
  // appears eleven times on the page, including "29 other people", so it has
  // to describe what is actually on sale.
  //
  // The live ad copy still saying 20 is deliberate and must NOT be edited to
  // match: an edit re-triggers Meta review, and a Scheduled ad stuck in review
  // costs more than a stale number. Understating availability is the safe
  // direction to be wrong in.
  seats: 30,
  pricing: {
    earlyBird: 24.99,
    standard: 49.99,
    currency: "GBP",
    // REOPENED 20 Sep 2026 as the LAST CHANCE price. James's call.
    //
    // 49.99 ran from 14 to 20 Sep and sold nothing at all. Every one of the
    // ten payments this campaign has taken was 24.99, the last of them on
    // 13 Sep, and in the six days at the higher price seven guests reserved
    // and not one paid. So the cheap tier is open again at the same 24.99,
    // which also means nobody who already paid has paid more than anyone else.
    //
    // The machinery is deliberately unchanged: everything still reads
    // isEarlyBirdOpen(), only the dates and the words move. Every user-facing
    // string now says "last chance" rather than "early bird", because this
    // list was emailed "early bird closes Sunday 13 September" and we are not
    // reopening it under the same name.
    earlyBirdSeats: 15,
    earlyBirdUntil: "2026-09-25T23:59:59+01:00",
    earlyBirdUntilLabel: "Friday 25 September",
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
    // FALSE since 20 Sep: the 49.99 link is deactivated in GHL, so nothing may
    // point at it. The standard price still shows on the page as the
    // struck-through comparison, which is all it is for now.
    standardReady: false,
    standardUrl:
      "https://link.africandevelopmentinstitute.com/payment-link/6aa299a4ceb12d9fc1a8c1dc",
    // "Bring someone who gets it." GHL Payment Link (product
    // 6aa7b61508d19fea442f815f "You Are Not Alone - Two Seats", £49.99,
    // stock 4, created 14 Sep 2026, auto-deactivates 27 Sep 2026, redirects to
    // /thank-you?paid=1).
    //
    // It has its own product because a pair sale and a single sale are the
    // same £49.99, so on the standard link nothing could tell them apart or
    // stop the fifth pair. Stock 4 is the cap, enforced by GHL with no cron, no
    // counter and no race, exactly as the early bird used stock 10. With
    // pairUrl empty and pairReady true the offer falls back to standardUrl and
    // runs uncapped, so never clear pairUrl without also setting this false.
    // FALSE since 20 Sep. At 24.99 for one seat, two seats for 49.99 is not an
    // offer any more, it is the same money for less flexibility. Its GHL link
    // is deactivated too, so its stock of 4 pairs can no longer sit outside
    // the 15-seat cap and overfill the room.
    pairReady: false,
    pairUrl:
      "https://link.africandevelopmentinstitute.com/payment-link/6aa7b78c32f95ae35594a744",
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
export function ticketUrl(now: Date = new Date(), ref?: string): string | null {
  if (isEarlyBirdOpen(now)) {
    if (stripeCheckoutOn()) {
      return `${SITE_URL}/pay/ticket${ref ? `?r=${encodeURIComponent(ref)}` : ""}`;
    }
    return EVENT.tickets.earlyBirdReady ? EVENT.tickets.earlyBirdUrl : null;
  }
  return standardTicketUrl();
}

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://africandevelopmentinstitute.com";

/**
 * True once the Stripe keys are set: pay links point at ADI's own /pay page
 * (see src/lib/stripe.ts). Remove NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and
 * redeploy to fall back to the GHL links above.
 */
export function stripeCheckoutOn(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
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
