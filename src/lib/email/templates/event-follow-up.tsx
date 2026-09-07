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
import { EVENT, formatGBP } from "@/lib/event-config";
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
}: {
  name: string;
  stage: FollowUpStage;
  stopHref: string;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const early = formatGBP(EVENT.pricing.earlyBird);
  const standard = formatGBP(EVENT.pricing.standard);

  const body: Record<FollowUpStage, { lead: string; paras: string[]; cta: string }> = {
    1: {
      lead: `${firstName}, your seat is still held.`,
      paras: [
        `You reserved a place at ${EVENT.name} on ${EVENT.dateLong} — one day in ${EVENT.venue.town} with ${EVENT.seats} other Black professionals who know exactly what you have been carrying.`,
        `Reserving was free; securing it is ${early} while the early-bird places last (${standard} after). Lunch is included, and so is a 30-minute one-to-one with Pam or Marcia afterwards.`,
      ],
      cta: `Secure my seat — ${early}`,
    },
    2: {
      lead: `${firstName}, early bird closes ${EVENT.pricing.earlyBirdUntilLabel}.`,
      paras: [
        `Your seat at ${EVENT.name} is still held, and the ${early} early-bird price runs until ${EVENT.pricing.earlyBirdUntilLabel}. After that it is ${standard}.`,
        `It is a small room by design — ${EVENT.seats} people, ${EVENT.dateLong}, ${EVENT.venue.name} in ${EVENT.venue.town}. If something is holding you back, reply to this email and tell us. Pam or Marcia will answer you personally.`,
      ],
      cta: `Secure my seat — ${early}`,
    },
    3: {
      lead: `${firstName}, today is the last day at ${early}.`,
      paras: [
        `The early-bird price for ${EVENT.name} ends tonight. From tomorrow the ticket is ${standard}.`,
        `Nothing else changes — same day, same room, same ${EVENT.seats} seats. If you have been meaning to do this, today is the cheapest it will be.`,
      ],
      cta: `Secure my seat — ${early}`,
    },
    4: {
      lead: `${firstName}, there is still a seat for you.`,
      paras: [
        `The early-bird window has closed, but ${EVENT.name} is still on — ${EVENT.dateLong}, ${EVENT.venue.name}, ${EVENT.venue.town} — and your reservation is still on our list.`,
        `If you would like to keep it, just reply to this email and Pam or Marcia will sort the details with you directly. If the timing is wrong, reply and tell us that too; we would rather know.`,
      ],
      cta: `Secure my seat — ${standard}`,
    },
  };

  const content = body[stage];
  const showButton = stage !== 4 && EVENT.tickets.earlyBirdReady;

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

            {showButton ? (
              <Button
                href={EVENT.tickets.earlyBirdUrl}
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
