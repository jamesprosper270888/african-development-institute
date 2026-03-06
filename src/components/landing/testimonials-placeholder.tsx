import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";

const testimonials = [
  {
    quote:
      "ADI gave me a space where I didn't have to explain myself — just grow. The community changed how I see my own potential.",
    name: "Community Member",
    role: "ADI Member",
  },
  {
    quote:
      "The leadership programme was unlike anything I've experienced. It wasn't about techniques — it was about truth.",
    name: "Programme Participant",
    role: "Leadership Cohort",
  },
  {
    quote:
      "Working with ADI helped our organisation move beyond diversity statements into real, structural change.",
    name: "Organisation Partner",
    role: "Senior Leader",
  },
];

export function TestimonialsPlaceholder() {
  return (
    <section className="bg-adi-offwhite py-16 md:py-20">
      <Container>
        <div className="text-center">
          <Heading as="h2">Voices From the Community</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Hear from those who have walked this journey.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card p-8"
            >
              <blockquote className="text-lg leading-relaxed text-foreground/80">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
