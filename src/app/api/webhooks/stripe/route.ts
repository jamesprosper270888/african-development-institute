import { NextResponse } from "next/server";
import { and, desc, eq, gte, isNull, sql as dsql } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { enquiries, members } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { EVENT } from "@/lib/event-config";
import { sendEmail, internalRecipients } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";

/**
 * Stripe -> ADI. The only thing that marks a ticket paid or makes someone a
 * member, because it is the only signal that proves money landed. The old
 * route relied on the buyer's browser reaching /thank-you?paid=1 with the
 * reservation cookie, which missed anyone who paid on another device (Tony
 * Mumagi paid 21 Sep and the site never knew).
 *
 * Endpoint events: checkout.session.completed,
 * checkout.session.async_payment_succeeded, invoice.paid,
 * customer.subscription.updated, customer.subscription.deleted.
 *
 * Every handler is idempotent: Stripe retries, and sends events out of order.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CAMPAIGN_START = new Date("2026-09-01T00:00:00Z");
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await onCheckoutComplete(event.data.object);
        break;
      case "invoice.paid": {
        const sub = event.data.object.parent?.subscription_details?.subscription;
        if (sub) await syncMembership(typeof sub === "string" ? sub : sub.id);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncMembership(event.data.object.id);
        break;
    }
  } catch (err) {
    // A 500 makes Stripe retry with backoff, which is what we want.
    console.error(`[Stripe webhook] ${event.type} ${event.id} failed:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onCheckoutComplete(session: Stripe.Checkout.Session) {
  // Card payments are "paid" at completion; bank-debit style methods arrive
  // later as async_payment_succeeded, which lands here again.
  if (session.payment_status !== "paid") return;

  const item = session.metadata?.item;
  if (item === "ticket") {
    await recordTicket(session);
  } else if ((item === "monthly" || item === "annual") && session.subscription) {
    const subId =
      typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    const member = await syncMembership(subId);
    if (member) await notifyNewMember(member, item, session);
  }
}

// ─── Tickets ────────────────────────────────────────────────────────────────

async function recordTicket(session: Stripe.Checkout.Session) {
  const [already] = await db
    .select({ id: enquiries.id })
    .from(enquiries)
    .where(eq(enquiries.stripeSessionId, session.id))
    .limit(1);
  if (already) return;

  const details = session.customer_details;
  const email = (details?.email ?? session.customer_email ?? "").trim();
  const name = (details?.individual_name ?? details?.name ?? "").trim() || email;
  const phone = details?.phone ?? null;
  const paid = { paidAt: new Date(), stripeSessionId: session.id };

  // 1. The reservation the pay link named.
  const enquiryId = session.metadata?.enquiryId;
  let matched: { id: string; name: string; email: string } | undefined;
  let how = "";
  if (enquiryId && UUID.test(enquiryId)) {
    [matched] = await db
      .update(enquiries)
      .set(paid)
      .where(and(eq(enquiries.id, enquiryId), isNull(enquiries.paidAt)))
      .returning({ id: enquiries.id, name: enquiries.name, email: enquiries.email });
    how = "matched the reservation the pay link came from";
  }

  // 2. Their most recent unpaid reservation under the same email.
  if (!matched && email) {
    const [row] = await db
      .select({ id: enquiries.id })
      .from(enquiries)
      .where(
        and(
          eq(enquiries.type, "event"),
          gte(enquiries.createdAt, CAMPAIGN_START),
          isNull(enquiries.paidAt),
          dsql`lower(trim(${enquiries.email})) = ${email.toLowerCase()}`,
          dsql`${enquiries.message} like ${`%${EVENT.name}%`}`
        )
      )
      .orderBy(desc(enquiries.createdAt))
      .limit(1);
    if (row) {
      [matched] = await db
        .update(enquiries)
        .set(paid)
        .where(and(eq(enquiries.id, row.id), isNull(enquiries.paidAt)))
        .returning({ id: enquiries.id, name: enquiries.name, email: enquiries.email });
      how = "matched their reservation by email";
    }
  }

  // 3. Paid without reserving (or for a second seat): a new, paid row, so the
  // seat is counted and Pam and Marcia can see who it is.
  if (!matched) {
    [matched] = await db
      .insert(enquiries)
      .values({
        name,
        email,
        phone,
        type: "event",
        message: `Seat paid — ${EVENT.name} — ${EVENT.dateShort}\nPaid through the ADI website (Stripe), no earlier reservation matched.${phone ? `\nPhone: ${phone}` : ""}`,
        sourcePage: "/pay/ticket",
        ...paid,
      })
      .onConflictDoNothing()
      .returning({ id: enquiries.id, name: enquiries.name, email: enquiries.email });
    how = "no reservation matched, so a new paid seat was added";
    if (!matched) return; // a concurrent retry got there first
  }

  const amount = (session.amount_total ?? 0) / 100;
  await Promise.all([
    sendEmail({
      to: internalRecipients(),
      replyTo: matched.email || undefined,
      subject: `[ADI] PAID £${amount.toFixed(2)}: ${matched.name} — ${EVENT.name}`,
      react: EnquiryNotification({
        name: matched.name,
        email: matched.email,
        type: "ticket paid",
        message: `Ticket paid for ${EVENT.name}: £${amount.toFixed(2)} by ${name} (${email}), on the ADI website through Stripe. The payment ${how}.`,
        timestamp: new Date().toISOString(),
      }),
    }),
    sendTelegramNotification(
      [
        `💷 <b>TICKET PURCHASED — ADI ${escapeHtml(EVENT.name)}</b>`,
        `${escapeHtml(matched.name)} · £${amount.toFixed(2)}`,
      ].join("\n")
    ),
  ]);
}

// ─── Membership ─────────────────────────────────────────────────────────────

type MemberRecord = { email: string; name: string; endsAt: Date };

/**
 * Brings members in line with one Stripe subscription. Runs for our own
 * checkouts and for the older GHL-made subscriptions in the same account, so
 * their renewals keep the record current too. Returns null when the
 * subscription is not a paid-up ADI membership.
 */
