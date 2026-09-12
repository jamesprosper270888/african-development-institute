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
import {
  EVENT,
  eventPath,
  formatGBP,
  isEarlyBirdOpen,
  pairTicketUrl,
  standardTicketUrl,
} from "@/lib/event-config";

// Re-rendered at most a minute after the early-bird deadline passes, so the
// page switches to the standard price on its own, with no redeploy.
export const revalidate = 60;

export function generateMetadata(): Metadata {
  const price = isEarlyBirdOpen()
    ? `Early bird ${formatGBP(EVENT.pricing.earlyBird)}`
    : `Tickets ${formatGBP(EVENT.pricing.standard)}`;
  return {
    title: `${EVENT.name}: ${EVENT.tagline}`,
    description: `${EVENT.dateLong}, ${EVENT.venue.name}, ${EVENT.venue.town}. One day to understand what is really happening, say it out loud with people who get it, and leave with a plan and a community. ${EVENT.seats} seats.`,
    openGraph: {
      title: `${EVENT.name}: ${EVENT.tagline}`,
      description: `${EVENT.dateShort} · ${EVENT.venue.town} · ${EVENT.seats} seats · ${price}`,
      images: [{ url: `/events/${EVENT.slug}-og.jpg`, width: 1200, height: 630 }],
      type: "website",
    },
  };
}

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
      className={`inline-flex h-12 items-center justify-center rounded-md px-8 text-base font-semibold transition-colors ${styles}`}
    >
      {children}
    </a>
  );
}

