import type { Metadata } from "next";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  ShieldCheck,
  Users,
  BookOpen,
  Footprints,
  MessageSquareHeart,
  Train,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EventRegistrationForm } from "@/components/forms/event-registration-form";
import { EVENT, eventPath, formatGBP } from "@/lib/event-config";

export const metadata: Metadata = {
  title: `${EVENT.name} — ${EVENT.tagline}`,
  description: `${EVENT.dateLong}, ${EVENT.venue.name}, ${EVENT.venue.town}. One day to understand what is really happening, say it out loud with people who get it, and leave with a plan and a community. ${EVENT.seats} seats.`,
  openGraph: {
    title: `${EVENT.name} — ${EVENT.tagline}`,
    description: `${EVENT.dateShort} · ${EVENT.venue.town} · ${EVENT.seats} seats · Early bird ${formatGBP(EVENT.pricing.earlyBird)}`,
    images: [{ url: `/events/${EVENT.slug}-og.jpg`, width: 1200, height: 630 }],
    type: "website",
  },
};

const situations = [
  {
    title: "At work",
    body: "The only one in the room. The extra effort nobody names. The calm face over the exhaustion. The appraisal where HR suddenly “sits in”. Everyone says you are doing brilliantly, and you have never felt more on your own.",
  },
  {
    title: "With friends",
    body: "The people who love you but do not quite get it. The conversations you have stopped starting because explaining is more tiring than carrying it. You have become very good at “I’m fine”.",
  },
  {
    title: "Everywhere",
    body: "The first. The only. The one who has to represent. The one who learned early to adapt, to shrink, to be twice as good — and who now feels a little numb, and is not sure when that started.",
  },
];

const takeaways = [
  {
    icon: BookOpen,
    title: "The playbook, named plainly",
    body: "The patterns that happen to Black professionals at work — the sudden “come straight to my office”, the restructure, the performance plan out of nowhere, the slow walk to the door. Once you can see the pattern, it stops being about you.",
  },
  {
    icon: Footprints,
    title: "What to do at each stage",
    body: "Practical moves: what to write down, who to tell, when to get advice, how to leave on your own terms if it comes to that. Putting your seatbelt on does not mean you will crash.",
  },
  {
    icon: Users,
    title: "A room that gets it",
    body: `${EVENT.seats - 1} other people who have been there, or are there now. No code-switching, no explaining the basics. And a way to stay in contact after the day.`,
  },
  ...(EVENT.offer.oneToOneFollowUp
    ? [
        {
          icon: MessageSquareHeart,
          title: "A 30-minute 1:1 with Pam or Marcia",
          body: "After the event, a private conversation about your situation with one of the hosts — both experienced coaches to Black professionals and leaders. Included in your ticket.",
        },
      ]
    : []),
];

const forYouIf = [
  "You are a Black professional, manager or leader in the UK and you have felt, at least once, that nobody around you would understand",
  "You are doing well on paper and exhausted underneath",
  "Something at work has shifted and you cannot quite name it yet",
  "You are fine today, and you would rather build your support network before you need it",
  "You have been through it and want to help someone who is in it now",
];

const faqs = [
  {
    q: "Do I have to stand up and share?",
    a: "No. You can listen all day if you want to. Nobody is put on the spot.",
  },
  {
    q: "Is this a day of complaining?",
    a: "No. It is a day of understanding what is happening, what to do about it, and who has your back. You will leave clearer and stronger, not heavier.",
  },
  {
    q: "I am not a member of ADI — can I come?",
    a: "Yes. This day is for any Black professional. ADI members attend free; guests pay for their ticket, which includes lunch.",
  },
  {
    q: "Is it only about work?",
    a: "Work is usually where it shows up first, but this is about you as a person. What you learn applies everywhere.",
  },
  {
    q: "What if I reserve and then cannot come?",
    a: "Reserving is free and commits you to nothing. If you have bought a ticket and cannot come, tell us and we will transfer it to the next gathering.",
  },
];

