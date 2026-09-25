/**
 * Columns for ADI's own Stripe checkout (24 Sep 2026): the webhook records
 * which Checkout Session paid a ticket, and keeps each member's Stripe ids and
 * paid-up-until date.
 *
 * Additive and idempotent: ADD COLUMN IF NOT EXISTS and CREATE INDEX IF NOT
 * EXISTS only. Safe to re-run, and safe to run before the code deploys.
 *
 * Usage:
 *   POSTGRES_URL="postgresql://..." node scripts/migrate-stripe.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.POSTGRES_URL;
if (!url) throw new Error("POSTGRES_URL not set");
if (/localhost|127\.0\.0\.1/.test(url)) console.warn("! pointing at a LOCAL database");
const sql = neon(url);

await sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS stripe_session_id text`;
await sql`CREATE UNIQUE INDEX IF NOT EXISTS enquiries_stripe_session_id_key
  ON enquiries (stripe_session_id) WHERE stripe_session_id IS NOT NULL`;
await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS stripe_customer_id text`;
await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS stripe_subscription_id text`;
await sql`ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_ends_at timestamp`;
console.log("stripe columns ok");
