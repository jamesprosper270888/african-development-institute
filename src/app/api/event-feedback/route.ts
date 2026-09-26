import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { honeypotFilled } from "@/lib/honeypot";
import { sendEmail, internalRecipients } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { EVENT } from "@/lib/event-config";
import {
  FEEDBACK_QUESTIONS,
  PHOTO_PERMISSION,
  PUBLISH_PERMISSION,
  type PhotoPermission,
  type PublishPermission,
} from "@/lib/event-feedback";

const publishKeys = Object.keys(PUBLISH_PERMISSION) as [
  PublishPermission,
  ...PublishPermission[],
];
const photoKeys = Object.keys(PHOTO_PERMISSION) as [
  PhotoPermission,
  ...PhotoPermission[],
];

const optionalText = z
  .string()
  .trim()
  .max(4000)
  .nullish()
  .transform((v) => v || null);

const feedbackSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email(),
  rating: z.coerce.number().int().min(1).max(5),
  valuable: z.string().trim().min(1).max(4000),
  adviceToOthers: optionalText,
  improve: optionalText,
  publish: z.enum(publishKeys),
  photos: z.enum(photoKeys),
});

/**
 * Feedback and testimonials from the day, stored in `enquiries` with
 * type = "event-feedback". There is no JSON column on that table and this did
 * not justify a migration, so every answer goes into `message` as readable
 * lines, with the consent answers written out in the exact words the person
 * chose. That row is the record of what they agreed to: check it before any
 * quote or photo of them is used anywhere.
 *
 * The email is not verified, it is what they typed. It is there to match the
 * feedback to the reservation list, not as proof of who sent it.
 *
 * Not deduplicated on purpose: someone who remembers something else the next
 * morning should be able to send it. No Telegram ping, as with the book.
 */
export async function POST(request: Request) {
  // Its own bucket and a little roomier than the default 5 an hour: couples
  // and friends who came together often send from the same home connection.
  const { success } = checkRateLimit(`feedback:${getClientIP(request)}`, 10);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  if (honeypotFilled(body)) {
    return NextResponse.json({ success: true });
  }

  const result = feedbackSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Please check the required answers and try again." },
      { status: 400 }
    );
  }

  const { name, email, rating, valuable, adviceToOthers, improve, publish, photos } =
    result.data;

  const message = [
    `Feedback: ${EVENT.name}, ${EVENT.dateShort}`,
    `Rating: ${rating}/5`,
    ``,
    FEEDBACK_QUESTIONS.valuable,
    valuable,
    ``,
    FEEDBACK_QUESTIONS.adviceToOthers,
    adviceToOthers ?? "(left blank)",
    ``,
    FEEDBACK_QUESTIONS.improve,
    improve ?? "(left blank)",
    ``,
    `Publishing permission: ${PUBLISH_PERMISSION[publish]}`,
    `Photo permission: ${PHOTO_PERMISSION[photos]}`,
  ].join("\n");

  await db.insert(enquiries).values({
    name,
    email,
    type: "event-feedback",
    message,
    sourcePage: new URL(request.url).searchParams.get("source") || null,
  });

  // Internal notification (Pam/Marcia's inbox + James), see NOTIFY_EMAILS.
  // Reply-To is the attendee, so a thank-you is one click away.
  await sendEmail({
    to: internalRecipients(),
    replyTo: email,
    subject: `[ADI] Feedback ${rating}/5: ${name}`,
    react: EnquiryNotification({
      name,
      email,
      type: "event feedback",
      message,
      timestamp: new Date().toISOString(),
    }),
  });

  return NextResponse.json({ success: true });
}