function TicketButton({
  href,
  children,
  variant = "red",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "red" | "green" | "outline";
}) {
  const styles = {
    red: "bg-adi-red text-white hover:bg-adi-red/90",
    green: "bg-adi-green text-white hover:bg-adi-green/90",
    outline:
      "border border-white/30 text-white hover:bg-white/10",
  }[variant];
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-md px-8 text-sm font-semibold transition-colors ${styles}`}
    >
      {children}
    </a>
  );
}

export default function YouAreNotAlonePage() {
  const earlyBird = formatGBP(EVENT.pricing.earlyBird);
  const standard = formatGBP(EVENT.pricing.standard);

  return (
    <>
      {/* Hero */}
      <Section variant="dark" className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
                {EVENT.tagline}
              </p>
              <Heading as="h1" className="mt-4 text-5xl md:text-6xl lg:text-7xl">
                You Are Not Alone.
              </Heading>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/80">
                One day to understand what is really happening, say it out loud
                with people who get it, and leave with a plan and a community.
              </p>
              <div className="mt-8 flex flex-col gap-3 text-white/80 sm:flex-row sm:flex-wrap sm:gap-x-8">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-adi-green" />
                  {EVENT.dateLong}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-adi-green" />
                  {EVENT.time}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-adi-green" />
                  {EVENT.venue.name}, {EVENT.venue.town}
                </span>
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <TicketButton href="#reserve">Reserve my seat — free</TicketButton>
                <TicketButton href="#tickets" variant="outline">
                  Early bird {earlyBird} · {EVENT.seats} seats
                </TicketButton>
              </div>
              <p className="mt-6 text-sm text-white/60">
                Only {EVENT.seats} seats. Early bird ends{" "}
                {EVENT.pricing.earlyBirdUntilLabel} or when the first{" "}
                {EVENT.pricing.earlyBirdSeats} go.
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <Image
                src={`/events/${EVENT.slug}-hero.jpg`}
                alt="A woman sitting alone on a late-evening train, looking out of the window"
                width={928}
                height={1152}
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="h-auto w-full rounded-lg object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-lg"
                style={{ background: "linear-gradient(90deg,#C8102E 50%,#006B3F 50%)" }}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* The problem, by situation */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2">You know the feeling.</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              It shows up in different places. It is the same thing.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {situations.map((s) => (
              <div
                key={s.title}
                className="rounded-xl border border-border bg-card p-7"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-adi-red">
                  {s.title}
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-xl leading-relaxed">
              It is not in your head. It is not because you did something
              wrong. And it is not happening only to you. There is a pattern to
              it &mdash; and once you can see the pattern, you can do something
              about it.
            </p>
          </div>
        </Container>
      </Section>

      {/* What you leave with */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2">What you leave with</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              Not inspiration. Things you can use on Monday.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
            {takeaways.map((t) => (
              <div
                key={t.title}
                className="flex gap-4 rounded-xl border border-border bg-card p-6"
              >
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-adi-green/10">
                  <t.icon className="h-6 w-6 text-adi-green" />
                </div>
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* For you if */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <Heading as="h2">This day is for you if&hellip;</Heading>
            </div>
            <ul className="mt-10 space-y-4">
              {forYouIf.map((item) => (
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

      {/* Hosts */}
      <Section variant="dark">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2">Your hosts</Heading>
            <p className="mt-4 text-lg text-white/70">
              Two coaches who have spent years in the room with Black
              professionals at exactly this point &mdash; and have been there
              themselves.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
            {EVENT.hosts.map((h) => (
              <div
                key={h.name}
                className="rounded-xl border border-white/10 bg-white/5 p-7"
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  {h.name}
                </h3>
                <p className="mt-1 text-sm text-adi-green">{h.role}</p>
                <p className="mt-4 leading-relaxed text-white/75">{h.bio}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tickets */}
      <Section id="tickets" variant="offwhite">
        <Container>
          <div className="text-center">
            <Heading as="h2">Tickets</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              {EVENT.seats} seats. Lunch and refreshments included.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="rounded-xl border-2 border-adi-red bg-card p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-adi-red">
                Early bird
              </p>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold">{earlyBird}</span>
                <span className="text-lg text-muted-foreground line-through">
                  {standard}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                First {EVENT.pricing.earlyBirdSeats} seats, or until{" "}
                {EVENT.pricing.earlyBirdUntilLabel}. Less than the lunch costs.
              </p>
              <a
                href="#reserve"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-red px-6 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
              >
                Reserve, then pay {earlyBird}
              </a>
            </div>
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Standard
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold">{standard}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                After the early-bird seats are gone.
              </p>
              <a
                href={EVENT.tickets.standardUrl}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md border border-border px-6 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Buy standard ticket
              </a>
            </div>
            <div className="rounded-xl border border-adi-green bg-card p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-adi-green">
                ADI members
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold">Free</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Reserve below and tick the member box. We will confirm your
                place.
              </p>
              <a
                href="#reserve"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-green px-6 text-sm font-semibold text-white transition-colors hover:bg-adi-green/90"
              >
                Reserve free
              </a>
            </div>
          </div>
          {EVENT.offer.moneyBackGuarantee ? (
            <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-lg border border-adi-green/30 bg-adi-green/5 p-4 text-sm">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-adi-green" />
              <p className="text-muted-foreground">
                <strong className="text-foreground">Our promise:</strong> if
                by lunchtime you feel this day is not for you, tell us and we
                will refund your ticket in full. No questions.
              </p>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Reserve form */}
      <Section id="reserve">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <Heading as="h2">Reserve your seat</Heading>
              <p className="mt-4 text-muted-foreground">
                Free, 20 seconds. Guests can then secure the early-bird ticket;
                members are confirmed by the team.
              </p>
            </div>
            <div className="mt-10">
              <EventRegistrationForm
                event={`${EVENT.name} — ${EVENT.dateShort}`}
                thankYouPath={eventPath("/thank-you")}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Venue */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Heading as="h2">Getting there</Heading>
            <p className="mt-6 text-lg">
              {EVENT.venue.name}
              <br />
              <span className="text-muted-foreground">{EVENT.venue.address}</span>
            </p>
            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left text-sm text-muted-foreground">
              {EVENT.venue.travel.map((t, i) => {
                const Icon = i === 0 ? Train : i === 1 ? Car : UtensilsCrossed;
                return (
                  <li key={t} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-adi-green" />
                    <span>{t}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <Heading as="h2">Questions</Heading>
            </div>
            <dl className="mt-10 space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 text-center">
              <TicketButton href="#reserve">Reserve my seat — free</TicketButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
