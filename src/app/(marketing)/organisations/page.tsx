import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = {
  title: "Organisations",
  description:
    "Partner with ADI for values-aligned leadership and management development grounded in lived experience.",
};

const offerings = [
  "Leadership development programmes tailored to your organisational context",
  "Equity and inclusion strategy that goes beyond compliance",
  "Facilitated conversations on race, power, and systemic change",
  "Team development and relational practice",
  "Board and governance development",
  "Community engagement and partnership building",
];

export default function OrganisationsPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" className="py-28 md:py-36">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-adi-red">
              Organisations
            </p>
            <Heading as="h1" className="text-white">
              Working With Organisations
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              Partnership-led consultancy for organisations committed to equity,
              development, and systemic change — not quick fixes.
            </p>
          </div>
        </Container>
      </Section>

      {/* What ADI Delivers */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">What ADI Delivers</Heading>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              ADI works with organisations that are serious about change — not
              those looking for a diversity tick-box. Our work is
              partnership-led, relationally grounded, and designed to create
              lasting shifts in culture, leadership, and practice.
            </p>
            <div className="mt-10 space-y-4">
              {offerings.map((offering, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-adi-green text-xs font-bold text-white">
                    &#10003;
                  </span>
                  <p className="text-foreground">{offering}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* How ADI Works */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">How ADI Works With Organisations</Heading>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Every engagement starts with a conversation — not a pitch. We
                take time to understand your context, your challenges, and your
                readiness for the work. From there, we co-design an approach
                that meets you where you are and moves you towards where you
                need to be.
              </p>
              <p>
                ADI does not parachute in with pre-packaged programmes. We
                build relationships, earn trust, and do the work alongside you.
                This means our engagements are typically longer-term, deeper,
                and more transformational than traditional consultancy.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Partnership Ethos */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">Partnership Ethos</Heading>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-green">
                  What Partners Can Expect
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>Honest, direct conversations — even when uncomfortable</li>
                  <li>Deep expertise in race, leadership, and systemic change</li>
                  <li>Bespoke design, not off-the-shelf solutions</li>
                  <li>Long-term relational engagement</li>
                  <li>Measurable, sustainable outcomes</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-red">
                  What We Expect From Partners
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>Genuine commitment to change, not optics</li>
                  <li>Senior leadership engagement and sponsorship</li>
                  <li>Willingness to be challenged and to do the work</li>
                  <li>Resources and time allocated for meaningful impact</li>
                  <li>Openness to approaches that go beyond the conventional</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Form */}
      <Section>
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <Heading as="h2">Start a Conversation</Heading>
              <p className="mt-4 text-muted-foreground">
                Tell us about your organisation and the change you&apos;re
                seeking. No obligation — just an honest conversation.
              </p>
            </div>
            <div className="mt-10">
              <EnquiryForm type="organisation" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
