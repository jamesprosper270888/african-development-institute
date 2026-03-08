import { Container } from "@/components/shared/container";

export function AnchoringStatement() {
  return (
    <section className="bg-adi-black py-16 text-white md:py-20">
      <Container className="text-center">
        <blockquote className="mx-auto max-w-3xl">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-snug md:text-4xl">
            &ldquo;The African Development Institute exists to support Black
            people in moving from surviving to thriving — living and leading with
            confidence, agency, and possibility.&rdquo;
          </p>
          <footer className="mt-8 text-sm uppercase tracking-[0.2em] text-white/50">
            ADI Constitution
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
