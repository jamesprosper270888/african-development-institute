/**
 * ADI "You Are Not Alone" truth sheet.
 *
 * The ADI answer to o2c-media-buying/truth-sheet.mjs: one table that puts what
 * Meta charged us next to what actually arrived, what actually reserved and
 * what actually paid, per creative and per day.
 *
 * Three systems hold three different versions of this campaign and nothing had
 * ever joined them, so nobody could see that four of the five payments never
 * reached the tracker at all:
 *   Meta   spend, impressions, CTR    (needs a token, see below)
 *   PCM    arrivals, leads, purchases (prospectconnectmedia.com tracker DB)
 *   ADI    reservations and paid_at   (this site's own DB)
 *
 * Every section degrades on its own. With no credentials at all it still runs
 * and tells you which ones are missing, so it is safe to hand to anyone.
 *
 * READ-ONLY. It writes nothing, anywhere.
 *
 * Usage:
 *   node scripts/adi-report.mjs                  since launch (23 Aug)
 *   node scripts/adi-report.mjs --since 2026-09-01
 *   node scripts/adi-report.mjs --days 7
 *   node scripts/adi-report.mjs --json           machine-readable, for a sheet
 *
 * Credentials, all optional:
 *   PCM_DATABASE_URL     the PCM tracker DB. Defaults to reading DATABASE_URL
 *                        out of C:/dev/prospect-connect-media/.env, which is
 *                        how the O2C scripts have always done it.
 *   DATABASE_URL         ADI's own DB, for the seat count. Easiest via
 *                        `vercel env pull` then `node --env-file=...`.
 *   META_ADS_TOKEN_FILE  path to a file holding a Meta token, same convention
 *                        as scripts/meta-build-yana-phase2.mjs. A Graph API
 *                        Explorer token works but dies in an hour or two; for
 *                        anything repeatable use a Business Manager System User
 *                        token, which does not expire.
 */
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const CAMPAIGN_ID = "120259566119570456";
const OFFER_SLUG = "adi-yana";
const LAUNCH = "2026-08-23";
const TZ = "Europe/London";
const PCM_ENV = "C:/dev/prospect-connect-media/.env";
const PCM_PKG = "C:/dev/prospect-connect-media/package.json";

// Clicks we minted ourselves while building and checking the funnel. Real
// people never carried these ad names.
const OUR_TESTS = ["TEST-claude", "LIVE-TEST", "LIVE-TEST-2", "curl-check"];

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : null;
};
const JSON_OUT = argv.includes("--json");
const ymd = (d) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

const days = flag("--days");
const TO = ymd(new Date());
const FROM =
  flag("--since") ||
  (days ? ymd(new Date(Date.now() - (Number(days) - 1) * 86400000)) : LAUNCH);

const say = (...a) => {
  if (!JSON_OUT) console.log(...a);
};
const table = (rows) => {
  if (!JSON_OUT && rows.length) console.table(rows);
};
const gbp = (n) => "\u00a3" + Number(n).toFixed(2);
const pct = (n, d) => (d ? ((n / d) * 100).toFixed(2) + "%" : "-");

/** Both tracker DBs are Neon, and only PCM has the driver installed. */
function neonClient(connectionString) {
  const require = createRequire(PCM_PKG);
  const { Client, neonConfig } = require("@neondatabase/serverless");
  neonConfig.webSocketConstructor = globalThis.WebSocket;
  return new Client({ connectionString });
}

say(`\nADI "You Are Not Alone" \u2014 ${FROM} to ${TO} (${TZ})`);
say("=".repeat(72));

