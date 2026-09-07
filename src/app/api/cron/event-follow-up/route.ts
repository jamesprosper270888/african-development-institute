import { NextResponse } from "next/server";
import { and, eq, gte, isNull, like } from "drizzle-orm";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { sendEmail } from "@/lib/email/resend";
import { EventFollowUp } from "@/lib/email/templates/event-follow-up";
import { EVENT } from "@/lib/event-config";
import { dueStage, stopUrl, STAGE_SUBJECTS } from "@/lib/event-follow-up";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Reservations taken before this date belong to an older event. */
const CAMPAIGN_START = new Date("2026-09-01T00:00:00Z");

/** "tara.ashley.ifill@gmail.com" -> "t***l@gmail.com" */
function mask(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const head = local.slice(0, 1);
  const tail = local.length > 1 ? local.slice(-1) : "";
  return `${head}***${tail}@${domain}`;
}

/**
 * Reserve -> pay follow-up. Runs on a Vercel cron (see vercel.json).
 *
 * Sends at most one email per unpaid guest per run, in stage order. Members,
 * anyone who has paid, and anyone who has unsubscribed are excluded by the
 * query itself, so a bug here cannot email someone who already bought.
 *
 * `?dry=1` reports what it would send without sending or writing anything.
 */
export async function GET(request: Request) {
  // Fail CLOSED. An unset CRON_SECRET used to mean "allow everyone", which put
  // reservers' email addresses behind a public GET (?dry=1 listed them). A cron
  // that refuses to run until it is configured is the safer failure.
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[follow-up] CRON_SECRET not set — refusing to run");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dry = new URL(request.url).searchParams.get("dry") === "1";
  const now = new Date();

  const candidates = await db
    .select({
      id: enquiries.id,
      name: enquiries.name,
      email: enquiries.email,
      createdAt: enquiries.createdAt,
      followUpStage: enquiries.followUpStage,
      followUpLastAt: enquiries.followUpLastAt,
    })
    .from(enquiries)
    .where(
      and(
        eq(enquiries.type, "event"),
        eq(enquiries.isMember, false),
        isNull(enquiries.paidAt),
        isNull(enquiries.unsubscribedAt),
        gte(enquiries.createdAt, CAMPAIGN_START),
        like(enquiries.message, `%${EVENT.name}%`)
      )
    );

  const sent: { email: string; stage: number }[] = [];
  const skipped: { email: string; reason: string }[] = [];

  for (const row of candidates) {
    const stage = dueStage({
      createdAt: new Date(row.createdAt),
      followUpStage: row.followUpStage,
      followUpLastAt: row.followUpLastAt ? new Date(row.followUpLastAt) : null,
      now,
    });

    if (!stage) {
      skipped.push({ email: row.email, reason: `not due (stage ${row.followUpStage})` });
      continue;
    }

    if (dry) {
      sent.push({ email: row.email, stage });
      continue;
    }

    const { success } = await sendEmail({
      to: row.email,
      subject: STAGE_SUBJECTS[stage],
      react: EventFollowUp({
        name: row.name,
        stage,
        stopHref: stopUrl(row.id),
      }),
      replyTo: process.env.REPLY_TO_EMAIL,
    });

    if (!success) {
      skipped.push({ email: row.email, reason: "send failed" });
      continue;
    }

    await db
      .update(enquiries)
      .set({ followUpStage: stage, followUpLastAt: now })
      .where(eq(enquiries.id, row.id));

    sent.push({ email: row.email, stage });
  }

  if (sent.length && !dry) {
    await sendTelegramNotification(
      [
        `📮 <b>ADI follow-up sent (${sent.length})</b>`,
        ...sent.map((s) => `• stage ${s.stage} → ${escapeHtml(s.email)}`),
        ``,
        `${candidates.length} unpaid guest(s) in the sequence.`,
      ].join("\n")
    );
  }

  // Addresses are masked even here: the Telegram ping (a private DM) carries the
  // full address, so nothing needs a readable inbox in an HTTP response body.
  return NextResponse.json({
    ok: true,
    dry,
    candidates: candidates.length,
    sent: sent.map((s) => ({ email: mask(s.email), stage: s.stage })),
    skipped: skipped.map((s) => ({ email: mask(s.email), reason: s.reason })),
  });
}
