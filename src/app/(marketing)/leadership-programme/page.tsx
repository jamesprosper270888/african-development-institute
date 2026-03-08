import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { LeadershipEnquiryForm } from "@/components/forms/leadership-enquiry-form";

export const metadata: Metadata = {
  title: "Leadership Programme",
  description:
    "Developing the Self as Leader — a six-month identity-level programme for Black mid-to-senior leaders. Founding Cohort 2026.",
};

const journeyMonths = [
  { month: "Month 1", title: "Permission to Slow", description: "Removing performance pressure and establishing a different pace." },
  { month: "Month 2", title: "Recognising Patterns Under Pressure", description: "Identifying personal reflexes without judgement." },
  { month: "Month 3", title: "Staying Rather Than Moving Away", description: "Strengthening tolerance for discomfort without rushing to resolve." },
  { month: "Month 4", title: "Choice Without Self-Blame", description: "Locating agency without collapsing into self-blame." },
  { month: "Month 5", title: "Integration Into Daily Leadership", description: "Doing less, saying less, meaning more." },
  { month: "Month 6", title: "Consolidation and Return of Authority", description: "Strengthening internal leadership without reliance on the group." },
];

export default function LeadershipProgrammePage() {
  return (
    <>
      {/* Hero */}
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-adi-green">
              Leadership Programme
            </p>
            <Heading as="h1" className="text-white">
              Developing the Self as Leader
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              A six-month leadership experience for Black mid-to-senior leaders.
              You already lead at scale. This programme strengthens how you lead
              under pressure.
            </p>
          </div>
        </Container>
      </Section>

      {/* The Leadership Work */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">The Leadership Work No One Names</Heading>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Black leaders often operate in environments where scrutiny is
                higher, margin for error feels smaller, cultural translation is
                constant, and systemic tension is rarely named. Over time,
                intelligent adaptations develop. You over-prepare. You
                over-explain. You carry more than is yours. ADI works at the
                moment those patterns show up — and restores choice.
              </p>
              <p>
                Developing the Self as Leader is a six-month, identity-level
                leadership experience. It strengthens one central capacity: the
                ability to notice when pressure hits, slow down in that moment,
                and choose how to respond — rather than react automatically.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* What This Programme Is (and Is Not) */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">What This Programme Is — and Is Not</Heading>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-green">
                  This Programme Is
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>A six-month, identity-level leadership experience</li>
                  <li>Structured and time-bound</li>
                  <li>Explicit about stretch and accountability</li>
                  <li>Designed for people at a particular moment of readiness</li>
                  <li>Rooted in ADI&apos;s values</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-red">
                  This Programme Is Not
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>Skills training</li>
                  <li>Confidence building</li>
                  <li>Performance optimisation</li>
                  <li>A networking cohort</li>
                  <li>A therapy group</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Six-Month Journey */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Heading as="h2">The Six-Month Journey</Heading>
              <p className="mt-4 text-lg text-muted-foreground">
                The programme returns to the same core moment each month,
                deepening capacity rather than adding theory.
              </p>
            </div>
            <div className="mt-12 space-y-6">
              {journeyMonths.map((item) => (
                <div
                  key={item.month}
                  className="flex items-start gap-6 rounded-xl border border-border bg-card p-6"
                >
                  <div className="w-20 shrink-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-adi-red">
                      {item.month}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-cormorant)] text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* The Container */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">The Container</Heading>
            <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>
                The programme runs over six months. One online session per month,
                2.5–3 hours per session, with in-person residential days woven
                into the programme. The cohort is intentionally small — a maximum
                of 8 participants. Depth requires steadiness.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Founding Cohort */}
      <Section variant="dark">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-adi-green">
              2026
            </p>
            <Heading as="h2" className="mt-4 text-white">
              Founding Cohort
            </Heading>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              The first cohort is invitation-led and limited to 8 participants.
              Programme begins Spring 2026. If you sense this work is for you,
              we invite you to request a conversation. No hard sell — just an
              honest exploration of fit.
            </p>
          </div>
        </Container>
      </Section>

      {/* Facilitation */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">Facilitation</Heading>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  Pam Rowe
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Co-Founder &amp; Facilitator
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Leadership development practitioner and community builder with
                  decades of experience at the intersection of personal
                  development, organisational change, and racial equity.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  Marcia Daigo
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Co-Founder &amp; Facilitator
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Executive coach, leadership development consultant, and
                  organisational development specialist with over 15 years of
                  experience across the NHS, public sector, and voluntary
                  organisations. Her work combines values-driven practice with
                  organisational insight, strengthening leadership culture,
                  confidence, and accountability.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Request a Conversation Form */}
      <Section>
        <Container>
          <div className="mx-auto max-w-xl">
            <div className="text-center">
              <Heading as="h2">Request a Conversation</Heading>
              <p className="mt-4 text-muted-foreground">
                Interested in the founding cohort? Tell us a little about
                yourself and we&apos;ll arrange a conversation.
              </p>
            </div>
            <div className="mt-10">
              <LeadershipEnquiryForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
