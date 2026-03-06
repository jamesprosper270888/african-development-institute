import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { appendToSheet } from "@/lib/google-sheets";
import { sendEmail } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { EnquiryConfirmation } from "@/lib/email/templates/enquiry-confirmation";
import { db } from "@/lib/db";
import { leadershipApplications } from "@/lib/schema";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";

const leadershipSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  roleOrg: z.string().min(1).max(500),
  motivation: z.string().min(1).max(5000),
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
  const result = leadershipSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid form data. Please check your inputs." },
      { status: 400 }
    );
  }

  const { name, email, roleOrg, motivation } = result.data;
  const timestamp = new Date().toISOString();

  // Write to database
  await db.insert(leadershipApplications).values({
    name,
    email,
    role: roleOrg,
    motivation,
  });

  // Append to Google Sheet (Leadership tab)
  await appendToSheet("Leadership Enquiries", [
    [timestamp, name, email, roleOrg, motivation, "HIGH PRIORITY"],
  ]);

  // Send admin notification (high priority)
  await sendEmail({
    to: process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || "hello@africandevelopmentinstitute.org",
    subject: `[ADI] LEADERSHIP ENQUIRY from ${name}`,
    react: EnquiryNotification({
      name,
      email,
      type: "leadership",
      message: `Role/Org: ${roleOrg}\n\nMotivation: ${motivation}`,
      timestamp,
    }),
  });

  // Send user confirmation
  await sendEmail({
    to: email,
    subject: "Thank you for your interest in the ADI Leadership Programme",
    react: EnquiryConfirmation({ name, type: "leadership" }),
  });

  // Telegram notification (high priority)
  await sendTelegramNotification(
    [
      `🎯 <b>LEADERSHIP ENQUIRY - ADI</b>`,
      ``,
      `👤 <b>Name:</b> ${escapeHtml(name)}`,
      `📧 <b>Email:</b> ${escapeHtml(email)}`,
      `💼 <b>Role/Org:</b> ${escapeHtml(roleOrg)}`,
      ``,
      `💬 ${escapeHtml(motivation.slice(0, 300))}`,
    ].join("\n")
  );

  return NextResponse.json({ success: true });
}
