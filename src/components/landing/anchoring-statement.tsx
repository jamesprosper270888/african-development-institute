import { Container } from "@/components/shared/container";

export function AnchoringStatement() {
  return (
    <section className="bg-adi-black py-16 text-white md:py-20">
      <Container className="text-center">
        <blockquote className="mx-auto max-w-3xl">
          <p className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold leading-snug md:text-4xl">
            &ldquo;The African Development Institute exists to create the
            conditions in which Black people in the UK can move from surviving to
            thriving — drawing on the strength, wisdom and leadership of people
            of African and Caribbean heritage.&rdquo;
          </p>
          <footer className="mt-8 text-sm uppercase tracking-[0.2em] text-white/50">
            ADI Constitution, Section 1
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
