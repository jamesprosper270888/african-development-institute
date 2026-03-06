import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";

const values = [
  {
    title: "Rootedness",
    description:
      "Grounded in the lived experience, heritage, and wisdom of people of African and Caribbean descent.",
  },
  {
    title: "Development",
    description:
      "Committed to growth — personal, professional, and collective — as a lifelong practice.",
  },
  {
    title: "Integrity",
    description:
      "Honest, transparent, and accountable in all we do. Our values are not aspirational — they are operational.",
  },
  {
    title: "Community",
    description:
      "We believe in the power of collective effort, mutual support, and shared responsibility.",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-background py-16 md:py-20">
      <Container>
        <div className="text-center">
          <Heading as="h2">What Guides Us</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything ADI does is anchored in a set of core values drawn from
            our constitution — not as slogans, but as commitments.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
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
