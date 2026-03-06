import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { appendToSheet } from "@/lib/google-sheets";
import { sendEmail } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { EnquiryConfirmation } from "@/lib/email/templates/enquiry-confirmation";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";

const enquirySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  type: z.enum(["general", "membership", "organisation"]),
  message: z.string().min(1).max(5000),
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
    to: process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || "hello@africandevelopmentinstitute.org",
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

  return NextResponse.json({ success: true });
}