// ------------------------------------------------------------------ Meta ---
// Spend, impressions and CTR exist nowhere else. Without a token this section
// is simply absent, and the arrivals below still tell you most of the story.
async function pullMeta() {
  say("\n## SPEND AND DELIVERY (Meta)");
  const tokenFile = process.env.META_ADS_TOKEN_FILE;
  const token =
    process.env.META_ADS_TOKEN ||
    (tokenFile && existsSync(tokenFile)
      ? readFileSync(tokenFile, "utf8").trim()
      : null);
  if (!token) {
    say("   skipped: no META_ADS_TOKEN_FILE or META_ADS_TOKEN.");
    say("   Mint a Business Manager System User token once and this fills in");
    say("   for good. A Graph API Explorer token also works, for an hour or two.");
    return null;
  }

  const url = new URL(`https://graph.facebook.com/v21.0/${CAMPAIGN_ID}/insights`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("level", "ad");
  url.searchParams.set(
    "fields",
    [
      "ad_name",
      "impressions",
      "reach",
      "frequency",
      "inline_link_clicks",
      "inline_link_click_ctr",
      "cpc",
      "cpm",
      "spend",
      "actions",
    ].join(","),
  );
  url.searchParams.set("time_range", JSON.stringify({ since: FROM, until: TO }));
  url.searchParams.set("limit", "200");

  const json = await (await fetch(url)).json();
  if (json.error) {
    say(`   FAILED: ${json.error.message}`);
    // A token missing ads_read is the usual cause, and it is worth saying so
    // rather than leaving someone to guess at an OAuth error code.
    if (/permission|OAuth|token|expire/i.test(json.error.message || "")) {
      say("   That normally means the token lacks ads_read, or it has expired.");
    }
    return null;
  }

  const rows = (json.data || [])
    .map((r) => {
      const act = (re) =>
        Number((r.actions || []).find((a) => re.test(a.action_type))?.value || 0);
      return {
        ad: r.ad_name,
        spend: Number(r.spend || 0),
        impressions: Number(r.impressions || 0),
        reach: Number(r.reach || 0),
        freq: Number(r.frequency || 0),
        link_clicks: Number(r.inline_link_clicks || 0),
        ctr: Number(r.inline_link_click_ctr || 0),
        cpc: Number(r.cpc || 0),
        cpm: Number(r.cpm || 0),
        meta_leads: act(/^lead$/),
        meta_purchases: act(/purchase/),
      };
    })
    .sort((a, b) => b.spend - a.spend);

  table(
    rows.map((r) => ({
      ad: r.ad,
      spend: gbp(r.spend),
      impr: r.impressions,
      reach: r.reach,
      freq: r.freq.toFixed(2),
      link_clicks: r.link_clicks,
      CTR: r.ctr.toFixed(2) + "%",
      CPC: gbp(r.cpc),
      CPM: gbp(r.cpm),
      "Meta leads": r.meta_leads,
      CPL: r.meta_leads ? gbp(r.spend / r.meta_leads) : "-",
    })),
  );

  const tot = rows.reduce(
    (a, r) => ({
      spend: a.spend + r.spend,
      impressions: a.impressions + r.impressions,
      link_clicks: a.link_clicks + r.link_clicks,
      meta_leads: a.meta_leads + r.meta_leads,
    }),
    { spend: 0, impressions: 0, link_clicks: 0, meta_leads: 0 },
  );
  say(
    `   total ${gbp(tot.spend)}, ${tot.impressions} impressions, ` +
      `${tot.link_clicks} link clicks, CTR ${pct(tot.link_clicks, tot.impressions)}, ` +
      `${tot.meta_leads} leads` +
      (tot.meta_leads ? ` at ${gbp(tot.spend / tot.meta_leads)} each` : ""),
  );

  // One ad taking nearly all the impressions is the normal Meta outcome, and it
  // is the reason a creative test cannot be read at this budget. Say it out loud
  // rather than letting someone infer a winner from a table of near-zero rows.
  const top = rows[0];
  if (top && tot.impressions) {
    const share = top.impressions / tot.impressions;
    if (share > 0.8) {
      say(
        `   NOTE: ${top.ad} took ${(share * 100).toFixed(1)}% of impressions. ` +
          `The others never got enough delivery to be judged.`,
      );
    }
  }
  return { rows, tot };
}

// ------------------------------------------------------------------- PCM ---
function pcmConnectionString() {
  if (process.env.PCM_DATABASE_URL) return process.env.PCM_DATABASE_URL;
  if (!existsSync(PCM_ENV)) return null;
  for (const line of readFileSync(PCM_ENV, "utf8").split(/\r?\n/)) {
    const m = line.match(/^(DATABASE_URL_UNPOOLED|DATABASE_URL)=(.*)$/);
    if (m) return m[2].replace(/^"|"$/g, "");
  }
  return null;
}

async function pullPCM() {
  say("\n## ARRIVALS AND CONVERSIONS (PCM tracker)");
  const conn = pcmConnectionString();
  if (!conn) {
    say(`   skipped: no PCM_DATABASE_URL, and no DATABASE_URL in ${PCM_ENV}`);
    return null;
  }
  const db = neonClient(conn);
  await db.connect();

  // Three buckets, shown rather than silently filtered.
  //
  // Meta's ad review fetches the landing page from a fleet of IPs using spoofed
  // iPhone and Android user agents, so no user-agent rule can catch them and no
  // per-IP rule can either. What gives them away is density: 36 arrived inside
  // five seconds on 10 Sep. Real delivery here peaks around 57 clicks in a whole
  // day, so five in one minute is not a person.
  const BUCKET = `
    case
      when c.utm_ad = any($3::text[]) then 'our own tests'
      when c.user_agent ~* 'facebookexternalhit|externalhit|bot|crawler|spider|headless|python|curl|node-fetch|powershell' then 'crawler'
      when burst.n >= 5 then 'ad review burst'
      else 'human'
    end`;
  const SCOPE = `
    from affiliate_clicks c
    join affiliate_offers o on o.id = c.offer_id
    left join (
      select date_trunc('minute', c2.created_at) m, count(*)::int n
      from affiliate_clicks c2
      join affiliate_offers o2 on o2.id = c2.offer_id
      where o2.slug = $4
      group by 1
    ) burst on burst.m = date_trunc('minute', c.created_at)
    where o.slug = $4
      and (c.created_at at time zone $5)::date between $1::date and $2::date`;
  const args = [FROM, TO, OUR_TESTS, OFFER_SLUG, TZ];

  const buckets = (
    await db.query(
      `select ${BUCKET} bucket, count(*)::int clicks ${SCOPE} group by 1 order by clicks desc`,
      args,
    )
  ).rows;
  say("\n   what the click ledger is actually made of:");
  table(buckets);

  const perAd = (
    await db.query(
      `select coalesce(nullif(c.utm_ad,''),'(none)') ad, c.utm_source src,
         count(*) filter (where ${BUCKET} = 'human')::int arrivals,
         count(*)::int recorded
       ${SCOPE} group by 1,2 order by arrivals desc, recorded desc`,
      args,
    )
  ).rows;

  // Leads and purchases are told apart by the txn id prefix that
  // /api/event-registration and /api/track/purchase mint.
  const conv = (
    await db.query(
      `select coalesce(nullif(c.utm_ad,''),'(none)') ad,
         count(*) filter (where v.network_txn_id like 'lead-%')::int leads,
         count(*) filter (where v.network_txn_id like 'purchase-%')::int purchases,
         coalesce(sum(v.payout_cents) filter (where v.status='approved'),0)/100.0 revenue
       from conversions v
       join affiliate_clicks c on c.id = v.click_id
       join affiliate_offers o on o.id = v.offer_id
       where o.slug = $4
         and (v.created_at at time zone $5)::date between $1::date and $2::date
         and not (c.utm_ad = any($3::text[]))
       group by 1`,
      args,
    )
  ).rows;
  const byAd = new Map(conv.map((r) => [r.ad, r]));

  say("\n   per creative:");
  table(
    perAd.map((r) => {
      const c = byAd.get(r.ad) || { leads: 0, purchases: 0, revenue: 0 };
      return {
        ad: r.ad,
        src: r.src,
        arrivals: r.arrivals,
        "not human": r.recorded - r.arrivals,
        leads: c.leads,
        "lead rate": pct(c.leads, r.arrivals),
        purchases: c.purchases,
        revenue: gbp(c.revenue),
      };
    }),
  );

  const daily = (
    await db.query(
      `select to_char((c.created_at at time zone $5)::date,'YYYY-MM-DD') "day",
         count(*) filter (where ${BUCKET} = 'human')::int arrivals,
         count(*)::int recorded
       ${SCOPE} group by 1 order by 1`,
      args,
    )
  ).rows;
  say("\n   per day:");
  table(daily);

  const [tot] = (
    await db.query(
      `select count(*) filter (where ${BUCKET} = 'human')::int arrivals,
              count(*)::int recorded ${SCOPE}`,
      args,
    )
  ).rows;
  const [cv] = (
    await db.query(
      `select count(*) filter (where v.network_txn_id like 'lead-%')::int leads,
         count(*) filter (where v.network_txn_id like 'purchase-%')::int purchases,
         coalesce(sum(v.payout_cents) filter (where v.status='approved'),0)/100.0 revenue
       from conversions v
       join affiliate_clicks c on c.id = v.click_id
       join affiliate_offers o on o.id = v.offer_id
       where o.slug = $4
         and (v.created_at at time zone $5)::date between $1::date and $2::date
         and not (c.utm_ad = any($3::text[]))`,
      args,
    )
  ).rows;

  // Attribution can only ever be as good as the ad name on the link. Phase one
  // used {{ad.name}} and Meta delivered it unexpanded on a slice of clicks; the
  // phase two ads hardcode their names, so this should stay flat from 14 Sep.
  const [macro] = (
    await db.query(
      `select count(*)::int n ${SCOPE}
         and c.utm_ad like '%{{%'
         and not (c.utm_ad = any($3::text[]))`,
      args,
    )
  ).rows;

  await db.end();
  return { buckets, perAd, daily, tot, cv, macro: macro.n };
}

// ------------------------------------------------------------------- ADI ---
async function pullADI() {
  say("\n## SEATS (ADI site DB)");
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    say("   skipped: no DATABASE_URL. To include seats:");
    say("   npx vercel env pull .adi.env --environment=production --yes");
    say("   node --env-file=.adi.env scripts/adi-report.mjs");
    return null;
  }
  const db = neonClient(conn);
  await db.connect();
  // Whether a reserver arrived through a tracked link decides whether PCM could
  // ever have seen their payment, so it has to come back with the row. The click
  // id is only kept inside the message text /api/event-registration composes.
  const rows = (
    await db.query(
      `select name, email, is_member "member", paid_at is not null "paid",
         message like '%Click ref:%' "tracked",
         to_char(created_at at time zone $1,'YYYY-MM-DD HH24:MI') reserved
       from enquiries
       where type = 'event'
         and created_at >= '2026-09-01'
         and message like '%You Are Not Alone%'
       order by created_at`,
      [TZ],
    )
  ).rows;
  await db.end();
  table(rows);

  // Maisie sat in here twice before the duplicate guard shipped. Seats are
  // people, not rows, so the headline count has to be distinct addresses.
  const distinct = new Set(rows.map((r) => r.email.trim().toLowerCase())).size;
  const paid = rows.filter((r) => r.paid).length;
  const members = rows.filter((r) => r.member).length;
  const paidTracked = rows.filter((r) => r.paid && r.tracked).length;
  say(
    `   ${distinct} people (${rows.length} rows), ${paid} paid, ${members} members, ` +
      `${rows.length - paid - members} unpaid guests`,
  );
  return { rows, distinct, paid, members, paidTracked };
}

