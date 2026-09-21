import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { z } from "zod/v4";
import { and, eq, sql } from "drizzle-orm";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { honeypotFilled } from "@/lib/honeypot";
import { sendEmail, internalRecipients } from "@/lib/email/resend";
import { EnquiryNotification } from "@/lib/email/templates/enquiry-notification";
import { BookReservationConfirmation } from "@/lib/email/templates/book-reservation-confirmation";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { forwardToGHL } from "@/lib/ghl";
import { BOOK } from "@/lib/book-config";

const reservationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email(),
  source: z.string().max(60).nullish(),
});

/**
 * A free reservation of the ADI book. Rows live in `enquiries` with
 * type = "book", which the event follow-up cron never reads (it filters on
 * type = "event"), so nobody here is chased to buy a ticket.
 *
 * Deliberately no Telegram ping: a room of people scanning the QR code on the
 * 26th would be thirty pings in ten minutes.
 */
export async function POST(request: Request) {
  // Listed in src/instrumentation-client.ts; the two must match.
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json(
      { error: "We could not send that. Please refresh the page and try again." },
      { status: 403 }
    );
  }

  const { success } = checkRateLimit(getClientIP(request));
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  if (honeypotFilled(body)) {
    return NextResponse.json({ success: true });
  }

  const result = reservationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Please check your name and email address." },
      { status: 400 }
    );
  }

  const { name, email, source } = result.data;

  // Someone reserving twice (a second scan, a lost email) gets the
  // Introduction again, but no second row, alert or CRM note.
  const [existing] = await db
    .select({ id: enquiries.id })
    .from(enquiries)
    .where(
      and(
        eq(enquiries.type, "book"),
        sql`lower(${enquiries.email}) = ${email.toLowerCase()}`
      )
    )
    .limit(1);

  if (!existing) {
    const message = `Reserved a copy of ${BOOK.title} (founding reader)${
      source ? `. Came via: ${source}` : ""
    }`;

    await db.insert(enquiries).values({
      name,
      email,
      type: "book",
      message,
      sourcePage: source || null,
    });

    await sendEmail({
      to: internalRecipients(),
      replyTo: email,
      subject: `[ADI] Book reserved: ${name}`,
      react: EnquiryNotification({
        name,
        email,
        type: "book reservation",
        message,
        timestamp: new Date().toISOString(),
      }),
    });

    await forwardToGHL({ name, email, source: "book-reservation", message });
  }

  await sendEmail({
    to: email,
    subject: `Your copy of ${BOOK.title} is reserved`,
    react: BookReservationConfirmation({ name }),
  });

  return NextResponse.json({ success: true });
}
