import type { Metadata } from "next";
import Image from "next/image";
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

const founders = [
  {
    name: "Pam Rowe",
    role: "Co-Founder & Director",
    photo: "/team/pam-rowe.jpg",
    paragraphs: [
      "Pam Rowe is a leadership adviser, facilitator and organisational development specialist with more than three decades of experience supporting senior leaders, boards and organisations in complex systems, across public services, safeguarding partnerships, education and community organisations in the UK.",
      "An author, she co-founded ADI with a clear conviction that Black professionals deserve developmental spaces that recognise the realities they navigate. She works with mid-to-senior leaders on identity-level leadership: distinguishing what belongs to them from what belongs to the system.",
    ],
  },
  {
    name: "Marcia Daigo",
    role: "Co-Founder & Director",
    photo: "/team/marcia-daigo.jpg",
    paragraphs: [
      "Marcia Daigo is an executive leadership coach, organisational development specialist and published author with over fifteen years' experience across the NHS, public sector and voluntary sector. She partners with senior leaders and leadership teams to navigate complexity, strengthen leadership identity and deliver sustainable organisational change.",
      "Her coaching goes beyond confidence-building to identity-level development: helping leaders recognise the patterns in how they lead, navigate complex relational and organisational dynamics, and translate insight into purposeful, values-driven action within their systems and their own lives.",
    ],
  },
];

// Named testimonials about Pam and Marcia (from ADI's Dec 2025 bios doc).
// Hidden until ADI confirms consent to publish; flip to true to show.
const SHOW_TESTIMONIALS = false;

const testimonials = [
  {
    quote: "Through her balance of lived experience, wisdom, challenge and support, she had a transformative impact on me. The most significant shift has been in my self-esteem. I had not realised how deeply some negative beliefs were embedded.",
    name: "Georgia Chimbani",
    title: "Corporate Director",
    about: "Pam",
  },
  {
    quote: "Marcia is very astute and quickly gets to the heart of issues. She encourages you to trust your instincts and recognise that you already hold the answers to the challenges and opportunities.",
    name: "Meghan Zinkewich-Peotti",
    title: "Head of Insight and Housing Strategy",
    about: "Marcia",
  },
  {
    quote: "Working with Pam has been a turning point in my leadership journey. I have refined my leadership style, strengthened my resilience, and gained greater clarity and confidence.",
    name: "Manyara Walker",
    title: "Senior Manager, Families First Lead",
    about: "Pam",
  },
  {
    quote: "Managers who went through the leadership programme said that for the first time in their careers they understood how to lead their staff.",
    name: "Francesca Okosi",
    title: "Executive Director, Workforce Transformation",
    about: "Marcia",
  },
  {
    quote: "Pam brings a steadiness and depth that makes even complex challenges feel workable. There is a real sense that progress is possible, whatever the starting point.",
    name: "Ann Marie Dodds",
    title: "Executive Director",
    about: "Pam",
  },
  {
    quote: "A person-centred approach that explores beyond the presenting issues, allowing you to develop your own insight. Relationships built on trust and respect that challenge and empower in equal measure.",
    name: "Summer Macer",
    title: "Chief of Staff",
    about: "Marcia",
  },
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

      {/* Founders */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <Heading as="h2">The Founders</Heading>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {founders.map((f) => (
                <div key={f.name} className="rounded-xl border border-border bg-card p-8">
                  <div className="flex items-center gap-5">
                    <Image
                      src={f.photo}
                      alt={f.name}
                      width={112}
                      height={112}
                      className="h-28 w-28 shrink-0 rounded-full object-cover ring-2 ring-adi-green/40"
                    />
                    <div>
                      <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                        {f.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {f.role}
                        <br />
                        African Development Institute
                      </p>
                    </div>
                  </div>
                  {f.paragraphs.map((para) => (
                    <p key={para.slice(0, 24)} className="mt-4 leading-relaxed text-muted-foreground">
                      {para}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* What leaders say */}
      {SHOW_TESTIMONIALS ? (
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <Heading as="h2">What leaders say</Heading>
              <p className="mt-4 text-lg text-muted-foreground">
                From people who have worked with Pam and Marcia.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.name} className="rounded-xl border border-border bg-card p-6">
                  <blockquote className="leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{t.name}</span>, {t.title}
                    <span className="text-adi-green"> · on {t.about}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      ) : null}

      <CtaBanner
        heading="Want to know more?"
        description="We'd love to hear from you. Whether you have questions about ADI or want to explore how we might work together."
        primaryHref="/contact"
        primaryLabel="Get in Touch"
      />
    </>
  );
}
