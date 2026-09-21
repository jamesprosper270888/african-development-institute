import { NextResponse } from "next/server";
import { BOOK } from "@/lib/book-config";
import { BOOK_READER_COOKIE, isBookReader, readerCookieOptions } from "@/lib/book-access";

/**
 * The link in the reservation email. It proves the visitor is a founding
 * reader, remembers that on this device, and opens the page they asked for.
 * Anyone else is sent to the reserve form, which is free.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("r");
  const to = url.searchParams.get("to") === "questions" ? BOOK.questionsPath : BOOK.introductionPath;

  if (!(await isBookReader(id))) {
    return NextResponse.redirect(new URL(`${BOOK.path}?locked=1#reserve`, url));
  }

  const res = NextResponse.redirect(new URL(to, url));
  res.cookies.set(BOOK_READER_COOKIE, id!, readerCookieOptions);
  return res;
}
