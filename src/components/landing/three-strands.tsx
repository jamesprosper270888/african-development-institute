import Link from "next/link";
import { Users, Crown, Building2 } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";

const strands = [
  {
    icon: Users,
    title: "Membership",
    description:
      "An ongoing developmental community. Space to think clearly, get practical help, and grow alongside others.",
    href: "/membership",
    color: "text-adi-red",
    bgColor: "bg-adi-red/5",
  },
  {
    icon: Crown,
    title: "Leadership Development",
    description:
      "A six-month programme for Black mid-to-senior leaders. Structured, identity-level leadership development for those ready to step into greater responsibility.",
    href: "/leadership-programme",
    color: "text-adi-green",
    bgColor: "bg-adi-green/5",
  },
  {
    icon: Building2,
    title: "Working With Organisations",
    description:
      "ADI partners with organisations to deliver leadership and management development, retaining ownership of its approach and values.",
    href: "/organisations",
    color: "text-adi-black",
    bgColor: "bg-adi-black/5",
  },
];

export function ThreeStrands() {
  return (
    <section className="bg-adi-offwhite py-16 md:py-20">
      <Container>
        <div className="text-center">
          <Heading as="h2">Three Strands of Work</Heading>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            ADI operates across three interconnected areas — each rooted in the
            same values, each serving a different need.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {strands.map((strand) => (
            <Link
              key={strand.title}
              href={strand.href}
              className="group rounded-xl border border-border bg-card p-8 transition-all hover:shadow-lg"
            >
              <div
                className={`inline-flex rounded-lg p-3 ${strand.bgColor}`}
              >
                <strand.icon className={`h-6 w-6 ${strand.color}`} />
              </div>
              <h3 className="mt-6 font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                {strand.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {strand.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-adi-red transition-colors group-hover:text-adi-red/80">
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
