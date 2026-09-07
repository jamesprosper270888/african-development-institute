import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { verifyStopToken } from "@/lib/event-follow-up";
import { EVENT } from "@/lib/event-config";

export const dynamic = "force-dynamic";

const page = (title: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
 body{margin:0;background:#FAF8F5;color:#1a1a1a;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
      display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
 main{max-width:34rem}
 h1{font-size:1.5rem;margin:0 0 .75rem}
 p{line-height:1.6;color:#4a4540;margin:0 0 1rem}
 a{color:#C8102E}
</style></head>
<body><main><h1>${title}</h1>${body}</main></body></html>`;

/**
 * "Stop these reminders" link from the follow-up emails. Suppresses the
 * sequence only — it does not cancel their seat, and we say so, because
 * people click these in a hurry and then worry.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "";
  const token = searchParams.get("t") ?? "";

  const valid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) &&
    verifyStopToken(id, token);

  if (!valid) {
    return new Response(
      page(
        "That link has expired",
        `<p>We could not match this link to a reservation. If you would like us to stop
          emailing you about ${EVENT.name}, reply to any of our emails with the word
          STOP and we will take care of it.</p>`
      ),
      { status: 400, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  await db
    .update(enquiries)
    .set({ unsubscribedAt: new Date() })
    .where(eq(enquiries.id, id));

  return new Response(
    page(
      "That's done — no more reminders",
      `<p>We will not email you again about ${EVENT.name}.</p>
       <p>Your seat on ${EVENT.dateLong} is still reserved. If you would like to keep it,
          or you would rather we released it, just reply to any of our emails and Pam or
          Marcia will sort it out with you.</p>
       <p><a href="/">African Development Institute</a></p>`
    ),
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}
