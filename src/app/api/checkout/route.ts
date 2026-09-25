import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq, gte, sql as dsql } from "drizzle-orm";
import type Stripe from "stripe";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { EVENT, LEAD_COOKIE, eventPath, ticketUrl } from "@/lib/event-config";
import { PAY_ITEMS, itemName, priceFor, stripe, type PayItem } from "@/lib/stripe";

/**
 * Starts a Stripe embedded checkout for /pay/[item] and returns its client
 * secret. Nothing is marked paid here: that is the webhook's job, once Stripe
 * says the money has actually landed.
 */

// Same window the registration route and the follow-up cron use.
const CAMPAIGN_START = new Date("2026-09-01T00:00:00Z");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const schema = z.object({
  item: z.enum(PAY_ITEMS as [PayItem, ...PayItem[]]),
  ref: z.string().max(100).optional(),
});

export async function POST(request: Request) {
  // Its own bucket, and roomier than the forms' 5 an hour: every load of a
  // /pay page opens a session, and a buyer who refreshes, or a household
  // paying for two, must never be locked out of paying.
  const { success } = checkRateLimit(`checkout:${getClientIP(request)}`, 30);
  if (!success) {
    return NextResponse.json({ error: "Too many payment attempts from this connection. Please try again later, or email us and we will help." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { item, ref } = parsed.data;
  const origin = new URL(request.url).origin;
  const now = new Date();

  try {
    const params =
      item === "ticket"
        ? await ticketSession(origin, now, ref)
        : item === "test"
          ? testSession(origin)
          : membershipSession(origin, item);
    if ("error" in params) {
      return NextResponse.json({ error: params.error }, { status: params.status });
    }

    const session = await stripe().checkout.sessions.create({
      ui_mode: "embedded_page",
      line_items: [{ price: await priceFor(item, now), quantity: 1 }],
      name_collection: { individual: { enabled: true } },
      // The page's own off-white behind Stripe's white card, so there is one
      // card edge and not a panel round a card; the button matches the
      // /membership card they chose.
      branding_settings: {
        background_color: "#FAF8F5",
        button_color: item === "annual" ? "#006B3F" : "#C8102E",
        border_style: "rounded",
      },
      phone_number_collection: { enabled: true },
      ...params,
    });
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("[Checkout] could not start:", err);
    return NextResponse.json(
      { error: "We could not open the payment form. Please try again in a moment." },
      { status: 500 }
    );
  }
}

type SessionParams = Stripe.Checkout.SessionCreateParams;
type Refusal = { error: string; status: number };

async function ticketSession(
  origin: string,
  now: Date,
  ref: string | undefined
): Promise<SessionParams | Refusal> {
  if (!ticketUrl(now)) {
    return { error: `Booking for ${EVENT.name} has closed.`, status: 410 };
  }

  // Which reservation this pays for: the link's ?r= first (emails carry it),
  // then the cookie from reserving in this browser. Neither is required; the
  // webhook falls back to the buyer's email, then to a new row.
  const cookieRef = (await cookies()).get(LEAD_COOKIE)?.value;
  const explicit = ref && UUID.test(ref) ? ref : null;
  const candidate = explicit ?? (cookieRef && UUID.test(cookieRef) ? cookieRef : null);
  const [reservation] = candidate
    ? await db
        .select({ id: enquiries.id, email: enquiries.email, paidAt: enquiries.paidAt })
        .from(enquiries)
        .where(and(eq(enquiries.id, candidate), eq(enquiries.type, "event")))
        .limit(1)
    : [];

  if (reservation?.paidAt && explicit) {
    return { error: "This seat is already paid for. We look forward to seeing you.", status: 409 };
  }
  // A paid cookie row just means this browser already bought one seat and is
  // buying another (Anita paid for Doreen, then for herself): a fresh seat.
  const payingFor = reservation && !reservation.paidAt ? reservation : null;

  // GHL enforced the room with product stock. Here it is the real count of
  // committed people (paid or member), one per email address.
  const [{ committed }] = await db
    .select({
      committed: dsql<number>`count(distinct lower(trim(${enquiries.email})))::int`,
    })
    .from(enquiries)
    .where(
      and(
        eq(enquiries.type, "event"),
        gte(enquiries.createdAt, CAMPAIGN_START),
        dsql`${enquiries.message} like ${`%${EVENT.name}%`}`,
        dsql`(${enquiries.paidAt} is not null or ${enquiries.isMember})`
      )
    );
  if (committed >= EVENT.seats) {
    return { error: `${EVENT.name} is full. Reply to your confirmation email to join the waiting list.`, status: 409 };
  }

  const metadata = { item: "ticket", enquiryId: payingFor?.id ?? "" };
  return {
    mode: "payment",
    return_url: `${origin}${eventPath("/thank-you")}?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    ...(payingFor ? { customer_email: payingFor.email } : {}),
    customer_creation: "always",
    metadata,
    payment_intent_data: { description: itemName("ticket"), metadata },
  };
}

function membershipSession(origin: string, item: "monthly" | "annual"): SessionParams {
  const metadata = { item };
  return {
    mode: "subscription",
    return_url: `${origin}/membership/welcome?session_id={CHECKOUT_SESSION_ID}`,
    metadata,
    subscription_data: { description: itemName(item), metadata },
  };
}

/** The hidden 30p real-card check: comes back to /pay/test, touches nothing. */
function testSession(origin: string): SessionParams {
  const metadata = { item: "test" };
  return {
    mode: "payment",
    return_url: `${origin}/pay/test?done={CHECKOUT_SESSION_ID}`,
    metadata,
    payment_intent_data: { description: itemName("test"), metadata },
  };
}