async function syncMembership(subscriptionId: string): Promise<MemberRecord | null> {
  const sub = await stripe().subscriptions.retrieve(subscriptionId, {
    expand: ["customer", "items.data.price.product"],
  });
  const customer = sub.customer;
  if (typeof customer === "string" || customer.deleted) return null;

  const item = sub.items.data[0];
  const product = item?.price.product;
  const productName = product && typeof product !== "string" && !product.deleted ? product.name : "";
  if (!/membership/i.test(productName)) return null;

  // Never paid: the bank approval was abandoned (Anita's GHL attempts).
  if (sub.status === "incomplete" || sub.status === "incomplete_expired") return null;

  const email = (customer.email ?? "").trim().toLowerCase();
  if (!email) return null;

  // GHL's "Annual Membership (3x Installments)" is three monthly payments for
  // a year, and shows Cancelled once paid off. Its year runs from the start.
  const instalments = /install?ment/i.test(productName);
  const endsAt = instalments
    ? new Date(sub.start_date * 1000 + YEAR_MS)
    : new Date(item.current_period_end * 1000);
  const tier = instalments || item.price.recurring?.interval === "year" ? "annual" : "monthly";
  const name = (customer.name ?? "").trim() || email;

  // An older subscription's event must never shorten a newer one, hence
  // greatest(). Status follows the date, so a cancelled plan stays active
  // until the end of what was paid for.
  await db
    .insert(members)
    .values({
      email,
      name,
      phone: customer.phone ?? null,
      membershipTier: tier,
      membershipStatus: endsAt > new Date() ? "active" : "cancelled",
      joinedAt: new Date(sub.start_date * 1000),
      stripeCustomerId: customer.id,
      stripeSubscriptionId: sub.id,
      membershipEndsAt: endsAt,
    })
    .onConflictDoUpdate({
      target: members.email,
      set: {
        membershipTier: tier,
        stripeCustomerId: customer.id,
        stripeSubscriptionId: sub.id,
        membershipEndsAt: dsql`greatest(${members.membershipEndsAt}, excluded.membership_ends_at)`,
        membershipStatus: dsql`case when greatest(${members.membershipEndsAt}, excluded.membership_ends_at) > now() then 'active' else 'cancelled' end`,
        phone: dsql`coalesce(${members.phone}, excluded.phone)`,
        updatedAt: new Date(),
      },
    });

  return { email, name, endsAt };
}

async function notifyNewMember(
  member: MemberRecord,
  item: "monthly" | "annual",
  session: Stripe.Checkout.Session
) {
  const amount = (session.amount_total ?? 0) / 100;
  const plan = item === "annual" ? "Annual" : "Monthly";

  // The YANA thank-you offer: join for the year by Sun 27 Sep midnight (BST)
  // and the £24.99 ticket is refunded. Refunds are done by hand in Stripe, so
  // the Telegram ping says whether this one is owed.
  const offerEnds = new Date("2026-09-27T23:00:00Z");
  const [ticket] = await db
    .select({ paidAt: enquiries.paidAt })
    .from(enquiries)
    .where(
      and(
        eq(enquiries.type, "event"),
        dsql`lower(${enquiries.email}) = ${member.email.toLowerCase()}`,
        dsql`${enquiries.paidAt} is not null`
      )
    )
    .limit(1)
    .catch(() => []); // a failed lookup must never cost the member their emails
  const refundLine =
    item !== "annual" || new Date() > offerEnds
      ? ticket ? "Had a paid ticket: no refund owed (monthly or after the deadline)." : null
      : ticket
        ? "↩️ <b>Refund their £24.99 ticket in Stripe</b> (YANA offer)."
        : "No paid ticket under this email. If they came on Saturday, check by name and refund £24.99.";

  await sendTelegramNotification(
    [
      `🎉 <b>NEW ADI MEMBER: ${plan} £${amount.toFixed(2)}</b>`,
      escapeHtml(member.name),
      refundLine,
    ]
      .filter(Boolean)
      .join("\n")
  );

  await sendEmail({
    to: internalRecipients(),
    replyTo: member.email,
    subject: `[ADI] NEW MEMBER (${plan}, £${amount.toFixed(2)}): ${member.name}`,
    react: EnquiryNotification({
      name: member.name,
      email: member.email,
      type: "membership",
      message: `${member.name} joined ADI on the ${plan.toLowerCase()} plan: £${amount.toFixed(2)} paid through Stripe on the ADI website. Member until ${member.endsAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London" })}, renewing automatically.`,
      timestamp: new Date().toISOString(),
    }),
  });
}
