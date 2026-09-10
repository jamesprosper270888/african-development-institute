/**
 * Phase 2 of the ADI "You Are Not Alone" Meta build: the early-bird handover.
 *
 * The early bird closes Sun 13 Sep 23:59, and C-only-photo carries "Early bird
 * £24.99" in both its image and its copy, so every live ad becomes wrong at
 * that moment. Rather than edit the working ad set, this:
 *   --build     copies the live ad set's settings into a new ad set that starts
 *               Mon 14 Sep 00:00, holding three post-early-bird ads (C2 = C with
 *               only the price line changed, E = the same shot with a man,
 *               F = the room). They are created ACTIVE so Meta reviews them now;
 *               nothing delivers until the start time.
 *   --end-live  sets the live ad set to end Sun 13 Sep 23:59.
 * Meta then does the switch at midnight. The live ad set is never edited
 * beyond its end time, and C stays intact, so extending that end time brings
 * it straight back.
 *
 * With no flag it only prints status. Re-running --build skips anything that
 * already exists (matched by name).
 *
 * Usage:
 *   META_ADS_TOKEN_FILE="C:\Users\james\OneDrive\Desktop\meta-ads-token.txt" \
 *   node scripts/meta-build-yana-phase2.mjs [--build] [--end-live] [--dry]
 */
import { readFileSync } from "node:fs";

const V = "v21.0";
const G = `https://graph.facebook.com/${V}`;
const ACT = "act_1024789818741757";
const CAMPAIGN_ID = "120259566119570456";
const LIVE_ADSET_ID = "120259566120450456";
const PAGE_ID = "118136366261661";
const PAGE_NAME = "African Development Institute";
const ADS_DIR = new URL("../public/events/ads/", import.meta.url);

const NEW_ADSET_NAME = "UK-Weybridge40km-London-25-60-Broad-from-14Sep";
const NEW_START = "2026-09-14T00:00:00+0100";
const LIVE_END = "2026-09-13T23:59:00+0100";
// The live ad set's original end. Fixed here, not copied from it, because
// --end-live moves that to 13 Sep and a later --build would inherit it.
const NEW_END = "2026-09-25T23:59:00+0100";

const BUILD = process.argv.includes("--build");
const END_LIVE = process.argv.includes("--end-live");
const DRY = process.argv.includes("--dry");

const tokenFile = process.env.META_ADS_TOKEN_FILE;
if (!tokenFile) throw new Error("META_ADS_TOKEN_FILE not set");
const TOKEN = readFileSync(tokenFile, "utf8").trim();
if (!TOKEN.startsWith("EAA")) throw new Error("token does not look like a Meta token");

const HEADLINE = "You Are Not Alone.";
const DESCRIPTION = "An ADI gathering for Black professionals · Sat 26 Sep · Weybridge";

// C's copy with only the price line changed (and its one long dash made a comma).
const TRAIN_COPY = `The first. The only. The one who has to represent. The one who learned early to adapt, to be twice as good, and who is not sure when the numbness started.

You Are Not Alone is a one-day gathering for Black professionals: Saturday 26 September, Weybridge, 20 seats. Understand the pattern, learn what to do at each stage, and leave with a plan and a room of people who get it.

Hosted by Pam Rowe and Marcia Daigo. Lunch and a 30-minute 1:1 included. Tickets £49.99, and reserving your seat is free.`;

const ROOM_COPY = `The friends who love you but do not quite get it. The conversations you have stopped starting, because explaining is more tiring than carrying it.

On 26 September there is a room where nobody needs the basics explained: 20 Black professionals, one day in Weybridge, hosted by Pam Rowe and Marcia Daigo, two coaches who have been there. What is really going on, what to do about it, and people you can call afterwards.

Lunch and a 30-minute 1:1 included. Tickets £49.99, and reserving your seat is free.`;

// Ad names are written into the links rather than using {{ad.name}}, which
// arrived unresolved on ~11% of phase 1 clicks.
const ADS = [
  { name: "C2-only-photo", file: "c-only-v2.jpg", message: TRAIN_COPY },
  { name: "E-man-train", file: "h-man-train-v2.jpg", message: TRAIN_COPY },
  { name: "F-the-room", file: "i-the-room-v2.jpg", message: ROOM_COPY },
];

const linkFor = (ad) =>
  `https://prospectconnectmedia.com/r/adi-yana?src=fb-paid&camp=yana-sep26&ad=${ad}`;
const tagsFor = (ad) =>
  `utm_source=facebook&utm_medium=paid&utm_campaign=ADI-YANA-Sep26-Leads&utm_content=${ad}`;

async function api(path, { method = "GET", params = {}, body } = {}) {
  const url = new URL(`${G}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  // undefined would otherwise be sent as the literal string "undefined".
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, typeof v === "string" ? v : JSON.stringify(v));
  }
  const init = { method };
  if (body) {
    const fd = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      if (v !== undefined) fd.set(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    init.body = fd;
  }
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json.error ?? json)}`);
  }
  return json;
}

function log(...a) { console.log(new Date().toISOString().slice(11, 19), ...a); }

async function status() {
  const sets = await api(`${CAMPAIGN_ID}/adsets`, {
    params: { fields: "id,name,status,effective_status,start_time,end_time", limit: 25 },
  });
  for (const s of sets.data) {
    log("adset:", s.name, s.id, s.effective_status, "start", s.start_time, "end", s.end_time);
    const ads = await api(`${s.id}/ads`, {
      params: { fields: "id,name,effective_status,ad_review_feedback", limit: 25 },
    });
    for (const a of ads.data) {
      log("   ad:", a.name, a.id, a.effective_status, a.ad_review_feedback ? JSON.stringify(a.ad_review_feedback) : "");
    }
  }
  return sets.data;
}

