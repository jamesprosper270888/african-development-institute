import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";
import { EVENT, formatGBP } from "@/lib/event-config";

export function EventReserveConfirmation({
  name,
  isMember,
}: {
  name: string;
  isMember: boolean;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#FAF8F5" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 700 }}>
            {firstName}, you are not alone.
          </Text>
          <Hr />
          <Section>
            <Text>
              Your seat is reserved for <strong>{EVENT.name}</strong> —{" "}
              {EVENT.dateLong}, {EVENT.time}, {EVENT.venue.name},{" "}
              {EVENT.venue.town}.
            </Text>

            {isMember ? (
              <Text>
                As an ADI member your place is free. We will confirm your
                membership and send the final details a week before the day.
                Reply to this email if anything changes.
              </Text>
            ) : (
              <>
                <Text>
                  To make it yours, secure the early-bird ticket — only{" "}
                  {EVENT.pricing.earlyBirdSeats} are available at{" "}
                  {formatGBP(EVENT.pricing.earlyBird)} (standard price{" "}
                  {formatGBP(EVENT.pricing.standard)}), lunch included.
                </Text>
                {EVENT.tickets.earlyBirdReady ? (
                <Button
                  href={EVENT.tickets.earlyBirdUrl}
                  style={{
                    backgroundColor: "#C8102E",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Secure my seat — {formatGBP(EVENT.pricing.earlyBird)}
                </Button>
                ) : (
                  <Text>
                    We will send your payment link separately within 24 hours.
                  </Text>
                )}
                <Text style={{ fontSize: 13, color: "#6b6560" }}>
                  We hold reservations for 48 hours. If you have questions,
                  just reply — Pam or Marcia will answer personally.
                </Text>
              </>
            )}

            <Hr />
            <Text style={{ fontSize: 14 }}>
              <strong>What you will leave with</strong>
              <br />• The playbook — the patterns that happen to Black
              professionals at work, named plainly
              <br />• What to do at each stage, before it becomes a crisis
              <br />• A room of people who get it, and a way to stay in touch
              {EVENT.offer.oneToOneFollowUp ? (
                <>
                  <br />• A 30-minute 1:1 with Pam or Marcia after the event
                </>
              ) : null}
            </Text>
            <Hr />
            <Text style={{ fontSize: 12, color: "#6b6560" }}>
              African Development Institute
              <br />
              {EVENT.venue.name}, {EVENT.venue.address}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
