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
  currentTicketPrice,
  formatGBP,
  isEarlyBirdOpen,
  pairTicketUrl,
  ticketUrl,
} from "@/lib/event-config";

export function EventReserveConfirmation({
  name,
  isMember,
  refId,
  now = new Date(),
}: {
  name: string;
  isMember: boolean;
  /** The reservation, so the pay page marks this seat paid, not a new one. */
  refId?: string;
  /** Send time: decides last-chance or standard wording, price and link. */
  now?: Date;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const earlyOpen = isEarlyBirdOpen(now);
  const price = formatGBP(currentTicketPrice(now));
  const payUrl = ticketUrl(now, refId);
  // Pairs and single seats are separate GHL products with their own stock
  // caps, so the pair button and the single link must each reach their own.
  const pairUrl = pairTicketUrl(now);
  const pairOpen = pairUrl !== null;

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
                  {earlyOpen ? (
                    <>
                      To make it yours, secure the last-chance ticket:{" "}
                      {formatGBP(EVENT.pricing.earlyBird)}, half the{" "}
                      {formatGBP(EVENT.pricing.standard)} standard price, with
                      only {EVENT.pricing.earlyBirdSeats} seats left and lunch
                      included.
                    </>
                  ) : pairOpen ? (
                    <>
                      To make it yours, secure your ticket: {price}, lunch
                      included. It brings two of you, so bring someone who gets
                      it and it is {EVENT.pricing.pairPerSeatLabel}.
                    </>
                  ) : (
                    <>
                      To make it yours, secure your ticket: {price}, lunch
                      included.
                    </>
                  )}
                </Text>
                {payUrl ? (
                <>
                <Button
                  href={pairUrl ?? payUrl}
                  style={{
                    backgroundColor: "#C8102E",
                    color: "#ffffff",
                    padding: "12px 24px",
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  {pairOpen ? `Secure our seats, ${price}` : `Secure my seat, ${price}`}
                </Button>
                {pairUrl ? (
                  <Text style={{ fontSize: 14 }}>
                    Coming on your own?{" "}
                    <Link href={payUrl} style={{ color: "#C8102E" }}>
                      Secure one seat, {price}
                    </Link>
                  </Text>
                ) : null}
                </>
                ) : (
                  <Text>
                    We will send your payment link separately within 24 hours.
                  </Text>
                )}
                <Text style={{ fontSize: 13, color: "#6b6560" }}>
                  We hold reservations for 48 hours. If you have questions,
                  just reply and Pam or Marcia will answer personally.
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
