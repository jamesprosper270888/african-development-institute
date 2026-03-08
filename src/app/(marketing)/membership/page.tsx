import type { Metadata } from "next";
import { Users, Brain, BookOpen, Calendar, MessageCircle } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Join ADI's developmental community. Mastermind sessions, coaching, shared learning and belonging for Black professionals and leaders in the UK.",
};

const benefits = [
  {
    icon: Users,
    title: "Community",
    description:
      "A trusted community where you are not navigating challenges alone.",
  },
  {
    icon: Brain,
    title: "Masterminds",
    description:
      "Structured sessions that help you clarify ideas, work through challenges, strengthen decision-making, and maintain focus and accountability.",
  },
  {
    icon: MessageCircle,
    title: "Coaching",
    description:
      "Access to group coaching and developmental conversations facilitated by experienced practitioners.",
  },
  {
    icon: BookOpen,
    title: "Learning",
    description:
      "Learning from others' experiences, insights and progress. Shared perspective and practical development.",
  },
  {
    icon: Calendar,
    title: "Events",
    description:
      "Regular gatherings — online and in person — for connection, celebration, and collective reflection.",
  },
];

const pathway = [
  { stage: "Entry", description: "Belonging, orientation, and clarity." },
  { stage: "Growth", description: "Development, momentum, and focus." },
  { stage: "Leadership", description: "Influence, contribution, and readiness." },
  { stage: "Legacy", description: "Mentoring, role modelling, and generational impact." },
];

export default function MembershipPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-adi-red">
              Membership
            </p>
            <Heading as="h1" className="text-white">
              ADI Membership
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              An ongoing developmental community for people who want space to
              think clearly, get practical help, and grow alongside others who
              understand the realities of navigating leadership, business and
              professional life.
            </p>
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section variant="offwhite">
        <Container>
          <div className="text-center">
            <Heading as="h2">What Membership Includes</Heading>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-border bg-card p-8"
              >
                <div className="inline-flex rounded-lg bg-adi-green/5 p-3">
                  <benefit.icon className="h-6 w-6 text-adi-green" />
                </div>
                <h3 className="mt-6 font-[family-name:var(--font-cormorant)] text-xl font-semibold">
                  {benefit.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pathway */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Heading as="h2">The Membership Pathway</Heading>
              <p className="mt-4 text-lg text-muted-foreground">
                ADI membership is a developmental pathway, not a static
                subscription. People join at different stages and grow over time.
              </p>
            </div>
            <div className="mt-12 space-y-6">
              {pathway.map((step, i) => (
                <div
                  key={step.stage}
                  className="flex items-start gap-6 rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-adi-red text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold">
                      {step.stage}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Who it's for */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Heading as="h2">Who Is This For?</Heading>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              ADI membership is for people who want to grow with confidence and
              clarity, value community and shared learning, are navigating
              leadership, business or professional development, and want support
              that is practical, reflective and grounded.
            </p>
          </div>
        </Container>
      </Section>

      {/* Pricing */}
      <Section>
        <Container>
          <div className="text-center">
            <Heading as="h2">Investment</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that works for you.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-2xl gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                Monthly
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">£49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Flexible monthly commitment. Cancel anytime.
              </p>
            </div>
            <div className="relative rounded-xl border-2 border-adi-green bg-card p-8 text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-adi-green px-4 py-1 text-xs font-semibold text-white">
                Best Value
              </span>
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                Annual
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">£499</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Save over £85 per year. Full commitment, full access.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Register Interest Form */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <Heading as="h2">Register Your Interest</Heading>
              <p className="mt-4 text-muted-foreground">
                Membership is opening soon. Leave your details and we&apos;ll be
                in touch.
              </p>
            </div>
            <div className="mt-10">
              <EnquiryForm type="membership" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
