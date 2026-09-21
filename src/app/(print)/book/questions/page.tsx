import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/book/print-button";
import { BOOK, bookUrl } from "@/lib/book-config";

export const metadata: Metadata = {
  title: `Six questions to carry: ${BOOK.title}`,
  robots: { index: false, follow: false },
};

/**
 * The founding readers' printable card: the six questions the Introduction
 * asks of experience. Sized to print on one A5 or A4 sheet.
 */
export default function QuestionsCardPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 print:max-w-none print:p-0">
      <div className="mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link
          href={BOOK.introductionPath}
          className="text-sm text-muted-foreground underline underline-offset-4"
        >
          Back to the Introduction
        </Link>
        <PrintButton label="Print the card" />
      </div>

      <div
        className="rounded-xl bg-adi-black px-10 py-12 text-white print:rounded-none"
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-adi-red">
          {BOOK.title}
        </p>
        <p className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl font-semibold">
          Six questions to carry
        </p>
        <span className="mt-6 block h-px w-12 bg-adi-red" />
        <ol className="mt-8 space-y-5">
          {BOOK.questions.map((q, i) => (
            <li key={q} className="flex gap-4">
              <span className="w-6 shrink-0 pt-1.5 text-base font-semibold text-adi-red">
                {i + 1}
              </span>
              <span className="font-[family-name:var(--font-cormorant)] text-2xl leading-snug">
                {q}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm leading-relaxed text-white/60">
          From the Introduction to {BOOK.title} by {BOOK.authors.join(" and ")}.
          <br />
          {bookUrl().replace(/^https?:\/\//, "")}
        </p>
      </div>
    </div>
  );
}
