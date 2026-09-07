/**
 * Adds the reserve -> pay follow-up columns to `enquiries` and backfills the
 * reservations taken before they existed (phone / member flag lived only in
 * the free-text `message` blob, and paid state was never recorded at all).
 *
 * Additive and idempotent: every statement is ADD COLUMN IF NOT EXISTS or an
 * UPDATE scoped to type='event'. Safe to re-run.
 *
 * Usage:
 *   POSTGRES_URL="postgresql://..." node scripts/migrate-event-followup.mjs
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.POSTGRES_URL;
if (!url) throw new Error("POSTGRES_URL not set");
if (/localhost|127\.0\.0\.1/.test(url)) console.warn("! pointing at a LOCAL database");
const sql = neon(url);

const columns = [
  sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS phone text`,
  sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS is_member boolean NOT NULL DEFAULT false`,
  sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS paid_at timestamp`,
  sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS follow_up_stage integer NOT NULL DEFAULT 0`,
  sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS follow_up_last_at timestamp`,
  sql`ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS unsubscribed_at timestamp`,
];
for (const stmt of columns) await stmt;
console.log("columns ok");

// Backfill phone + member flag out of the legacy message blob
const phones = await sql`
  UPDATE enquiries SET phone = substring(message from 'Phone: ([^\n]+)')
  WHERE type = 'event' AND phone IS NULL AND message LIKE '%Phone: %'
  RETURNING id`;
const members = await sql`
  UPDATE enquiries SET is_member = true
  WHERE type = 'event' AND is_member = false
    AND (message LIKE '%Type: MEMBER%' OR message LIKE '%Free member registration%')
  RETURNING id`;
// Shirley Stewart paid 2026-09-02 23:32 UTC (£24.99, PCM conversion f58a02df)
const paid = await sql`
  UPDATE enquiries SET paid_at = '2026-09-02 23:32:49'
  WHERE type = 'event' AND email = 'shellybiz@hotmail.co.uk' AND paid_at IS NULL
  RETURNING id`;
console.log(`backfilled: ${phones.length} phone, ${members.length} member, ${paid.length} paid`);

const rows = await sql`
  SELECT name, email, phone, is_member, paid_at, follow_up_stage, created_at
  FROM enquiries WHERE type = 'event' ORDER BY created_at`;
console.log("\nreservations:");
for (const r of rows) {
  console.log(
    [
      new Date(r.created_at).toISOString().slice(0, 16),
      r.name.trim().padEnd(24),
      (r.phone || "-").padEnd(14),
      r.is_member ? "MEMBER" : "guest ",
      r.paid_at ? "PAID  " : "unpaid",
      "stage " + r.follow_up_stage,
    ].join(" | ")
  );
}
