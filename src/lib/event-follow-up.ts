import { createHmac, timingSafeEqual } from "node:crypto";
import { EVENT } from "@/lib/event-config";

/**
 * Reserve -> pay follow-up sequence.
 *
 * A guest reserves a seat for free, gets one confirmation email with the
 * early-bird payment button, and (until this existed) never heard from us
 * again. These are the nudges that follow, sent by /api/cron/event-follow-up.
 *
 * Rules:
 *  - members never enter the sequence (their seat is free)
 *  - anyone with paid_at set drops out immediately
 *  - one email per person per cron run, in order, never skipping ahead
 *  - everything stops after the event, or on unsubscribe
 */

export type FollowUpStage = 1 | 2 | 3 | 4;

export const STAGE_SUBJECTS: Record<FollowUpStage, string> = {
  1: "Your seat is still held — here is the link",
  2: `Early bird closes ${EVENT.pricing.earlyBirdUntilLabel}`,
  3: `Last day at ${money(EVENT.pricing.earlyBird)} — it is ${money(EVENT.pricing.standard)} tomorrow`,
  4: `Still a seat for you on ${EVENT.dateShort}`,
};

function money(n: number): string {
  return `£${n.toFixed(2)}`;
}

const HOUR = 60 * 60 * 1000;

/**
 * Which email (if any) this reservation is due, given how long ago they
 * reserved and how close the early-bird deadline is.
 *
 * Stage 1 lands the morning after they reserve. Stage 2 and 3 are pinned to
 * the early-bird deadline rather than to their signup date, so nobody gets
 * "last day" after the price has already changed.
 */
export function dueStage(input: {
  createdAt: Date;
  followUpStage: number;
  followUpLastAt: Date | null;
  now?: Date;
}): FollowUpStage | null {
  const now = input.now ?? new Date();
  const sent = input.followUpStage;
  if (sent >= 4) return null;

  // Never two emails in the same 18 hours, whatever the stage maths says.
  if (input.followUpLastAt && now.getTime() - input.followUpLastAt.getTime() < 18 * HOUR) {
    return null;
  }

  const eventStart = new Date(EVENT.startsAt).getTime();
  if (now.getTime() >= eventStart) return null;

  const ebEnd = new Date(EVENT.pricing.earlyBirdUntil).getTime();
  const hoursSinceReserved = (now.getTime() - input.createdAt.getTime()) / HOUR;
  const hoursToEarlyBirdEnd = (ebEnd - now.getTime()) / HOUR;
  const earlyBirdOpen = hoursToEarlyBirdEnd > 0;

  // Give everyone at least one night before the first nudge.
  if (hoursSinceReserved < 18) return null;

  if (sent < 1) return 1;

  if (earlyBirdOpen) {
    // "closes Sunday" — once we are inside the last 4 days
    if (sent < 2 && hoursToEarlyBirdEnd <= 96) return 2;
    // "last day" — final 30 hours
    if (sent < 3 && hoursToEarlyBirdEnd <= 30) return 3;
    return null;
  }

  // Early bird has gone. One last, softer note that a seat is still theirs.
  if (sent < 4) return 4;
  return null;
}

/** Unsubscribe token: HMAC of the reservation id, so links are not guessable. */
export function stopToken(id: string): string {
  const secret = process.env.BETTER_AUTH_SECRET ?? "";
  return createHmac("sha256", secret).update(`stop:${id}`).digest("hex").slice(0, 32);
}

export function verifyStopToken(id: string, token: string): boolean {
  const expected = Buffer.from(stopToken(id));
  const got = Buffer.from(token ?? "");
  return expected.length === got.length && timingSafeEqual(expected, got);
}

export function stopUrl(id: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://africandevelopmentinstitute.com";
  return `${base}/api/events/stop?id=${id}&t=${stopToken(id)}`;
}
