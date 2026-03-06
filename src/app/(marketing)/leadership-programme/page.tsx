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
  { month: "Month 1", title: "Arrival", description: "Grounding in values, building the container, establishing trust." },
  { month: "Month 2", title: "Roots", description: "Exploring heritage, identity, and the foundations of your leadership." },
  { month: "Month 3", title: "Reckoning", description: "Confronting the patterns, narratives, and systems that shape how you lead." },
  { month: "Month 4", title: "Practice", description: "Developing new ways of showing up — in relationships, in organisations, in community." },
  { month: "Month 5", title: "Integration", description: "Bringing it together. Testing, refining, embodying your leadership." },
  { month: "Month 6", title: "Departure", description: "Completion, not endings. Carrying the work forward with intention." },
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
              A six-month, values-led programme for Black leaders who are ready
              to do the work no one else names — and emerge transformed.
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
                Most leadership programmes teach you to manage others. This one
                starts with you. It asks the questions that rarely get asked in
                professional development: Who are you when no one is watching?
                What stories do you carry about power, authority, and belonging?
                What would it mean to lead from a place of wholeness, not
                survival?
              </p>
              <p>
                This is deep, relational, values-led work. It draws on
                African-centred thought, systemic practice, and decades of
                experience in leadership development. It is not therapy — but it
                is therapeutic. It is not coaching — but it is developmental. It
                is a container in which transformational work can happen.
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
                  <li>A developmental journey, not a training course</li>
                  <li>Relational, not transactional</li>
                  <li>Values-led, not competency-driven</li>
                  <li>Rooted in African-centred thought</li>
                  <li>Invitation-led, not application-based</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-red">
                  This Programme Is Not
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>A tick-box leadership certificate</li>
                  <li>Therapy or counselling</li>
                  <li>A networking opportunity</li>
                  <li>Something to put on your LinkedIn</li>
                  <li>Comfortable — growth rarely is</li>
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
                Each month builds on the last. There are no shortcuts.
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
                The programme runs over six months with a blend of in-person
                residential days, online group sessions, one-to-one
                developmental conversations, and reflective practice between
                sessions.
              </p>
              <p>
                The group is deliberately small — a maximum of 8 participants —
                to create the depth and safety this work requires.
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
              If you sense this work is for you, we invite you to request a
              conversation. No hard sell — just an honest exploration of fit.
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
                  Founder &amp; Lead Facilitator
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Leadership development practitioner and community builder with
                  decades of experience at the intersection of personal
                  development, organisational change, and racial equity.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  Marcia Sherrie-Daigo
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Co-Facilitator
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Experienced facilitator and practitioner bringing deep
                  expertise in systemic work, group dynamics, and
                  developmental practice.
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
