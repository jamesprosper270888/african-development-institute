import type { Metadata } from "next";
import {
  Calendar,
  Clock,
  MapPin,
  Compass,
  MessageCircle,
  Target,
  Users,
  Check,
  UtensilsCrossed,
} from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";

const TICKET_URL =
  "https://pay.africandevelopmentinstitute.com/journey-within-ticket";

export const metadata: Metadata = {
  title: "The Journey Within — ADI Event",
  description:
    "A day of real stories, reflection and authentic conversation with ADI members. Saturday 26 September 2026, Oatlands Park Hotel, Weybridge. ADI members free, guests £49.99.",
};

const pillars = [
  {
    icon: Compass,
    title: "Look Inwards",
    description:
      "Reflect on your life journey, the beliefs that shape you and the possibilities ahead.",
  },
  {
    icon: MessageCircle,
    title: "Real Stories",
    description:
      "Hear honest and inspiring stories from ADI members and the lessons that have shaped them.",
  },
  {
    icon: Target,
    title: "Own Your Future",
    description:
      "Discover how authentic identity, personal agency and economic agency create greater opportunities and lasting impact.",
  },
  {
    icon: Users,
    title: "Connect & Grow",
    description:
      "Engage in meaningful conversations, build new connections and leave inspired to live and lead with purpose.",
  },
];

const whoShouldAttend = [
  "ADI members who want to reflect on and celebrate their journey",
  "Professionals and aspiring leaders seeking clarity, confidence and purpose",
  "Anyone curious about the ADI movement and its philosophy of authentic leadership and personal agency",
  "Those committed to creating opportunities, strengthening their economic agency and building lasting legacy",
];

export default function TheJourneyWithinPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
              An ADI Event
            </p>
            <Heading as="h1" className="mt-4">
              The Journey Within
            </Heading>
            <p className="mt-4 text-xl text-white/80">
              Real Stories. Real Growth. Real Change.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 text-white/80 sm:flex-row sm:gap-8">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-adi-green" />
                Saturday 26 September 2026
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-adi-green" />
                10:00am – 4:00pm
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-adi-green" />
                Oatlands Park Hotel, Weybridge
              </span>
            </div>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-adi-green px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-green/90"
              >
                ADI Members — Register Free
              </a>
              <a
                href={TICKET_URL}
                className="inline-flex h-12 items-center justify-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
              >
                Guests — £49.99
              </a>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
              <UtensilsCrossed className="h-4 w-4" />
              Lunch and refreshments included
            </p>
          </div>
        </Container>
      </Section>

      {/* About the day */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2">A Powerful Day of Reflection</Heading>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Join us for a powerful day of reflection, inspiration and
              authentic conversation as ADI members share their personal
              journeys of growth — exploring the inherent value, potential and
              contribution of Black people, and developing the mindset,
              confidence and personal agency needed to shape our own futures,
              create opportunities, exercise greater economic agency, build
              financial independence and contribute meaningfully to our
              families, organisations and communities.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pillars */}
      <Section variant="offwhite">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="inline-flex rounded-lg bg-adi-green/5 p-3">
                  <pillar.icon className="h-6 w-6 text-adi-green" />
                </div>
                <h3 className="mt-4 font-semibold">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who should attend */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <Heading as="h2">Who Should Attend?</Heading>
            </div>
            <ul className="mt-10 space-y-4">
              {whoShouldAttend.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-adi-green text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Tickets */}
      <Section variant="offwhite">
        <Container>
          <div className="text-center">
            <Heading as="h2">Tickets</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              Lunch and refreshments included with every ticket.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl gap-8 md:grid-cols-2">
            <div className="rounded-xl border-2 border-adi-green bg-card p-8 text-center">
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                ADI Members
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">Free</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Register below so we can save your place.
              </p>
              <a
                href="#register"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-green px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-green/90"
              >
                Register Free
              </a>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                Guests
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">£49.99</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Secure card payment. Instant confirmation.
              </p>
              <a
                href={TICKET_URL}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
              >
                Buy Ticket
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Member registration */}
      <Section id="register">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <Heading as="h2">Member Registration</Heading>
              <p className="mt-4 text-muted-foreground">
                ADI members attend free — leave your details and your place is
                saved.
              </p>
            </div>
            <div className="mt-10">
              <EventRegistrationForm event="The Journey Within — 26 September 2026" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Venue */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Heading as="h2">Venue</Heading>
            <p className="mt-6 text-lg text-muted-foreground">
              Oatlands Park Hotel
              <br />
              146 Oatlands Drive, Weybridge KT13 9HB
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
