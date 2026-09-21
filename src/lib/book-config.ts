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
  // WORKING TITLE. The Introduction names the idea "the Third Way" but the
  // book itself has no title yet. Pam and Marcia choose; change it here and
  // the cover, pages and emails all follow.
  title: "The Third Way",
  subtitle: "A different quality of seeing",
  authors: ["Pam Rowe", "Marcia Daigo"],
  publisher: "African Development Institute",

  // FALSE until Pam and Marcia approve the page. While false the pages are
  // noindex and stay out of the sitemap, so only people given the link (or
  // the QR code) can find them. Flip to true and add "/book" to sitemap.ts.
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
