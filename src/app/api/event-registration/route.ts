import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { appendToSheet } from "@/lib/google-sheets";
import { sendEmail, internalRecipients } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { EventReserveConfirmation } from "@/lib/email/templates/event-reserve-confirmation";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";
import { forwardToGHL } from "@/lib/ghl";
import { sendMetaEvent } from "@/lib/meta-capi";
import { postbackToPCM } from "@/lib/pcm-postback";
import { EVENT, eventPath, LEAD_COOKIE } from "@/lib/event-config";

const attributionSchema = z
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
  .optional();

const registrationSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  phone: z.string().min(7).max(30).optional(),
  isMember: z.boolean().optional().default(false),
  event: z.string().min(1).max(200),
  eventId: z.string().max(100).optional(),
  attribution: attributionSchema,
});

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const { success } = checkRateLimit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const result = registrationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid form data. Please check your inputs." },
      { status: 400 }
    );
  }

  const { name, email, phone, isMember, event, eventId, attribution } =
    result.data;
  const timestamp = new Date().toISOString();
  const kind = isMember ? "MEMBER (free — verify)" : "GUEST (to pay)";
  const attrSummary = attribution
    ? [attribution.src, attribution.campaign, attribution.ad]
        .filter(Boolean)
        .join(" / ")
    : "";
  const message = [
    `Seat reserved — ${event}`,
    `Type: ${kind}`,
    phone ? `Phone: ${phone}` : null,
    attrSummary ? `Source: ${attrSummary}` : null,
    attribution?.pcmClickId ? `PCM click: ${attribution.pcmClickId}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const [row] = await db
    .insert(enquiries)
    .values({
      name,
      email,
      type: "event",
      message,
      sourcePage:
        new URL(request.url).searchParams.get("source") ||
        attribution?.landingUrl ||
        null,
    })
    .returning({ id: enquiries.id });

  await appendToSheet("Events", [
    [
      timestamp,
      name,
      email,
      phone ?? "",
      isMember ? "member" : "guest",
      event,
      attrSummary,
      attribution?.pcmClickId ?? "",
    ],
  ]);

  // Internal notification (Pam/Marcia's inbox + James) — see NOTIFY_EMAILS
  await sendEmail({
    to: internalRecipients(),
    subject: `[ADI] Seat reserved (${isMember ? "member" : "guest"}): ${name} — ${event}`,
    react: EnquiryNotification({
      name,
      email,
      type: "event",
      message,
      timestamp,
    }),
  });

  // Registrant-facing confirmation with the early-bird link
  await sendEmail({
    to: email,
    subject: isMember
      ? `Your seat at ${EVENT.name} — ${EVENT.dateShort}`
      : `Your seat is reserved — secure it at the early-bird price`,
    react: EventReserveConfirmation({ name, isMember }),
    replyTo: process.env.REPLY_TO_EMAIL,
  });

  await sendTelegramNotification(
    [
      `🎟️ <b>SEAT RESERVED — ADI ${escapeHtml(EVENT.name)}</b>`,
      ``,
      `👤 <b>Name:</b> ${escapeHtml(name)}`,
      `📧 <b>Email:</b> ${escapeHtml(email)}`,
      phone ? `📱 <b>Phone:</b> ${escapeHtml(phone)}` : null,
      `🏷️ <b>Type:</b> ${escapeHtml(kind)}`,
      attrSummary ? `📣 <b>Source:</b> ${escapeHtml(attrSummary)}` : null,
    ]
      .filter(Boolean)
      .join("\n")
  );

  await forwardToGHL({
    name,
    email,
    source: isMember ? "event-reserve-member" : "event-reserve-guest",
    message,
  });

  // Tracking — must never fail the submission
  const txnId = row?.id ?? eventId ?? `${Date.now()}`;
  await Promise.all([
    sendMetaEvent({
      eventName: "Lead",
      eventId: eventId ?? txnId,
      sourceUrl: attribution?.landingUrl ?? eventPath(),
      user: {
        email,
        phone,
        fullName: name,
        ip,
        userAgent: request.headers.get("user-agent"),
        fbp: attribution?.fbp,
        fbc: attribution?.fbc,
      },
      customData: {
        content_name: EVENT.name,
        lead_type: isMember ? "member" : "guest",
      },
    }),
    postbackToPCM({
      clickId: attribution?.pcmClickId,
      txnId: `lead-${txnId}`,
      payout: 0,
      status: "pending",
    }),
  ]);

  const res = NextResponse.json({ success: true, id: row?.id ?? null });
  // Lets the thank-you page report a purchase for this lead only (see /api/track/purchase)
  res.cookies.set(LEAD_COOKIE, txnId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
