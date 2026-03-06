import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { CtaBanner } from "@/components/landing";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the African Development Institute — our purpose, values, and the founder, Pam Rowe.",
};

const values = [
  "Ubuntu — I am because we are",
  "Integrity — honest, transparent, and accountable",
  "Excellence — striving for the highest standards in all we do",
  "Rootedness — grounded in African and Caribbean heritage and wisdom",
  "Development — committed to continuous growth",
  "Community — collective effort and mutual responsibility",
  "Justice — working towards equity and systemic change",
];

export default function AboutPage() {
  return (
    <>
      {/* Purpose */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h1">About ADI</Heading>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The African Development Institute exists to create the conditions
              in which Black people in the UK can move from surviving to
              thriving — drawing on the strength, wisdom and leadership of
              people of African and Caribbean heritage.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              ADI is a values-led developmental organisation. We work across
              three interconnected areas — membership, leadership development,
              and organisational partnerships — each rooted in the same set of
              constitutional values.
            </p>
          </div>
        </Container>
      </Section>

      {/* What ADI Is / Is Not */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">What ADI Is — and What It Is Not</Heading>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-green">
                  ADI Is
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>A developmental community, not a networking club</li>
                  <li>Values-led, not trend-led</li>
                  <li>Rooted in heritage, not nostalgia</li>
                  <li>Focused on systemic change, not performative gestures</li>
                  <li>Built on trust, earned through integrity</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-red">
                  ADI Is Not
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>A diversity consultancy selling quick fixes</li>
                  <li>A space for performative allyship</li>
                  <li>An organisation that waters down its mission for comfort</li>
                  <li>A programme that treats Blackness as a problem to solve</li>
                  <li>An echo chamber — challenge is part of growth</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Constitutional Values */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">Our Constitutional Values</Heading>
            <p className="mt-4 text-lg text-muted-foreground">
              These are not aspirational — they are operational. Every decision
              ADI makes is tested against these seven guardrails.
            </p>
            <div className="mt-10 space-y-4">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-adi-green/10 text-sm font-semibold text-adi-green">
                    {i + 1}
                  </span>
                  <p className="text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Founder */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <Heading as="h2">The Founder</Heading>
            <div className="mt-10 rounded-xl border border-border bg-card p-8">
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                Pam Rowe
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Founder &amp; Director, African Development Institute
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Pam Rowe is a leadership development practitioner, facilitator,
                and community builder with decades of experience working at the
                intersection of personal development, organisational change, and
                racial equity. She founded ADI from a deep conviction that Black
                people in the UK deserve developmental spaces that honour their
                heritage, challenge them to grow, and refuse to compromise on
                values.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Her work draws on a rich tradition of African-centred thought,
                systemic leadership practice, and a commitment to creating
                containers in which transformational work can happen.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBanner
        heading="Want to know more?"
        description="We'd love to hear from you. Whether you have questions about ADI or want to explore how we might work together."
        primaryHref="/contact"
        primaryLabel="Get in Touch"
      />
    </>
  );
}