// 0. Sanity: token, ad account, page
const me = await api("me", { params: { fields: "id,name" } });
log("token user:", me.name);
// Stop before touching anything if the token was generated without a scope.
const REQUIRED = ["ads_management", "ads_read", "business_management", "pages_show_list", "pages_read_engagement", "pages_manage_ads"];
const granted = (await api("me/permissions")).data.filter((p) => p.status === "granted").map((p) => p.permission);
const missing = REQUIRED.filter((p) => !granted.includes(p));
if (missing.length) throw new Error(`token is missing ${missing.join(", ")}: regenerate it in Graph API Explorer`);
log("permissions OK:", REQUIRED.join(", "));
const acct = await api(ACT, { params: { fields: "name,account_status,currency,timezone_name" } });
log("ad account:", acct.name, acct.currency, acct.timezone_name, "status", acct.account_status);
if (acct.currency !== "GBP") throw new Error("expected GBP account");
const page = await api(PAGE_ID, { params: { fields: "id,name" } });
if (page.name !== PAGE_NAME) throw new Error(`Page ${PAGE_ID} is "${page.name}", expected "${PAGE_NAME}"`);

const sets = await status();

if (BUILD) {
  // 1. New ad set: an exact copy of the live one's delivery settings, scheduled.
  const live = await api(LIVE_ADSET_ID, {
    params: { fields: "targeting,promoted_object,optimization_goal,billing_event,attribution_spec,destination_type" },
  });
  let adset = sets.find((s) => s.name === NEW_ADSET_NAME);
  if (adset) {
    log("new adset exists, reusing:", adset.id);
  } else if (DRY) {
    log("DRY: would create adset", NEW_ADSET_NAME, "start", NEW_START, "end", NEW_END);
    log("DRY: copied from live:", JSON.stringify(live));
  } else {
    adset = await api(`${ACT}/adsets`, {
      method: "POST",
      body: {
        name: NEW_ADSET_NAME,
        campaign_id: CAMPAIGN_ID,
        status: "ACTIVE",
        billing_event: live.billing_event,
        optimization_goal: live.optimization_goal,
        // Only what phase 1 set: the read also returns smart_pse_enabled, and
        // destination_type reads back as "UNDEFINED" because it was never set.
        promoted_object: { pixel_id: live.promoted_object.pixel_id, custom_event_type: live.promoted_object.custom_event_type },
        targeting: live.targeting,
        attribution_spec: live.attribution_spec,
        start_time: NEW_START,
        end_time: NEW_END,
      },
    });
    log("adset created:", adset.id);
  }

  // 2. Images -> creatives -> ads (ACTIVE, so review starts now).
  const existing = adset?.id
    ? (await api(`${adset.id}/ads`, { params: { fields: "name", limit: 25 } })).data.map((a) => a.name)
    : [];
  for (const ad of ADS) {
    if (existing.includes(ad.name)) { log("ad exists, skipping:", ad.name); continue; }
    if (DRY) { log("DRY: would upload", ad.file, "and create", ad.name, "->", linkFor(ad.name)); continue; }

    const bytes = readFileSync(new URL(ad.file, ADS_DIR)).toString("base64");
    const img = await api(`${ACT}/adimages`, { method: "POST", body: { bytes, name: ad.file } });
    const hash = Object.values(img.images)[0].hash;

    const creative = await api(`${ACT}/adcreatives`, {
      method: "POST",
      body: {
        name: `YANA ${ad.name}`,
        object_story_spec: {
          page_id: page.id,
          link_data: {
            image_hash: hash,
            link: linkFor(ad.name),
            message: ad.message,
            name: HEADLINE,
            description: DESCRIPTION,
            caption: "africandevelopmentinstitute.com",
            call_to_action: { type: "SIGN_UP", value: { link: linkFor(ad.name) } },
          },
        },
        url_tags: tagsFor(ad.name),
      },
    });
    const created = await api(`${ACT}/ads`, {
      method: "POST",
      body: { name: ad.name, adset_id: adset.id, creative: { creative_id: creative.id }, status: "ACTIVE" },
    });
    log("ad created:", ad.name, created.id, "creative", creative.id);
  }
}

if (END_LIVE) {
  if (DRY) log("DRY: would set live adset", LIVE_ADSET_ID, "end_time", LIVE_END);
  else {
    // Never end the live ad set unless the replacement holds all its ads, so
    // Monday cannot start with nothing to deliver.
    const next = (await api(`${CAMPAIGN_ID}/adsets`, { params: { fields: "id,name", limit: 25 } }))
      .data.find((s) => s.name === NEW_ADSET_NAME);
    const nextAds = next
      ? (await api(`${next.id}/ads`, { params: { fields: "name,effective_status", limit: 25 } })).data
      : [];
    const usable = nextAds.filter((a) => a.effective_status !== "DISAPPROVED");
    if (usable.length < ADS.length) {
      throw new Error(`${NEW_ADSET_NAME} has ${usable.length}/${ADS.length} usable ads, so the live ad set was NOT ended`);
    }
    await api(LIVE_ADSET_ID, { method: "POST", body: { end_time: LIVE_END } });
    log("live adset now ends", LIVE_END);
  }
}

if ((BUILD || END_LIVE) && !DRY) { log("--- after ---"); await status(); }
