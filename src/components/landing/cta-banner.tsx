import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";

export function CtaBanner({
  heading = "Ready to begin?",
  description = "Whether you're exploring membership, leadership development, or organisational partnerships — we'd love to hear from you.",
  primaryHref = "/contact",
  primaryLabel = "Get in Touch",
  secondaryHref,
  secondaryLabel,
}: {
  heading?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-adi-black py-16 text-white md:py-20">
      <Container className="text-center">
        <Heading as="h2" className="text-white">
          {heading}
        </Heading>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          {description}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex h-12 items-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex h-12 items-center rounded-md border border-white/20 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
