import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EVENT, formatGBP } from "@/lib/event-config";
import { PurchaseTracker } from "./purchase-tracker";

export const metadata: Metadata = {
  title: `Your seat — ${EVENT.name}`,
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const paid = params.paid === "1";
  const member = params.member === "1";
  const first = typeof params.n === "string" ? params.n : "";
  const earlyBird = formatGBP(EVENT.pricing.earlyBird);
  const standard = formatGBP(EVENT.pricing.standard);

  return (
    <>
      <Suspense fallback={null}>
        <PurchaseTracker paid={paid} />
      </Suspense>

      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
              {EVENT.name}
            </p>
            <Heading as="h1" className="mt-4">
              {paid
                ? `${first ? `${first}, y` : "Y"}our seat is yours.`
                : member
                  ? `${first ? `${first}, y` : "Y"}ou're in.`
                  : `${first ? `${first}, y` : "Y"}our seat is reserved.`}
            </Heading>
            <p className="mt-6 text-lg text-white/80">
              {paid
                ? `We will see you on ${EVENT.dateLong} at ${EVENT.venue.name}, ${EVENT.venue.town}. A confirmation is on its way to your inbox.`
                : member
                  ? `We will confirm your membership and send the details a week before ${EVENT.dateShort}. Nothing to pay.`
                  : `We are holding it for 48 hours. Make it yours now at the early-bird price.`}
            </p>
          </div>
        </Container>
      </Section>

      {!paid && !member ? (
        <Section>
          <Container>
            <div className="mx-auto max-w-md rounded-xl border-2 border-adi-red bg-card p-8 text-center">
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
                Lunch included. First {EVENT.pricing.earlyBirdSeats} seats or
                until {EVENT.pricing.earlyBirdUntilLabel}.
              </p>
              <a
                href={EVENT.tickets.earlyBirdUrl}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-red px-6 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
              >
                Secure my seat — {earlyBird}
              </a>
              <p className="mt-4 text-xs text-muted-foreground">
                Secure card payment. You will be brought straight back here.
              </p>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-xl">
            <Heading as="h3" className="text-center">
              What happens next
            </Heading>
            <ol className="mt-8 space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-semibold text-adi-green">1.</span>
                <span>
                  Check your inbox &mdash; we have sent you a confirmation
                  (look in promotions or spam if it is not there).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-adi-green">2.</span>
                <span>
                  Pam or Marcia will be in touch personally before the day.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-adi-green">3.</span>
                <span>
                  {EVENT.dateLong}, {EVENT.time}. {EVENT.venue.name},{" "}
                  {EVENT.venue.address}. 25 minutes from Waterloo.
                </span>
              </li>
            </ol>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Know someone who needs to hear &ldquo;you are not alone&rdquo;?
              Send them this page.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
