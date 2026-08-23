/**
 * Builds the ADI "You Are Not Alone" Meta campaign via the Marketing API.
 * Everything is created PAUSED. Idempotent-ish: re-running creates duplicates,
 * so check Ads Manager first.
 *
 * Usage:
 *   META_ADS_TOKEN_FILE="C:\Users\james\OneDrive\Desktop\meta-ads-token.txt" \
 *   node scripts/meta-build-yana-campaign.mjs [--dry]
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const V = "v21.0";
const G = `https://graph.facebook.com/${V}`;
const ACT = "act_1024789818741757";
const PIXEL_ID = "1423556645175071";
const PAGE_NAME = "African Development Institute";
const PAGE_ID = "118136366261661"; // facebook.com/africandevelopmentinstitute
const CREATIVES_DIR = "C:/Users/james/OneDrive/Desktop/ADI-YANA-creatives";
const DRY = process.argv.includes("--dry");
const EXISTING_CAMPAIGN = process.env.META_CAMPAIGN_ID; // reuse instead of creating
const EXISTING_ADSET = process.env.META_ADSET_ID;
const PIC_BASE = "https://africandevelopmentinstitute.com/events/ads";

const tokenFile = process.env.META_ADS_TOKEN_FILE;
if (!tokenFile) throw new Error("META_ADS_TOKEN_FILE not set");
const TOKEN = readFileSync(tokenFile, "utf8").trim();
if (!TOKEN.startsWith("EAA")) throw new Error("token does not look like a Meta token");

const LINK =
  "https://prospectconnectmedia.com/r/adi-yana?src=fb-paid&camp=yana-sep26&ad={{ad.name}}";
const URL_TAGS =
  "utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}";
const HEADLINE = "You Are Not Alone.";
const DESCRIPTION = "An ADI gathering for Black professionals · Sat 26 Sep · Weybridge";

const ADS = [
  {
    name: "A-work-typo",
    picture: `${PIC_BASE}/a-work.png`,
    message: `The only one in the room. The extra effort nobody names. The calm face over the exhaustion.

On Saturday 26 September, ADI is bringing together 20 Black professionals for one day in Weybridge — to understand what is actually happening at work, what to do about it before it becomes a crisis, and who has your back afterwards.

Hosted by Pam Rowe and Marcia Daigo, coaches who have sat with Black professionals at exactly this point for years. Lunch included, plus a 30-minute 1:1 after the event.

20 seats. Early bird £24.99. Reserving your seat is free.`,
  },
  {
    name: "B-social-typo",
    picture: `${PIC_BASE}/b-social.png`,
    message: `The friends who love you but do not quite get it. The conversations you have stopped starting, because explaining is more tiring than carrying it.

On 26 September there is a room where nobody needs the basics explained: 20 Black professionals, one day in Weybridge, hosted by two coaches who have been there. What is really going on, what to do about it, and people you can call afterwards.

Lunch included. 20 seats. Early bird £24.99. Reserving is free.`,
  },
  {
    name: "C-only-photo",
    picture: `${PIC_BASE}/c-only.png`,
    message: `The first. The only. The one who has to represent. The one who learned early to adapt, to be twice as good — and who is not sure when the numbness started.

You Are Not Alone is a one-day gathering for Black professionals: Saturday 26 September, Weybridge, 20 seats. Understand the pattern, learn what to do at each stage, and leave with a plan and a room of people who get it.

Hosted by Pam Rowe and Marcia Daigo. Lunch and a 30-minute 1:1 included. Early bird £24.99 — reserving is free.`,
  },
];

async function api(path, { method = "GET", params = {}, body } = {}) {
  const url = new URL(`${G}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, typeof v === "string" ? v : JSON.stringify(v));
  let init = { method };
  if (body) {
    if (body instanceof FormData) init.body = body;
    else {
      const fd = new URLSearchParams();
      for (const [k, v] of Object.entries(body)) fd.set(k, typeof v === "string" ? v : JSON.stringify(v));
      init.body = fd;
    }
  }
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json.error ?? json)}`);
  }
  return json;
}

function log(...a) { console.log(new Date().toISOString().slice(11, 19), ...a); }

// 0. Sanity: token, ad account, page
const me = await api("me", { params: { fields: "id,name" } });
log("token user:", me.name);
const acct = await api(ACT, { params: { fields: "name,account_status,currency,timezone_name" } });
log("ad account:", acct.name, acct.currency, acct.timezone_name, "status", acct.account_status);
if (acct.currency !== "GBP") throw new Error("expected GBP account");

const page = await api(PAGE_ID, { params: { fields: "id,name" } });
if (page.name !== PAGE_NAME) throw new Error(`Page ${PAGE_ID} is "${page.name}", expected "${PAGE_NAME}"`);
log("page:", page.name, page.id);

// 1. Targeting: Weybridge + 40km, 25-60, Advantage+ audience
const search = await api("search", { params: { type: "adgeolocation", location_types: ["city"], q: "Weybridge", country_code: "GB", limit: 5 } });
const wey = search.data.find((c) => /weybridge/i.test(c.name) && c.country_code === "GB");
if (!wey) throw new Error("Weybridge city key not found: " + JSON.stringify(search.data));
log("geo:", wey.name, wey.key, wey.region);
const targeting = {
  geo_locations: { cities: [{ key: wey.key, radius: 40, distance_unit: "kilometer" }], location_types: ["home", "recent"] },
  age_min: 25,
  targeting_automation: { advantage_audience: 1 },
};

if (DRY) { log("DRY RUN — would create campaign/adset/3 ads with", JSON.stringify(targeting)); process.exit(0); }

// 2. Campaign (Advantage+ campaign budget, £10/day, PAUSED)
const campaign = EXISTING_CAMPAIGN ? { id: EXISTING_CAMPAIGN } : await api(`${ACT}/campaigns`, {
  method: "POST",
  body: {
    name: "ADI-YANA-Sep26-Leads",
    objective: "OUTCOME_LEADS",
    status: "PAUSED",
    special_ad_categories: [],
    daily_budget: 1000,
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    is_adset_budget_sharing_enabled: false,
  },
});
log("campaign:", campaign.id);

// 3. Ad set (website Lead on ADI Pixel, ends 25 Sep 23:59 London)
const adset = EXISTING_ADSET ? { id: EXISTING_ADSET } : await api(`${ACT}/adsets`, {
  method: "POST",
  body: {
    name: "UK-Weybridge40km-London-25-60-Broad",
    campaign_id: campaign.id,
    status: "PAUSED",
    billing_event: "IMPRESSIONS",
    optimization_goal: "OFFSITE_CONVERSIONS",
    promoted_object: { pixel_id: PIXEL_ID, custom_event_type: "LEAD" },
    targeting,
    end_time: "2026-09-25T23:59:00+0100",
    attribution_spec: [{ event_type: "CLICK_THROUGH", window_days: 7 }, { event_type: "VIEW_THROUGH", window_days: 1 }],
  },
});
log("adset:", adset.id);

// 4. Images → creatives → ads
for (const ad of ADS) {

  const creative = await api(`${ACT}/adcreatives`, {
    method: "POST",
    body: {
      name: `YANA ${ad.name}`,
      object_story_spec: {
        page_id: page.id,
        link_data: {
          picture: ad.picture,
          link: LINK,
          message: ad.message,
          name: HEADLINE,
          description: DESCRIPTION,
          caption: "africandevelopmentinstitute.com",
          call_to_action: { type: "SIGN_UP", value: { link: LINK } },
        },
      },
      url_tags: URL_TAGS,
    },
  });
  log("creative:", creative.id);

  const created = await api(`${ACT}/ads`, {
    method: "POST",
    body: { name: ad.name, adset_id: adset.id, creative: { creative_id: creative.id }, status: "PAUSED" },
  });
  log("ad:", ad.name, created.id);
}

log("DONE — campaign", campaign.id, "is PAUSED. Review in Ads Manager, then switch on Monday.");
