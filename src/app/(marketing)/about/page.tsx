import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { CtaBanner } from "@/components/landing";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the African Development Institute — our purpose, values, and founders, Pam Rowe and Marcia Daigo.",
};

const values = [
  "Psychological safety comes first — If safety, trust or belonging are undermined, the idea does not proceed.",
  "Development before extraction — ADI exists to develop people, not to use them. Participation must be ethical, optional and growth-enhancing.",
  "Growth with dignity — Stretch is invited, not imposed. Accountability is consent-based.",
  "Clarity without hierarchy — Pathways are clear and distinct without ranking worth.",
  "Opportunity without entitlement — Access is based on readiness, alignment and fit, not proximity or expectation.",
  "Stewardship over personality — ADI must be able to thrive beyond individual leaders while remaining true to its values.",
  "Integrity over scale — Growth must not erode relational depth, cultural integrity or purpose.",
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
              The African Development Institute exists to support Black people
              in moving from surviving to thriving — living and leading with
              confidence, agency, and possibility. ADI builds on the strength,
              wisdom and leadership of Black people throughout history,
              supporting members to draw on this lineage as a source of
              confidence, agency and possibility.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              ADI is a community-based leadership organisation. We work across
              three interconnected areas — membership, leadership development,
              and working with organisations — each rooted in the same set of
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
                  <li>A developmental community and institution</li>
                  <li>Values-led and purpose-driven</li>
                  <li>Rooted in the strength, wisdom and leadership of Black people throughout history</li>
                  <li>Built on trust, relationship and shared learning</li>
                  <li>Focused on confidence, agency and collective advancement</li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-adi-red">
                  ADI Is Not
                </h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>A sales platform or referral network</li>
                  <li>A route to personal consultancy opportunities</li>
                  <li>A programme that starts from deficit or treats Blackness as a problem</li>
                  <li>A diversity consultancy or quick-fix provider</li>
                  <li>An organisation that waters down its purpose for comfort</li>
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
              The following principles act as constitutional filters for any
              future idea, programme, partnership or offer. If these principles
              are weakened, ADI ceases to be itself.
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
            <Heading as="h2">The Founders</Heading>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  Pam Rowe
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Co-Founder &amp; Director, African Development Institute
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
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  Marcia Daigo
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Co-Founder &amp; Director, African Development Institute
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Marcia Daigo is an executive coach, leadership development
                  consultant, and organisational development specialist with over
                  15 years of experience across the NHS, public sector, and
                  voluntary organisations. She co-founded ADI from the conviction
                  that lasting leadership is built on multiple levels —
                  psychological, emotional, professional, and practical — and that
                  Black people deserve developmental spaces where this depth of
                  work is the starting point.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Her practice combines values-driven leadership development with
                  organisational insight, supporting individuals and teams to
                  strengthen confidence, navigate complexity, and lead with
                  clarity and accountability.
                </p>
              </div>
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