// -------------------------------------------------------- reconciliation ---
const meta = await pullMeta();
const pcm = await pullPCM();
const adi = await pullADI();

say("\n## RECONCILIATION");
say("=".repeat(72));

if (meta && pcm) {
  const gap = meta.tot.link_clicks - pcm.tot.arrivals;
  say(
    `Meta says ${meta.tot.link_clicks} link clicks, PCM logged ${pcm.tot.arrivals} human arrivals ` +
      `(gap ${gap >= 0 ? "+" : ""}${gap}).`,
  );
  say("   Some gap is normal: Meta counts a click, PCM counts an arrival, and");
  say("   people give up mid-redirect. A large gap means the link is losing people.");
}

if (pcm) {
  say(
    `PCM: ${pcm.tot.arrivals} arrivals -> ${pcm.cv.leads} leads -> ` +
      `${pcm.cv.purchases} purchases (${gbp(pcm.cv.revenue)}).`,
  );
  if (pcm.macro) {
    say(
      `   ${pcm.macro} clicks carry an unresolved {{ad.name}}, so their creative is unknown.`,
    );
  }
}

if (pcm && adi) {
  // Two very different things look identical if you only subtract, and reading
  // them as one number sends you hunting for a bug that is not there.
  //
  //   untracked : the buyer never came through /r/adi-yana, so they have no
  //               click id, so postbackToPCM() correctly declines to invent an
  //               attribution. Working as designed. Organic sales look like this.
  //   leaked    : the buyer DID arrive on a tracked link and still never
  //               produced a purchase row. That is a real gap, and it is the
  //               one worth chasing.
  const untracked = adi.paid - adi.paidTracked;
  const leaked = adi.paidTracked - pcm.cv.purchases;
  say(`\n   ${adi.paid} payments taken. The tracker holds ${pcm.cv.purchases}.`);
  if (untracked > 0) {
    say(
      `   ${untracked} arrived with no click id (organic, direct, word of mouth).`,
    );
    say("   PCM can never see those. Not a fault, but it does mean paid traffic is");
    say("   carrying less of this campaign than the raw seat count suggests.");
  }
  if (leaked > 0) {
    say(`   ${leaked} DID arrive on a tracked link and still never posted back.`);
    say("   That is the real leak: paying somewhere that skips /thank-you?paid=1,");
    say("   or paying from a different device, where the lead cookie is absent and");
    say("   /api/track/purchase answers 403. Meta is under-fed by this much.");
  }
  if (untracked <= 0 && leaked <= 0) {
    say("   Every tracked payment is accounted for.");
  }
}

say("");
if (JSON_OUT) {
  console.log(JSON.stringify({ from: FROM, to: TO, meta, pcm, adi }, null, 2));
}
