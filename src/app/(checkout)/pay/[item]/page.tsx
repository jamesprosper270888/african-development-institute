import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BellRing, CalendarCheck, HeartHandshake, Lock, Mail, Smartphone, Users, type LucideIcon } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EVENT, stripeCheckoutOn, ticketUrl } from "@/lib/event-config";
import { isPayItem, type PayItem } from "@/lib/stripe";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Secure payment",
  robots: { index: false, follow: false },
};

// Price and "booking open" are decided per request, like the event page.
export const dynamic = "force-dynamic";

type Params = Promise<{ item: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// No price in the heading: Stripe's own summary shows it at the top of the form.
const COPY: Record<PayItem, { kicker: string; title: string; lines: string[] }> = {
  ticket: {
    kicker: EVENT.name,
    title: "Secure your seat",
    lines: [
      `${EVENT.dateLong}, ${EVENT.time}`,
      `${EVENT.venue.name}, ${EVENT.venue.town}`,
      "Lunch included, plus a 30-minute one-to-one with Pam or Marcia afterwards.",
    ],
  },
  monthly: {
    kicker: "ADI Membership",
    title: "Monthly membership",
    lines: [
      "Community, masterminds, coaching and learning with ADI.",
      "Renews monthly. Cancel any time: just email us.",
    ],
  },
  annual: {
    kicker: "ADI Membership",
    title: "Annual membership",
    lines: [
      "Community, masterminds, coaching and learning with ADI.",
      "Saves over £85 against paying monthly.",
      "Renews yearly. We email you before it renews, and you can cancel any time before then.",
    ],
  },
};

// The three reassurances under the form, like the Solar Contract Check bar.
// Each one must be true for that item: say nothing we have not built.
const BENEFITS: Record<PayItem, { icon: LucideIcon; text: string }[]> = {
  ticket: [
    { icon: Lock, text: "Secure payment, processed by Stripe" },
    { icon: Mail, text: "Your confirmation goes straight to your inbox" },
    { icon: HeartHandshake, text: "Lunch included, plus a one-to-one with Pam or Marcia" },
  ],
  monthly: [
    { icon: Lock, text: "Secure payment, processed by Stripe" },
    { icon: CalendarCheck, text: "Monthly and flexible: cancel any time" },
    { icon: Users, text: "A community of Black professionals who get it" },
  ],
  annual: [
    { icon: Lock, text: "Secure payment, processed by Stripe" },
    { icon: BellRing, text: "We remind you before it renews each year" },
    { icon: Users, text: "A community of Black professionals who get it" },
  ],
};

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { item } = await params;
  if (!isPayItem(item) || !stripeCheckoutOn()) notFound();

  const query = await searchParams;
  const refId = typeof query.r === "string" ? query.r : undefined;
  const copy = COPY[item];
  const closed = item === "ticket" && !ticketUrl();

  return (
    <Section className="py-12 md:py-20">
      <Container>
        <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[1fr_560px] lg:gap-12">
          {/* Stays in view while the (taller) form scrolls past, so the left
              side never sits as a block of empty space. */}
          <div className="md:sticky md:top-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
              {copy.kicker}
            </p>
            <Heading as="h1" className="mt-3 text-3xl md:text-4xl">
              {copy.title}
            </Heading>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              {copy.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-8 flex items-start gap-2 text-sm text-muted-foreground">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                If your bank asks you to approve the payment in its app, approve
                it there, then come back to this page to finish.
              </span>
            </p>
            <Benefits item={item} className="mt-10 hidden border-t border-border pt-8 md:grid" />
          </div>

          {closed ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <p className="text-lg">Booking for {EVENT.name} has closed.</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Reply to your confirmation email and Pam or Marcia will help.
              </p>
            </div>
          ) : (
            <CheckoutForm item={item} refId={refId} />
          )}
        </div>

        {/* On a phone the form comes first, then the reassurances. */}
        <Benefits item={item} className="mx-auto mt-12 grid max-w-md md:hidden" />
      </Container>
    </Section>
  );
}

function Benefits({ item, className }: { item: PayItem; className: string }) {
  return (
    <ul className={`gap-5 ${className}`}>
      {BENEFITS[item].map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-adi-red/10">
            <Icon className="h-5 w-5 text-adi-red" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="text-foreground/80">{text}</span>
        </li>
      ))}
    </ul>
  );
}
