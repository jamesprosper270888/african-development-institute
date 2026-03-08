import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";

const values = [
  {
    title: "Psychological safety comes first",
    description:
      "If safety, trust or belonging are undermined, the idea does not proceed.",
  },
  {
    title: "Development before extraction",
    description:
      "ADI exists to develop people, not to use them. Participation must be ethical, optional and growth-enhancing.",
  },
  {
    title: "Growth with dignity",
    description:
      "Stretch is invited, not imposed. Accountability is consent-based.",
  },
  {
    title: "Clarity without hierarchy",
    description:
      "Pathways are clear and distinct without ranking worth.",
  },
  {
    title: "Opportunity without entitlement",
    description:
      "Access is based on readiness, alignment and fit, not proximity or expectation.",
  },
  {
    title: "Stewardship over personality",
    description:
      "ADI must be able to thrive beyond individual leaders while remaining true to its values.",
  },
  {
    title: "Integrity over scale",
    description:
      "Growth must not erode relational depth, cultural integrity or purpose.",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-background py-16 md:py-20">
      <Container>
        <div className="text-center">
          <Heading as="h2">Values as Guardrails</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            These principles act as constitutional filters for every decision ADI
            makes.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border bg-card p-8"
            >
              <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                {value.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
