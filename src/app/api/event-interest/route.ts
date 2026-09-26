import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { honeypotFilled } from "@/lib/honeypot";
import { sendEmail, internalRecipients } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { NEXT_EVENT } from "@/lib/event-config";

const interestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email(),
  phone: z.string().trim().max(30).nullish(),
});

const TYPE = "event-interest";

/**
 * "Tell me about the next one", from the event page once the day is over.
 *
 * Rows live in `enquiries` with type = "event-interest". The reserve-to-pay
 * follow-up cron only reads type = "event", so nobody here is chased to pay
 * for a seat that does not exist yet. When the date is set, this is the list
 * to email first.
 *
 * Deliberately no Telegram ping: the page goes out to everyone who came, and
 * a burst of sign-ups the evening after is good news, not an alert.
 */
export async function POST(request: Request) {
  const { success } = checkRateLimit(`interest:${getClientIP(request)}`);
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

  const result = interestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Please check your name and email address." },
      { status: 400 }
    );
  }

  const { name, email } = result.data;
  const phone = result.data.phone || null;
  // The phone number has its own column, so the message stays a fixed string
  // that is easy to filter on.
  const message = `Interest: ${NEXT_EVENT.name}`;

  // Idempotent, like the reservation guard: a second submission (a double tap,
  // a second visit) is answered exactly like the first, but adds no row and
  // sends no second email. The response never says which happened, so this
  // cannot be used to test whether an address is already on the list.
  const [existing] = await db
    .select({ id: enquiries.id })
    .from(enquiries)
    .where(
      and(
        eq(enquiries.type, TYPE),
        sql`lower(trim(${enquiries.email})) = ${email.trim().toLowerCase()}`
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ success: true });
  }

  await db.insert(enquiries).values({
    name,
    email,
    type: TYPE,
    message,
    phone,
    sourcePage: new URL(request.url).searchParams.get("source") || null,
  });

  // Internal notification (Pam/Marcia's inbox + James), see NOTIFY_EMAILS.
  await sendEmail({
    to: internalRecipients(),
    replyTo: email,
    subject: `[ADI] Interest in ${NEXT_EVENT.name}: ${name}`,
    react: EnquiryNotification({
      name,
      email,
      type: "next event interest",
      message: phone ? `${message}\nPhone: ${phone}` : message,
      timestamp: new Date().toISOString(),
    }),
  });

  return NextResponse.json({ success: true });
}
