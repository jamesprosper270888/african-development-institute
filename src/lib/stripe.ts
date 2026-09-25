import Stripe from "stripe";
import { EVENT, currentTicketPrice } from "@/lib/event-config";

/**
 * ADI takes payment through its own Stripe account (acct_1QIs4CE6utbjZJhG),
 * on its own pages, with Stripe's embedded checkout.
 *
 * Why not GHL any more (24 Sep 2026): GHL's order forms never finished the
 * bank's approval step (3-D Secure). Anita's card paid a ticket at 21:06 and
 * then failed four £499 annual attempts in a row, because GHL sold the annual
 * as a saved-card subscription and never showed her the approval screen.
 * Venita and Lorlett lost ticket payments the same way. Stripe's own checkout
 * handles approval, Apple Pay and Google Pay, and tells us by webhook when a
 * payment lands, so paid_at no longer depends on the buyer's browser.
 *
 * GHL was only ever the checkout page: the money, and every existing member's
 * subscription, already live in this Stripe account.
 */

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key);
  }
  return client;
}

export type PayItem = "ticket" | "monthly" | "annual";

export const PAY_ITEMS: readonly PayItem[] = ["ticket", "monthly", "annual"];

export function isPayItem(value: unknown): value is PayItem {
  return typeof value === "string" && (PAY_ITEMS as readonly string[]).includes(value);
}

export const MEMBERSHIP = {
  monthly: { amount: 49, interval: "month", name: "ADI Monthly Membership" },
  annual: { amount: 499, interval: "year", name: "ADI Annual Membership" },
} as const;

/** What a pay item costs right now, in pounds. The ticket price moves by date. */
export function itemAmount(item: PayItem, now: Date = new Date()): number {
  return item === "ticket" ? currentTicketPrice(now) : MEMBERSHIP[item].amount;
}

export function itemName(item: PayItem): string {
  return item === "ticket" ? `${EVENT.name} ticket (${EVENT.dateShort})` : MEMBERSHIP[item].name;
}

/**
 * The Stripe Price for an item, created on first use.
 *
 * Looked up by a lookup_key that carries the amount, so a price change makes
 * a new Price instead of editing one that past payments point at, and nobody
 * has to set products up by hand in the dashboard first.
 */
export async function priceFor(item: PayItem, now: Date = new Date()): Promise<string> {
  const pence = Math.round(itemAmount(item, now) * 100);
  const lookupKey = `adi_${item === "ticket" ? `${EVENT.slug}_ticket` : `membership_${item}`}_${pence}`;

  const find = async () =>
    (await stripe().prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 })).data[0]?.id;

  const existing = await find();
  if (existing) return existing;

  try {
    const price = await stripe().prices.create({
      currency: "gbp",
      unit_amount: pence,
      lookup_key: lookupKey,
      product_data: { name: itemName(item) },
      ...(item === "ticket" ? {} : { recurring: { interval: MEMBERSHIP[item].interval } }),
    });
    return price.id;
  } catch (err) {
    // Two first buyers at once: the other request created it. Use that one.
    const raced = await find();
    if (raced) return raced;
    throw err;
  }
}
