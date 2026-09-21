import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { Heading } from "@/components/shared/heading";
import { BookCover } from "@/components/book/book-cover";
import { BookReservationForm } from "@/components/forms/book-reservation-form";
import { BOOK } from "@/lib/book-config";

export const metadata: Metadata = {
  title: `${BOOK.title}: a book in progress`,
  description:
    "The Third Way, a book in progress from the African Development Institute by Pam Rowe and Marcia Daigo. Reserve your copy free and read the Introduction today.",
  // Hidden from search until Pam and Marcia approve it; see BOOK.listed.
  robots: BOOK.listed ? undefined : { index: false, follow: false },
};

// Every line below is quoted from the Introduction, so the page never says
// anything about the book that Pam and Marcia have not written themselves.
const themes = [
  {
    title: "Experience as information",
    line: "The fact that something has been learned does not automatically make it true or useful for the life we are trying to live now.",
  },
  {
    title: "The crossing",
    line: "There is often a period when the old way of being no longer fits and the new way is not yet secure.",
  },
  {
    title: "Learning that becomes useful",
    line: "Experience can become learning. Learning can become usable knowledge. Usable knowledge can become contribution.",
  },
  {
    title: "Why ADI begins with Black people",
    line: "Those experiences matter and must be named. They are also not the whole story.",
  },
  {
    title: "From freedom to impact",
    line: "Achievement is what a person brings into being. Impact is what that achievement changes beyond them.",
  },
];

export default function BookPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="offwhite" className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
            <div>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-adi-red">
                A book in progress from ADI
              </p>
              <Heading as="h1">{BOOK.title}</Heading>
              <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl italic text-muted-foreground md:text-3xl">
                {BOOK.subtitle}
              </p>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80">
                This book exists because ADI believes there is another way to
                understand and respond to human experience. It is a way that
                helps us see more clearly, learn more wisely, recover choice,
                recognise what is true about ourselves, and move with greater
                freedom and purpose.
              </p>
              <p className="mt-4 text-lg font-medium">We call this the Third Way.</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="#reserve"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
                >
                  Reserve your copy
                </a>
                <p className="text-sm text-muted-foreground">
                  Free to reserve. Read the Introduction today.
                </p>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                By {BOOK.authors.join(" and ")}
              </p>
            </div>
            <BookCover tilt className="mx-auto w-full max-w-[300px] md:max-w-[340px]" />
          </div>
        </Container>
      </Section>

      {/* The idea */}
      <Section variant="dark" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-white/70 md:text-xl">
              Much of the way we are taught to understand people and situations
              is binary. Something is good or bad, right or wrong, successful or
              failing.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/70 md:text-xl">
              The Third Way asks us to look beyond the binary without abandoning
              truth, responsibility or standards. It is not the middle point
              between two extremes.
            </p>
            <p className="mt-10 font-[family-name:var(--font-cormorant)] text-4xl font-semibold text-white md:text-5xl">
              It is a different quality of seeing.
            </p>
            <span className="mx-auto mt-10 block h-px w-16 bg-adi-red" />
          </div>
        </Container>
      </Section>

      {/* Inside the book */}
      <Section variant="white">
        <Container>
          <div className="text-center">
            <Heading as="h2">Inside the book</Heading>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              The Introduction sets out the thinking. The chapters that follow
              show the Third Way in practice.
            </p>
          </div>
          {/* Flex, not grid, so the odd fifth card sits centred on its row. */}
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {themes.map((theme) => (
              <div
                key={theme.title}
                className="w-full rounded-xl border border-border bg-background p-7 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <h3 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                  {theme.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  &ldquo;{theme.line}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* The question */}
      <Section variant="offwhite" className="py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-adi-green">
              A question that runs through the work
            </p>
            <p className="mt-6 font-[family-name:var(--font-cormorant)] text-4xl font-semibold md:text-6xl">
              Is that really the whole truth about you?
            </p>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              That question is not an instruction to think positively. It is an
              invitation to look at the evidence.
            </p>
          </div>
        </Container>
      </Section>

      {/* Reserve */}
      <Section variant="white" id="reserve" className="scroll-mt-20">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <Heading as="h2">Reserve your copy</Heading>
              <p className="mt-4 text-lg text-muted-foreground">
                The book is still being written. Reserve a copy now and you
                become one of our founding readers.
              </p>
              <ol className="mt-10 space-y-6">
                {BOOK.bonuses.map((bonus, i) => (
                  <li key={bonus.title} className="flex gap-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-adi-green text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{bonus.title}</p>
                      <p className="mt-1 leading-relaxed text-muted-foreground">
                        {bonus.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-xl border border-border bg-background p-8 md:self-start md:p-10">
              <p className="mb-6 font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
                Become a founding reader
              </p>
              <BookReservationForm />
            </div>
          </div>
        </Container>
      </Section>

      {/* Authors */}
      <Section variant="offwhite">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <Heading as="h2">About the authors</Heading>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {BOOK.authors.join(" and ")} are the co-founders of the African
              Development Institute. The Third Way grows out of their work with
              people, groups and organisations, and it is the philosophy behind
              ADI.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
