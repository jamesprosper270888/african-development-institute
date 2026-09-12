/**
 * One-off: mark Patricia Wharton paid, and show who else the cron will chase.
 *
 * TEMPORARY. Delete after running. Never commit.
 *
 * She paid through a GHL link Pam and Marcia sent her directly, so she never
 * hit /thank-you?paid=1 and paid_at is still null. The follow-up cron
 * (0 9 * * * = 10:00 UK) therefore emails her "Last day at £24.99" on Sunday
 * and again on Monday. Same bug that chased Tara twice.
 *
 * Run:
 *   node --env-file=<pulled prod env> scripts/_tmp-patricia.mjs          (read only)
 *   node --env-file=<pulled prod env> scripts/_tmp-patricia.mjs --fix    (writes)
 */

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Pass --env-file pointing at the pulled production env.");
  process.exit(1);
}

// Confirm which database we are pointed at without ever printing credentials.
let host = "unparseable";
try {
  host = new URL(url).host;
} catch {
  /* leave as unparseable */
}
console.log(`database host: ${host}`);
if (host.includes("localhost") || host.includes("127.0.0.1")) {
  console.error("\nThis is a LOCAL database, not production. Refusing to run.");
  process.exit(1);
}

const sql = neon(url);
const TARGET = "whartonp@hotmail.com";
const fix = process.argv.includes("--fix");

function show(rows) {
  if (rows.length === 0) {
    console.log("  (no rows)");
    return;
  }
  for (const r of rows) {
    console.log(
      `  ${r.name} <${r.email}> paid_at=${r.paid_at ?? "NULL"} stage=${r.follow_up_stage} member=${r.is_member ?? "-"} created=${new Date(r.created_at).toISOString()}`
    );
  }
}

console.log("\n=== 1. Patricia, before ===");
const before = await sql`
  select id, name, email, is_member, paid_at, follow_up_stage,
         follow_up_last_at, unsubscribed_at, created_at
  from enquiries
  where type = 'event' and email = ${TARGET}
`;
show(before);

if (before.length === 0) {
  console.error("\nNo row found for that address. Stopping: nothing to fix, and the wrong email would be a silent no-op.");
  process.exit(1);
}
if (before.length > 1) {
  console.error("\nMore than one row matched. Stopping rather than guessing which is hers.");
  process.exit(1);
}

if (fix) {
  if (before[0].paid_at) {
    console.log("\n=== 2. Already marked paid. Nothing to do. ===");
  } else {
    console.log("\n=== 2. Marking paid ===");
    const updated = await sql`
      update enquiries
      set paid_at = now(),
          notes = coalesce(notes || ' | ', '')
                  || 'Paid via GHL payment link sent directly by Pam/Marcia. Never reached /thank-you?paid=1, so paid_at was set by hand 12 Sep 2026.'
      where type = 'event'
        and email = ${TARGET}
        and paid_at is null
      returning id, name, paid_at
    `;
    console.log(`  updated ${updated.length} row(s)`);
    for (const r of updated) console.log(`  ${r.name} paid_at=${r.paid_at}`);
  }

  console.log("\n=== 3. Patricia, after ===");
  show(await sql`
    select name, email, is_member, paid_at, follow_up_stage, created_at
    from enquiries
    where type = 'event' and email = ${TARGET}
  `);
} else {
  console.log("\n(read-only run: pass --fix to write)");
}

// The cron's own candidate query. Everyone here gets an email at 10:00 UK.
// Cross-check against GHL Transactions: anyone who paid inside GHL but closed
// the tab early is in this list wrongly.
// NOTE: the cron's candidate query does NOT filter on follow_up_stage. It
// selects on paid_at / unsubscribed_at and then calls dueStage() per row,
// which returns null once stage >= 4. So a silenced duplicate still shows up
// as a candidate while never receiving anything. Splitting the two here,
// because lumping them together reads like the dedupe failed when it has not.
const candidates = await sql`
  select name, email, is_member, paid_at, follow_up_stage, created_at
  from enquiries
  where type = 'event'
    and is_member = false
    and paid_at is null
    and unsubscribed_at is null
    and created_at >= timestamp '2026-09-01 00:00:00'
    and message like '%You Are Not Alone%'
  order by created_at
`;

console.log("\n=== 4. WILL be emailed next run (stage < 4) ===");
show(candidates.filter((r) => r.follow_up_stage < 4));

const silenced = candidates.filter((r) => r.follow_up_stage >= 4);
if (silenced.length > 0) {
  console.log("\n=== 5. Silenced, will NEVER be emailed (stage 4) ===");
  show(silenced);
  console.log("  (these are deduped or finished rows. Correct, not a fault.)");
}