export default function YouAreNotAlonePage() {
  const earlyBird = formatGBP(EVENT.pricing.earlyBird);
  const standard = formatGBP(EVENT.pricing.standard);
  // Checked at every regeneration (revalidate above): once the deadline has
  // passed, every early-bird mention goes and the standard ticket is the offer.
  const earlyOpen = isEarlyBirdOpen();
  const standardUrl = standardTicketUrl();
  // Null until the early bird closes, so this whole offer stays invisible
  // until Monday without anyone having to deploy at midnight.
  const pairUrl = pairTicketUrl();
  const pairOpen = pairUrl !== null;
  // The "can I bring someone" question only exists once the offer does, and it
  // is the first thing anyone will ask, so it goes at the top rather than
  // buried under the standing questions.
  const pageFaqs = pairOpen
    ? [
        {
          q: "Can I bring someone with me?",
          a: `Yes, and it costs nothing extra. One ticket at ${standard} brings two of you, which works out at ${EVENT.pricing.pairPerSeatLabel}. Book as you normally would, then reply to your confirmation email with their name so we can set a place for them.`,
        },
        ...faqs,
      ]
    : faqs;

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
                <TicketButton href="#reserve">Reserve my seat, free</TicketButton>
                <TicketButton href="#tickets" variant="outline">
                  {earlyOpen
                    ? `Early bird ${earlyBird}`
                    : pairOpen
                      ? `Two seats ${standard}`
                      : `Tickets ${standard}`}{" "}
                  · {EVENT.seats} seats
                </TicketButton>
              </div>
              <p className="mt-6 text-sm text-white/60">
                {earlyOpen ? (
                  <>
                    Only {EVENT.seats} seats. Early bird ends{" "}
                    {EVENT.pricing.earlyBirdUntilLabel} or when the first{" "}
                    {EVENT.pricing.earlyBirdSeats} go.
                  </>
                ) : pairOpen ? (
                  <>
                    Only {EVENT.seats} seats. Bring someone who gets it: two of
                    you come for {standard},{" "}
                    {EVENT.pricing.pairPerSeatLabel}. Reserving is free.
                  </>
                ) : (
                  <>Only {EVENT.seats} seats. Lunch included, and reserving is free.</>
                )}
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
            {/* The one CTA between the hero and the tickets. Five sections run
                without anything to click, and this is the moment someone has
                just recognised themselves in the list above. */}
            <div className="mt-10 text-center">
              <TicketButton href="#reserve">Reserve my seat, free</TicketButton>
            </div>
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
                className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-7"
              >
                <div className="flex items-center gap-5">
                  <Image
                    src={h.photo}
                    alt={h.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-adi-green/60"
                  />
                  <div>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                      {h.name}
                    </h3>
                    <p className="mt-1 text-sm text-adi-green">{h.role}</p>
                  </div>
                </div>
                <p className="mt-5 leading-relaxed text-white/75">{h.bio}</p>
                {EVENT.offer.showTestimonials ? (
                <figure className="mt-6 border-l-2 border-adi-red pl-4">
                  <blockquote className="text-sm leading-relaxed text-white/80">
                    &ldquo;{h.testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-2 text-xs text-white/55">
                    {h.testimonial.name}, {h.testimonial.title}
                  </figcaption>
                </figure>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* What the day looks like */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2">What the day looks like</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              Not a conference. A room of twenty, round tables, two hosts who
              ask the real questions. From a previous ADI gathering.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-3 md:gap-5">
            {EVENT.gallery.map((g) => (
              <Image
                key={g.src}
                src={g.src}
                alt={g.alt}
                width={g.w}
                height={g.h}
                sizes="(min-width: 768px) 300px, 30vw"
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
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
          <div
            className={`mx-auto mt-12 grid gap-6 ${earlyOpen || pairOpen ? "max-w-4xl md:grid-cols-3" : "max-w-3xl md:grid-cols-2"}`}
          >
            {earlyOpen ? (
              <>
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
                    className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-red px-6 text-base font-semibold text-white transition-colors hover:bg-adi-red/90"
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
                  {/* Only once the £49.99 GHL link exists (tickets.standardReady). */}
                  {standardUrl ? (
                    <a
                      href={standardUrl}
                      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md border border-border px-6 text-base font-semibold transition-colors hover:bg-muted"
                    >
                      Buy standard ticket
                    </a>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                {pairOpen ? (
                  <div className="rounded-xl border-2 border-adi-red bg-card p-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-adi-red">
                      Bring someone who gets it
                    </p>
                    <div className="mt-4 flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold">{standard}</span>
                      <span className="text-lg text-muted-foreground">
                        for two
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Two seats for the price of one, so{" "}
                      {EVENT.pricing.pairPerSeatLabel}. The hardest part of a
                      day like this is walking in on your own, so bring the
                      person you would have told about it afterwards.
                    </p>
                    <a
                      href="#reserve"
                      className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-red px-6 text-base font-semibold text-white transition-colors hover:bg-adi-red/90"
                    >
                      Reserve, then pay {standard} for two
                    </a>
                  </div>
                ) : null}
                <div
                  className={`rounded-xl bg-card p-8 text-center ${pairOpen ? "border border-border" : "border-2 border-adi-red"}`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.2em] ${pairOpen ? "text-muted-foreground" : "text-adi-red"}`}
                  >
                    {pairOpen ? "Coming on your own" : "Ticket"}
                  </p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{standard}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {pairOpen
                      ? "One seat, the same price. Plenty of people are coming on their own, and you will not be the only one."
                      : "Reserve your seat free, then pay to make it yours. Lunch included."}
                  </p>
                  <a
                    href="#reserve"
                    className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-md px-6 text-base font-semibold transition-colors ${pairOpen ? "border border-border hover:bg-muted" : "bg-adi-red text-white hover:bg-adi-red/90"}`}
                  >
                    Reserve, then pay {standard}
                  </a>
                </div>
              </>
            )}
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
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-green px-6 text-base font-semibold text-white transition-colors hover:bg-adi-green/90"
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
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <Heading as="h2">Reserve your seat</Heading>
              <p className="mt-4 text-lg text-muted-foreground">
                Free, 20 seconds. Guests can then secure{" "}
                {earlyOpen ? "the early-bird ticket" : "their ticket"}; members
                are confirmed by the team.
              </p>
            </div>
            <div className="mt-10">
              <EventRegistrationForm
                event={`${EVENT.name} — ${EVENT.dateShort}`}
                thankYouPath={eventPath("/thank-you")}
                earlyBirdOpen={earlyOpen}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Venue. White on purpose: it sits between two eggshell sections, so
          this is the break that stops the lower half of the page reading as
          one flat block. */}
      <Section variant="white">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Heading as="h2">Getting there</Heading>
            <p className="mt-6 text-lg">
              {EVENT.venue.name}
              <br />
              <span className="text-muted-foreground">{EVENT.venue.address}</span>
            </p>
            {/* Most of this traffic is on a phone, where this opens the Maps
                app straight onto the hotel with directions ready. */}
            <a
              href={EVENT.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border px-6 text-base font-semibold transition-colors hover:bg-muted"
            >
              <MapPin className="h-4 w-4 text-adi-green" />
              Open in Google Maps
            </a>
            <ul className="mx-auto mt-8 max-w-lg space-y-4 text-left text-base text-muted-foreground">
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
              <Heading as="h2">Frequently asked questions</Heading>
            </div>
            {/* White cards on the eggshell section. Deliberately not a real
                accordion: every answer is short, and hiding them behind a
                click only adds a step between a hesitant reader and the
                reassurance they came for. */}
            <dl className="mt-10 space-y-4">
              {pageFaqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <dt className="text-base font-semibold">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-muted-foreground">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 text-center">
              <TicketButton href="#reserve">Reserve my seat, free</TicketButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
