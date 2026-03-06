import Link from "next/link";
import { Container } from "@/components/shared/container";

export function Hero() {
  return (
    <section className="relative bg-adi-black py-32 text-white md:py-40 lg:py-48">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-adi-black via-adi-black/95 to-adi-black" />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-adi-red">
            African Development Institute
          </p>
          <h1 className="font-[family-name:var(--font-cormorant)] text-5xl font-semibold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            From Surviving
            <br />
            to Thriving
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            A values-led developmental organisation for Black people in the UK.
            Building community, developing leaders, and strengthening
            organisations.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/membership"
              className="inline-flex h-12 items-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
            >
              Explore Membership
            </Link>
            <Link
              href="/leadership-programme"
              className="inline-flex h-12 items-center rounded-md border border-white/20 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Leadership Programme
            </Link>
          </div>
        </div>
      </Container>

      {/* Pan-African accent line */}
      <div className="absolute bottom-0 left-0 right-0 flex h-1">
        <div className="flex-1 bg-adi-red" />
        <div className="flex-1 bg-adi-black" />
        <div className="flex-1 bg-adi-green" />
      </div>
    </section>
  );
}
