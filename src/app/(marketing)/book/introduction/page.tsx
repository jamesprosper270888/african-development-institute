import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Section } from "@/components/shared/section";
import { Container } from "@/components/shared/container";
import { BookCover } from "@/components/book/book-cover";
import { BOOK } from "@/lib/book-config";
import { INTRODUCTION, INTRODUCTION_VERSION } from "@/lib/book-introduction";
import { visitorIsBookReader } from "@/lib/book-access";

export const metadata: Metadata = {
  title: `Introduction: ${BOOK.title}`,
  description: `The Introduction to ${BOOK.title}, a book in progress by ${BOOK.authors.join(" and ")}.`,
  // The founding readers' gift. Reached from the reservation email and the
  // thank-you state of the form, never from search.
  robots: { index: false, follow: false },
};

/** Renders Pam and Marcia's own **emphasis** inside a paragraph. */
function withEmphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export default async function IntroductionPage() {
  // Founding readers only: search engines and anyone who merely has the link
  // get the free reserve form instead (see src/lib/book-access.ts).
  if (!(await visitorIsBookReader())) {
    redirect(`${BOOK.path}?locked=1#reserve`);
  }

  return (
    <>
      <Section variant="offwhite" className="pb-10 pt-14 md:pb-14 md:pt-20">
        <Container>
          <div className="mx-auto flex max-w-2xl items-center gap-6 md:gap-8">
            <BookCover className="w-24 shrink-0 md:w-32" />
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-adi-red">
                Founding readers&rsquo; preview
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-4xl font-semibold md:text-5xl">
                Introduction
              </h1>
              <p className="mt-2 text-muted-foreground">
                {BOOK.title}: {BOOK.subtitle.toLowerCase()}
                <br />
                {BOOK.authors.join(" and ")}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="white" className="pt-12 md:pt-16">
        <Container>
          <article className="mx-auto max-w-2xl">
            <p className="rounded-lg border border-border bg-background px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              This is a preview. The book is still being written, and the
              Introduction may change before it is published. {INTRODUCTION_VERSION}.
            </p>

            <div className="mt-10">
              {INTRODUCTION.map((block, i) => {
                if (block.kind === "heading") {
                  return (
                    <h2
                      key={i}
                      className="mt-14 font-[family-name:var(--font-cormorant)] text-3xl font-semibold md:text-4xl"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.kind === "callout") {
                  return (
                    <p
                      key={i}
                      className="my-10 border-l-2 border-adi-red pl-6 font-[family-name:var(--font-cormorant)] text-2xl font-semibold leading-snug md:text-3xl"
                    >
                      {block.text}
                    </p>
                  );
                }
                return (
                  <p
                    key={i}
                    className="mt-5 text-lg leading-[1.75] text-foreground/85"
                  >
                    {withEmphasis(block.text)}
                  </p>
                );
              })}
            </div>

            <div className="mt-16 rounded-xl bg-adi-black p-8 text-white md:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-adi-red">
                For founding readers
              </p>
              <p className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-semibold">
                Six questions to carry
              </p>
              <ol className="mt-6 space-y-2 text-white/80">
                {BOOK.questions.map((q, i) => (
                  <li key={q} className="flex gap-3">
                    <span className="w-5 shrink-0 text-adi-red">{i + 1}</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
              <Link
                href={BOOK.questionsPath}
                className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-adi-black transition-colors hover:bg-white/90"
              >
                Print the card
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </>
  );
}
