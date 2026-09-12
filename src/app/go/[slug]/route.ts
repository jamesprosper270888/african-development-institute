import { NextResponse } from "next/server";
import { eventPath } from "@/lib/event-config";

/**
 * Short, ADI-branded links for the organic posts.
 *
 * Pam and Marcia post these on ADI's own LinkedIn, Facebook page and group.
 * Handing them a prospectconnectmedia.com link put James's media-buying
 * agency domain on ADI's posts, which reads oddly to their audience and is
 * exactly the kind of unfamiliar redirect domain the platforms downrank.
 * Neither Facebook nor LinkedIn hides a destination for you: the preview card
 * shows the real domain, so the only way to fix it is to own the first hop.
 *
 * Tracking is untouched. These 302 to the same PCM links as before, which set
 * the click id and forward to the event page, so attribution is identical.
 * One extra hop, and the reader sees africandevelopmentinstitute.com.
 */

const PCM = "https://prospectconnectmedia.com/r/adi-yana";

function pcm(src: string, ad: string): string {
  return `${PCM}?src=${src}&camp=yana-sep26&ad=${ad}`;
}

const LINKS: Record<string, string> = {
  // Wave one: the early bird closing. Now until Sunday night.
  li: pcm("linkedin-organic", "li-earlybird"),
  fb: pcm("fb-organic", "fb-earlybird"),
  grp: pcm("fbgroup-organic", "grp-earlybird"),
  // Wave two: bring someone who gets it. Monday onwards.
  li2: pcm("linkedin-organic", "li-bringsomeone"),
  fb2: pcm("fb-organic", "fb-bringsomeone"),
  grp2: pcm("fbgroup-organic", "grp-bringsomeone"),
};

// Never cached. A stale redirect would be harmless here, since every slug
// points at a fixed URL, but a tracking link is not where you want to find
// out you were wrong about that.
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const target = LINKS[slug.toLowerCase()];

  // An unknown slug means a typo in a post that is already published and
  // cannot be edited everywhere. Send the reader to the event page rather
  // than a 404: a lost attribution costs a line in a report, a lost reader
  // costs a seat.
  const fallback = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://africandevelopmentinstitute.com"}${eventPath()}`;

  return NextResponse.redirect(target ?? fallback, 302);
}
