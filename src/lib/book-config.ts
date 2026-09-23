/**
 * Single source of truth for the ADI book (the "Third Way" philosophy).
 * The landing page, the Introduction page, the questions card and the
 * reservation emails all read from here, so a title or bonus change is a
 * one-line edit.
 *
 * Built 21 Sep 2026 from Pam's email "ADI Philosophy - your help": a mock-up
 * cover, a way to read the Introduction on the site, and a way to register
 * interest in the full book. James added the founding-reader bonuses and the
 * QR code for the event on 26 Sep.
 */
export const BOOK = {
  // The Third Way, matching the Introduction's own name for the idea. It was
  // briefly "The Third Space" (21 Sep) on a misremembering; James corrected it
  // on 23 Sep. Avoid "Third Space": it is a London gym chain and an existing
  // self-help book (Adam Fraser, Penguin).
  title: "The Third Way",
  subtitle: "A different quality of seeing",
  authors: ["Pam Rowe", "Marcia Daigo"],
  publisher: "African Development Institute",

  // FALSE: James wants the book kept out of search engines (21 Sep 2026).
  // While false /book is noindex and out of the sitemap, so people arrive by
  // the QR code or a link. The Introduction and questions card are noindex,
  // disallowed in robots.ts AND gated to founding readers (book-access.ts)
  // whatever this says.
  listed: false,

  path: "/book",
  introductionPath: "/book/introduction",
  questionsPath: "/book/questions",

  // A free reservation, deliberately not a paid pre-order: there is no title,
  // price or publication date yet, and taking money for a book with no finish
  // date means refunds and "where is my book" emails for months. When a date
  // and price exist, pre-orders can open to this list first.
  //
  // PENDING Pam and Marcia's sign-off, the founding readers' session most of
  // all, since that one is their time.
  bonuses: [
    {
      title: "The Introduction, today",
      description:
        "Read it the moment you reserve. It sets out the Third Way and the thinking behind the whole book.",
    },
    {
      title: "Six questions to carry",
      description:
        "The questions at the heart of the book on a card you can print, to use on your own experience.",
    },
    {
      title: "A founding readers' session",
      description:
        "A live online session with Pam and Marcia on putting the Third Way into practice, before the book is published.",
    },
    {
      title: "Chapters as they are written",
      description: "Early chapters sent to you as each one is ready.",
    },
    {
      title: "First access when pre-orders open",
      description:
        "You hear before anyone else, with the price and the publication date.",
    },
  ],

  // Straight from the Introduction ("Experience as information"): the six
  // questions the Third Way asks of experience. Their words, not ours.
  questions: [
    "What happened?",
    "What did I make it mean?",
    "What did I learn to do because of it?",
    "What did that response protect?",
    "What belongs to me in this experience, and what belongs to others?",
    "And what is true now?",
  ],
} as const;

export function bookUrl(path: string = BOOK.path): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://africandevelopmentinstitute.com";
  return `${base}${path}`;
}
