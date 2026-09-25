import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Welcome to ADI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Where /pay/monthly and /pay/annual send people once Stripe has finished. */
export default async function MembershipWelcomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;
  let paid = false;
  let firstName = "";
  let annual = false;

  if (typeof session_id === "string" && session_id.startsWith("cs_")) {
    try {
      const session = await stripe().checkout.sessions.retrieve(session_id);
      paid = session.mode === "subscription" && session.payment_status === "paid";
      annual = session.metadata?.item === "annual";
      const name = session.customer_details?.individual_name ?? session.customer_details?.name ?? "";
      firstName = name.trim().split(/\s+/)[0] ?? "";
    } catch {
      paid = false;
    }
  }

  return (
    <Section variant="dark" className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-adi-red">
            ADI Membership
          </p>
          <Heading as="h1" className="mt-4">
            {paid
              ? `${firstName ? `Welcome, ${firstName}` : "Welcome"}. You're a member.`
              : "Your payment has not completed."}
          </Heading>
          <p className="mt-6 text-lg text-white/80">
            {paid
              ? `Your receipt is on its way to your inbox, and Pam or Marcia will be in touch with what happens next. Your membership renews ${annual ? "each year" : "each month"}${annual ? ", and we will email you before it does" : ""}.`
              : "Nothing has been taken. If your bank asked you to approve the payment, it may have timed out. Please try again, or email us and we will help."}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {paid ? (
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white hover:bg-adi-red/90"
              >
                Back to ADI
              </Link>
            ) : (
              <>
                <Link
                  href="/membership"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white hover:bg-adi-red/90"
                >
                  Try again
                </Link>
                <a
                  href="mailto:africandevelopmentinstitute01@gmail.com"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-white/40 px-8 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Email us
                </a>
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
