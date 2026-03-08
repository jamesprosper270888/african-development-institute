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
  "Leadership development programmes",
  "Management and leadership development",
  "Partnership-based delivery grounded in lived experience",
];

export default function OrganisationsPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-adi-red">
              Organisations
            </p>
            <Heading as="h1" className="text-white">
              Working With Organisations
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              ADI partners with organisations and sector bodies to deliver
              leadership and management development — retaining ownership of its
              work and values.
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
              ADI partners with organisations and sector bodies to deliver
              leadership and management development. This strand allows ADI to
              extend its impact into systems and organisations, while retaining
              ownership of its work and values.
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
                Every engagement begins with a conversation to confirm fit and
                alignment. Programmes are designed, held and delivered by ADI.
                ADI retains ownership of its approach and content.
              </p>
              <p>
                Work is agreed case by case, based on alignment of values and
                purpose. Delivery is partnership-based, not transactional.
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
                  <li>Thoughtful, values-led engagement</li>
                  <li>High-quality leadership insight and development</li>
                  <li>Clear boundaries and accountability</li>
                  <li>A focus on sustainable impact</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-red">
                  What We Expect From Partners
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>Alignment of values and purpose</li>
                  <li>Willingness to begin with conversation, not assumption</li>
                  <li>Commitment to partnership, not transaction</li>
                  <li>Openness to ADI retaining ownership of its approach</li>
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
