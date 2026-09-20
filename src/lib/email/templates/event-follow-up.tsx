import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Button,
  Link,
} from "@react-email/components";
import {
  EVENT,
  formatGBP,
  isEarlyBirdOpen,
  pairTicketUrl,
  standardTicketUrl,
  ticketUrl,
} from "@/lib/event-config";
import type { FollowUpStage } from "@/lib/event-follow-up";

const RED = "#C8102E";
const MUTED = "#6b6560";

/**
 * The reserve -> pay nudges. Written to sound like Pam and Marcia, because
 * that is who these people think they are hearing from — not a funnel.
 * Warm, short, one thing to do, easy to stop.
 */
export function EventFollowUp({
  name,
  stage,
  stopHref,
  now = new Date(),
}: {
  name: string;
  stage: FollowUpStage;
  stopHref: string;
  /** Send time: stage 1 can go out either side of the early-bird deadline. */
  now?: Date;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const early = formatGBP(EVENT.pricing.earlyBird);
  const standard = formatGBP(EVENT.pricing.standard);
  const earlyOpen = isEarlyBirdOpen(now);
  // Stage 4 is the only one that sends after the deadline, so in practice this
  // is true exactly when stage 4 goes out. Computed at send time, not build
  // time, so Monday's email carries the offer without a redeploy.
  const pairUrl = pairTicketUrl(now);
  const pairOpen = pairUrl !== null;
  // Only stage 4 sells the pair. Pairs and single seats are separate GHL
  // products with their own stock caps, so each button must reach its own.
  const pairHref = stage === 4 ? pairUrl : null;

  // Stages 2 and 3 only send before the deadline; 4 only after it; 1 either side.
  const payUrl =
    stage === 1
      ? ticketUrl(now)
      : stage === 4
        ? standardTicketUrl()
        : EVENT.tickets.earlyBirdReady
          ? EVENT.tickets.earlyBirdUrl
          : null;

  const body: Record<FollowUpStage, { lead: string; paras: string[]; cta: string }> = {
    1: {
      lead: `${firstName}, your seat is still held.`,
      paras: [
        `You reserved a place at ${EVENT.name} on ${EVENT.dateLong}, one day in ${EVENT.venue.town} with ${EVENT.seats} other Black professionals who know exactly what you have been carrying.`,
        earlyOpen
          ? `Reserving was free; securing it is ${early} until ${EVENT.pricing.earlyBirdUntilLabel}, half the ${standard} standard ticket. Lunch is included, and so is a 30-minute one-to-one with Pam or Marcia afterwards.`
          : `Reserving was free; securing it is ${standard}. Lunch is included, and so is a 30-minute one-to-one with Pam or Marcia afterwards.`,
      ],
      cta: `Secure my seat, ${earlyOpen ? early : standard}`,
    },
    2: {
      lead: `${firstName}, the last-chance price closes ${EVENT.pricing.earlyBirdUntilLabel}.`,
      paras: [
        `Your seat at ${EVENT.name} is still held, and the ${early} last-chance price runs until ${EVENT.pricing.earlyBirdUntilLabel}. That is half the ${standard} standard ticket.`,
        `It is a small room by design: ${EVENT.seats} people, ${EVENT.dateLong}, ${EVENT.venue.name} in ${EVENT.venue.town}. If something is holding you back, reply to this email and tell us. Pam or Marcia will answer you personally.`,
      ],
      cta: `Secure my seat, ${early}`,
    },
    3: {
      lead: `${firstName}, today is the last day to book.`,
      paras: [
        `Booking for ${EVENT.name} closes tonight, because the day itself is tomorrow: ${EVENT.dateLong}, ${EVENT.venue.name} in ${EVENT.venue.town}.`,
        `Nothing else changes, same room, same ${EVENT.seats} seats, lunch included, and it is still ${early}. If you have been meaning to do this, today is when it gets decided.`,
      ],
      cta: `Secure my seat, ${early}`,
    },
    4: {
      lead: pairOpen
        ? `${firstName}, there is still a seat for you, and one for someone else.`
        : `${firstName}, there is still a seat for you.`,
      paras: [
        `Booking has closed, but ${EVENT.name} is still on: ${EVENT.dateLong}, ${EVENT.venue.name}, ${EVENT.venue.town}. Your reservation is still on our list.`,
        ...(pairOpen
          ? [
              `A ticket is ${standard} now, and it brings two of you. Bring someone who gets it and that is ${EVENT.pricing.pairPerSeatLabel}, the same as the early bird. The hardest part of a day like this is walking in on your own, so bring the person you would have told about it afterwards.`,
            ]
          : []),
        payUrl
          ? `If you would like to keep it, you can secure it below${pairOpen ? "" : ` for ${standard}`}, or reply to this email and Pam or Marcia will sort the details with you directly. If the timing is wrong, reply and tell us that too; we would rather know.`
          : `If you would like to keep it, just reply to this email and Pam or Marcia will sort the details with you directly. If the timing is wrong, reply and tell us that too; we would rather know.`,
      ],
      cta: pairOpen
        ? `Secure both seats, ${standard}`
        : `Secure my seat, ${standard}`,
    },
    // Stage 5, 20 Sep 2026: the half-price last chance. This is the only
    // email in the sequence that carries genuinely new information rather
    // than a nudge, so it says plainly what changed and why, and it does not
    // pretend the seat was ever going to sell itself at the standard price.
    5: {
      lead: `${firstName}, we have put the price back to ${early}.`,
      paras: [
        `Your seat at ${EVENT.name} is still on our list, and the ticket is ${early} again until ${EVENT.pricing.earlyBirdUntilLabel}. That is half the ${standard} standard price, and the same ${early} everyone else in the room has paid, so nobody there paid less than you will.`,
        `${EVENT.dateLong}, ${EVENT.venue.name} in ${EVENT.venue.town}. Lunch and refreshments are included, and so is a 30-minute one-to-one with Pam or Marcia afterwards. It is a small room, ${EVENT.seats} seats, and this is the last week to take one.`,
        `If the timing is wrong, or something else is holding you back, reply to this email and say so. Pam or Marcia will answer you personally, and we would honestly rather know than keep writing to you.`,
      ],
      cta: `Secure my seat, ${early}`,
    },
  };

  const content = body[stage];

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#FAF8F5" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 700 }}>{content.lead}</Text>
          <Hr />
          <Section>
            {content.paras.map((p, i) => (
              <Text key={i}>{p}</Text>
            ))}

            {payUrl ? (
              <Button
                href={pairHref ?? payUrl}
                style={{
                  backgroundColor: RED,
                  color: "#ffffff",
                  padding: "12px 24px",
                  borderRadius: 6,
                  fontWeight: 600,
                }}
              >
                {content.cta}
              </Button>
            ) : null}
            {payUrl && pairHref ? (
              <Text style={{ fontSize: 14 }}>
                Coming on your own?{" "}
                <Link href={payUrl} style={{ color: RED }}>
                  Secure one seat, {standard}
                </Link>
              </Text>
            ) : null}

            <Hr />
            <Text style={{ fontSize: 14 }}>
              <strong>{EVENT.dateLong}</strong>
              <br />
              {EVENT.time} · {EVENT.venue.name}, {EVENT.venue.address}
              <br />
              Lunch and refreshments included.
            </Text>
            <Text style={{ fontSize: 13, color: MUTED }}>
              Hosted by Pam Rowe and Marcia Daigo. Reply to this email with any
              question — it reaches them, not a helpdesk.
            </Text>

            <Hr />
            <Text style={{ fontSize: 12, color: MUTED }}>
              You are getting this because you reserved a seat at{" "}
              {EVENT.name}.{" "}
              <Link href={stopHref} style={{ color: MUTED }}>
                Stop these reminders
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
