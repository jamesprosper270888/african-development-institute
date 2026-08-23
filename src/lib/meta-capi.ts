import { createHash } from "node:crypto";

/**
 * Meta Conversions API (server side). Pairs with the browser pixel in
 * src/components/analytics/meta-pixel.tsx - pass the same eventId to both
 * and Meta deduplicates.
 *
 * Env: META_PIXEL_ID, META_CAPI_TOKEN, optional META_TEST_EVENT_CODE.
 * Never throws - a tracking failure must never fail a form submission.
 */

const GRAPH_VERSION = "v21.0";

export type MetaEventName =
  | "Lead"
  | "Purchase"
  | "ViewContent"
  | "InitiateCheckout";

export interface MetaUserData {
  email?: string;
  phone?: string;
  fullName?: string;
  ip?: string | null;
  userAgent?: string | null;
  fbp?: string;
  fbc?: string;
}

export interface SendMetaEventInput {
  eventName: MetaEventName;
  eventId: string;
  sourceUrl?: string;
  user: MetaUserData;
  customData?: Record<string, string | number>;
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalisePhone(phone: string): string {
  // Meta wants digits only with country code. Assume UK if it starts with 0.
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("0")) digits = `44${digits.slice(1)}`;
  return digits;
}

export async function sendMetaEvent(
  input: SendMetaEventInput
): Promise<boolean> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) {
    console.log(
      `[Meta CAPI] skipped (no pixel/token): ${input.eventName} ${input.eventId}`
    );
    return false;
  }

  const { user } = input;
  const nameParts = (user.fullName ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

  const user_data: Record<string, unknown> = {};
  if (user.email) user_data.em = [sha256(user.email)];
  if (user.phone) user_data.ph = [sha256(normalisePhone(user.phone))];
  if (firstName) user_data.fn = [sha256(firstName)];
  if (lastName) user_data.ln = [sha256(lastName)];
  if (user.ip) user_data.client_ip_address = user.ip;
  if (user.userAgent) user_data.client_user_agent = user.userAgent;
  if (user.fbp) user_data.fbp = user.fbp;
  if (user.fbc) user_data.fbc = user.fbc;
  user_data.country = [sha256("gb")];

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.sourceUrl,
        user_data,
        custom_data: input.customData,
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      console.error("[Meta CAPI] failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[Meta CAPI] error:", error);
    return false;
  }
}
