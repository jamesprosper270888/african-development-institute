import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import {
  EVENT,
  eventPath,
  formatGBP,
  hasEnded,
  isEarlyBirdOpen,
  NEXT_EVENT,
  pairTicketUrl,
} from "@/lib/event-config";

// Same as the event page: the price line flips within a minute of the
// early-bird deadline without a redeploy.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
  description:
    "ADI gatherings for Black professionals and leaders in the UK: a room where you do not have to explain the basics.",
};

export default function EventsPage() {
  // After 26 Sep the card stopped selling a day that has happened. It now
  // points at the YANA II interest list on the event page, with the day
  // itself listed underneath as past.
  if (hasEnded()) return <EventsAfter />;

  const price = isEarlyBirdOpen()
    ? `Last chance ${formatGBP(EVENT.pricing.earlyBird)}`
    : pairTicketUrl()
      ? `${formatGBP(EVENT.pricing.standard)} for two`
      : `Tickets ${formatGBP(EVENT.pricing.standard)}`;

  return (
    <>
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h1">Events</Heading>
            <p className="mt-6 text-lg text-white/80">
              Gatherings for Black professionals and leaders, in person and
              online, where you do not have to explain the basics.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <Link
              href={eventPath()}
              className="block rounded-xl border border-border bg-card p-8 transition-colors hover:border-adi-red"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
                Next gathering · {EVENT.seats} seats
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold">
                {EVENT.name}.
              </h2>
              <p className="mt-2 text-muted-foreground">{EVENT.tagline}</p>
              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-adi-green" />
                  {EVENT.dateShort}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-adi-green" />
                  {EVENT.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-adi-green" />
                  {EVENT.venue.name}, {EVENT.venue.town}
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold text-adi-green">
                {price} · ADI members free &rarr; Details &amp; reserve
              </p>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

function EventsAfter() {
  return (
    <>
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h1">Events</Heading>
            <p className="mt-6 text-lg text-white/80">
              Gatherings for Black professionals and leaders, in person and
              online, where you do not have to explain the basics.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">
            <Link
              href={`${eventPath()}#next`}
              className="block rounded-xl border border-border bg-card p-8 transition-colors hover:border-adi-red"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
                Next gathering · {NEXT_EVENT.whenLabel}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold">
                {NEXT_EVENT.name}.
              </h2>
              <p className="mt-2 text-muted-foreground">
                The date is being set now. Leave your details and you will be
                among the first to hear.
              </p>
              <p className="mt-6 text-sm font-semibold text-adi-green">
                Register your interest &rarr;
              </p>
            </Link>

            <Link
              href={eventPath()}
              className="block rounded-xl border border-border p-6 transition-colors hover:border-adi-red"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Past gathering
              </p>
              <h3 className="mt-2 text-lg font-semibold">{EVENT.name}</h3>
              <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-6">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-adi-green" />
                  {EVENT.dateShort}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-adi-green" />
                  {EVENT.venue.name}, {EVENT.venue.town}
                </span>
              </div>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
