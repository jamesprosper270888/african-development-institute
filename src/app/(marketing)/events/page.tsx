import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EVENT, eventPath, formatGBP } from "@/lib/event-config";

export const metadata: Metadata = {
  title: "Events",
  description:
    "ADI gatherings for Black professionals and leaders in the UK — a room where you do not have to explain the basics.",
};

export default function EventsPage() {
  return (
    <>
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h1">Events</Heading>
            <p className="mt-6 text-lg text-white/80">
              Gatherings for Black professionals and leaders &mdash; in person
              and online &mdash; where you do not have to explain the basics.
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
                Early bird {formatGBP(EVENT.pricing.earlyBird)} · ADI members
                free &rarr; Details &amp; reserve
              </p>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
