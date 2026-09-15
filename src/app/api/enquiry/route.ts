import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { honeypotFilled } from "@/lib/honeypot";
import { appendToSheet } from "@/lib/google-sheets";
import { sendEmail, internalRecipients } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { EnquiryConfirmation } from "@/lib/email/templates/enquiry-confirmation";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";
import { forwardToGHL } from "@/lib/ghl";

const enquirySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  type: z.enum(["general", "membership", "organisation"]),
  message: z.string().min(1).max(5000),
});

export async function POST(request: Request) {
  // Bots were filling this form with made-up names and real strangers' email
  // addresses, so ADI was emailing "thank you for contacting us" to people who
  // never had. See src/instrumentation-client.ts.
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json(
      { error: "We could not send that. Please refresh the page and try again." },
      { status: 403 }
    );
  }

  const ip = getClientIP(request);
  const { success } = checkRateLimit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  // A bot filled the hidden field. Report success so it has no reason to retry.
  if (honeypotFilled(body)) {
    return NextResponse.json({ success: true });
  }

  const result = enquirySchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid form data. Please check your inputs." },
      { status: 400 }
    );
  }

  const { name, email, type, message } = result.data;
  const timestamp = new Date().toISOString();

  // Write to database
  await db.insert(enquiries).values({
    name,
    email,
    type,
    message,
    sourcePage: new URL(request.url).searchParams.get("source") || null,
  });

  // Append to Google Sheet
  await appendToSheet("Enquiries", [[timestamp, name, email, type, message]]);

  // Send admin notification
  await sendEmail({
    to: internalRecipients(),
    subject: `[ADI] New ${type} enquiry from ${name}`,
    react: EnquiryNotification({ name, email, type, message, timestamp }),
  });

  // Send user confirmation
  await sendEmail({
    to: email,
    subject: "Thank you for contacting the African Development Institute",
    react: EnquiryConfirmation({ name, type }),
  });

  // Telegram notification
  await sendTelegramNotification(
    [
      `📩 <b>NEW ENQUIRY - ADI</b>`,
      ``,
      `👤 <b>Name:</b> ${escapeHtml(name)}`,
      `📧 <b>Email:</b> ${escapeHtml(email)}`,
      `📋 <b>Type:</b> ${escapeHtml(type)}`,
      ``,
      `💬 ${escapeHtml(message.slice(0, 300))}`,
    ].join("\n")
  );

  await forwardToGHL({ name, email, source: type, message });

  return NextResponse.json({ success: true });
}
