import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sendMetaEvent } from "@/lib/meta-capi";
import { postbackToPCM } from "@/lib/pcm-postback";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";
import { EVENT, eventPath } from "@/lib/event-config";

/**
 * Fired by the thank-you page when GHL redirects back with ?paid=1.
 * Sends Purchase to Meta CAPI (deduped with the browser pixel via eventId)
 * and an approved postback to PCM. The authoritative record of payment is
 * Stripe/GHL — this is a tracking signal only.
 */
const schema = z.object({
  eventId: z.string().min(1).max(100),
  value: z.number().positive().max(1000).optional(),
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

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { eventId, attribution } = parsed.data;
  const value = parsed.data.value ?? EVENT.pricing.earlyBird;

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
      txnId: `purchase-${eventId}`,
      payout: value,
      status: "approved",
    }),
    sendTelegramNotification(
      [
        `💷 <b>TICKET PURCHASED — ADI ${escapeHtml(EVENT.name)}</b>`,
        `Value: £${value.toFixed(2)}`,
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
