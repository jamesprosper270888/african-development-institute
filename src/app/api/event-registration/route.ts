import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { appendToSheet } from "@/lib/google-sheets";
import { sendEmail } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";
import { forwardToGHL } from "@/lib/ghl";

const registrationSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  event: z.string().min(1).max(200),
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

  const { name, email, event } = result.data;
  const timestamp = new Date().toISOString();
  const message = `Free member registration — ${event}`;

  await db.insert(enquiries).values({
    name,
    email,
    type: "event",
    message,
    sourcePage: new URL(request.url).searchParams.get("source") || null,
  });

  await appendToSheet("Events", [[timestamp, name, email, event]]);

  await sendEmail({
    to:
      process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] ||
      "hello@africandevelopmentinstitute.com",
    subject: `[ADI] Event registration: ${name} — ${event}`,
    react: EnquiryNotification({
      name,
      email,
      type: "event",
      message,
      timestamp,
    }),
  });

  await sendTelegramNotification(
    [
      `🎟️ <b>EVENT REGISTRATION - ADI</b>`,
      ``,
      `👤 <b>Name:</b> ${escapeHtml(name)}`,
      `📧 <b>Email:</b> ${escapeHtml(email)}`,
      `📅 <b>Event:</b> ${escapeHtml(event)}`,
    ].join("\n")
  );

  forwardToGHL({ name, email, source: "event-registration", message });

  return NextResponse.json({ success: true });
}
