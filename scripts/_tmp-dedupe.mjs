/**
 * One-off: stop duplicate reservations getting duplicate follow-up emails.
 *
 * TEMPORARY. Delete after running. Never commit.
 *
 * Maisie Barrett submitted the reserve form twice, 95 seconds apart, and
 * nothing deduped it. Both rows sit at follow_up_stage 0, so the next cron run
 * sends her two identical emails. The form has no guard against this, so it
 * will happen again.
 *
 * Approach: keep the EARLIEST row for each address and park the later ones at
 * follow_up_stage 4. dueStage() returns null once stage >= 4, so they go quiet
 * permanently. Deliberately NOT using unsubscribed_at, which would be a lie in
 * the data (she never asked to stop), and deliberately not deleting, so the
 * duplicate submission stays visible.
 *
 * Run:
 *   node --env-file=<pulled prod env> scripts/_tmp-dedupe.mjs          (read only)
 *   node --env-file=<pulled prod env> scripts/_tmp-dedupe.mjs --fix    (writes)
 */

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Pass --env-file pointing at the pulled production env.");
  process.exit(1);
}

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
const fix = process.argv.includes("--fix");

// Same window the cron uses, so this sees exactly what the cron sees.
const rows = await sql`
  select id, name, email, paid_at, follow_up_stage, unsubscribed_at, created_at
  from enquiries
  where type = 'event'
    and is_member = false
    and created_at >= timestamp '2026-09-01 00:00:00'
    and message like '%You Are Not Alone%'
  order by lower(trim(email)), created_at
`;

// Group by normalised address: trailing spaces and case should not create a
// second person.
const byEmail = new Map();
for (const r of rows) {
  const key = r.email.trim().toLowerCase();
  if (!byEmail.has(key)) byEmail.set(key, []);
  byEmail.get(key).push(r);
}

const dupes = [...byEmail.entries()].filter(([, rs]) => rs.length > 1);

console.log(`\n=== Duplicate reservations: ${dupes.length} address(es) ===`);
if (dupes.length === 0) {
  console.log("  none");
  process.exit(0);
}

for (const [email, rs] of dupes) {
  console.log(`\n  ${email}  (${rs.length} rows)`);
  rs.forEach((r, i) => {
    const role = i === 0 ? "KEEP  " : "SILENCE";
    console.log(
      `    ${role} ${new Date(r.created_at).toISOString()} stage=${r.follow_up_stage} paid_at=${r.paid_at ?? "NULL"} name="${r.name}"`
    );
  });
}

if (!fix) {
  console.log("\n(read-only run: pass --fix to write)");
  process.exit(0);
}

console.log("\n=== Silencing the later duplicates ===");
let silenced = 0;
for (const [, rs] of dupes) {
  for (const r of rs.slice(1)) {
    if (r.follow_up_stage >= 4) {
      console.log(`  already quiet: ${r.id}`);
      continue;
    }
    const updated = await sql`
      update enquiries
      set follow_up_stage = 4,
          notes = coalesce(notes || ' | ', '')
                  || 'Duplicate form submission. Silenced by hand 12 Sep 2026 so the follow-up cron does not email this person twice. The earliest row for this address is the live one.'
      where id = ${r.id}
        and follow_up_stage < 4
      returning id, name, email
    `;
    for (const u of updated) {
      silenced += 1;
      console.log(`  silenced ${u.name} <${u.email}> (${u.id})`);
    }
  }
}
console.log(`\n  ${silenced} row(s) silenced`);

console.log("\n=== Everyone the cron will email next run, after the fix ===");
const after = await sql`
  select name, email, paid_at, follow_up_stage, created_at
  from enquiries
  where type = 'event'
    and is_member = false
    and paid_at is null
    and unsubscribed_at is null
    and follow_up_stage < 4
    and created_at >= timestamp '2026-09-01 00:00:00'
    and message like '%You Are Not Alone%'
  order by created_at
`;
for (const r of after) {
  console.log(
    `  ${r.name} <${r.email}> stage=${r.follow_up_stage} created=${new Date(r.created_at).toISOString()}`
  );
}
