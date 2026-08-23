import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sendMetaEvent } from "@/lib/meta-capi";
import { postbackToPCM } from "@/lib/pcm-postback";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";
import {
  EVENT,
  eventPath,
  LEAD_COOKIE,
  currentTicketPrice,
} from "@/lib/event-config";

/**
 * Fired by the thank-you page when GHL redirects back with ?paid=1.
 * Sends Purchase to Meta CAPI (deduped with the browser pixel via eventId)
 * and an approved postback to PCM.
 *
 * Guard rails: requires the httpOnly lead cookie set by /api/event-registration
 * (so only a browser that actually reserved can report), one purchase per lead
 * (PCM dedupes on txn_id), and the value is computed server-side. The
 * authoritative record of payment remains Stripe/GHL; this is a tracking signal.
 */
const schema = z.object({
  eventId: z.string().min(1).max(100),
  attribution: z
    .object({
      fbp: z.string().max(100).optional(),
      fbc: z.string().max(200).optional(),
      pcmClickId: z.string().max(100).optional(),
      src: z.string().max(100).optional(),
      campaign: z.string().max(100).optional(),
      ad: z.string().max(200).optional(),
      landingUrl: z.string().max(2000).optional(),
    })
    .partial()
    .optional(),
});

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const { success } = checkRateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const leadId = (await cookies()).get(LEAD_COOKIE)?.value;
  if (!leadId || leadId.length > 100) {
    return NextResponse.json({ error: "No reservation found" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { eventId, attribution } = parsed.data;
  const value = currentTicketPrice();

  await Promise.all([
    sendMetaEvent({
      eventName: "Purchase",
      eventId,
      sourceUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${eventPath("/thank-you")}`,
      user: {
        ip,
        userAgent: request.headers.get("user-agent"),
        fbp: attribution?.fbp,
        fbc: attribution?.fbc,
      },
      customData: {
        content_name: EVENT.name,
        value,
        currency: EVENT.pricing.currency,
      },
    }),
    postbackToPCM({
      clickId: attribution?.pcmClickId,
      txnId: `purchase-${leadId}`,
      payout: value,
      status: "approved",
    }),
    sendTelegramNotification(
      [
        `💷 <b>TICKET PURCHASED — ADI ${escapeHtml(EVENT.name)}</b>`,
        `Value: £${value.toFixed(2)} · lead ${escapeHtml(leadId)}`,
        attribution?.src
          ? `Source: ${escapeHtml(
              [attribution.src, attribution.campaign, attribution.ad]
                .filter(Boolean)
                .join(" / ")
            )}`
          : null,
      ]
        .filter(Boolean)
        .join("\n")
    ),
  ]);

  return NextResponse.json({ success: true });
}
