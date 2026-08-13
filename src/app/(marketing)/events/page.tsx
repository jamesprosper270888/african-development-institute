import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming ADI gatherings — days of connection, reflection and growth for Black professionals and leaders in the UK.",
};

export default function EventsPage() {
  return (
    <>
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h1">Events</Heading>
            <p className="mt-6 text-lg text-white/80">
              Regular gatherings — online and in person — for connection,
              celebration and collective reflection.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <Link
              href="/events/the-journey-within"
              className="block rounded-xl border border-border bg-card p-8 transition-colors hover:border-adi-green"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
                Next Event
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold">
                The Journey Within
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real Stories. Real Growth. Real Change.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-adi-green" />
                  Sat 26 September 2026
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-adi-green" />
                  10:00am – 4:00pm
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-adi-green" />
                  Oatlands Park Hotel, Weybridge
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold text-adi-green">
                ADI members free · Guests £49.99 → Details &amp; tickets
              </p>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
