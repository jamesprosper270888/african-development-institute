import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";

/**
 * Who may read the Introduction. James, 21 Sep 2026: it can be published, but
 * not found by search engines or read by anyone who merely has the link.
 *
 * The key is the reader's own reservation id (a random uuid, so unguessable).
 * Reserving on the site sets it in a cookie straight away; the link in the
 * reservation email sets it on whatever device they open that on. A reader
 * can still forward their personal link, but the plain page URL opens nothing.
 */
export const BOOK_READER_COOKIE = "adi_book_reader";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const readerCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

/** True when `id` is a real book reservation. Anything else is a stranger. */
export async function isBookReader(id: string | undefined | null): Promise<boolean> {
  if (!id || !UUID.test(id)) return false;
  try {
    const [row] = await db
      .select({ id: enquiries.id })
      .from(enquiries)
      .where(and(eq(enquiries.id, id), eq(enquiries.type, "book")))
      .limit(1);
    return Boolean(row);
  } catch (err) {
    // Fail closed: a database blip shows the reserve form, not an error page.
    console.error("[Book] reader check failed:", err);
    return false;
  }
}

/** For the gated pages: does this visitor's cookie belong to a reader? */
export async function visitorIsBookReader(): Promise<boolean> {
  return isBookReader((await cookies()).get(BOOK_READER_COOKIE)?.value);
}
