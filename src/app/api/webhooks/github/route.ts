import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendTelegramNotification, escapeHtml } from "@/lib/telegram";

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifySignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(payload);
  const expected = `sha256=${hmac.digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  // Reject if webhook secret is not configured or signature is invalid
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (event === "push") {
    const commits = payload.commits || [];
    const branch = (payload.ref || "").replace("refs/heads/", "");
    const repo = payload.repository?.name || "unknown";

    for (const commit of commits) {
      const author = escapeHtml(commit.author?.username || commit.author?.name || "unknown");
      const message = escapeHtml((commit.message || "").split("\n")[0]);
      const url = escapeHtml(commit.url || "");

      const text = [
        `🔧 <b>NEW COMMIT - ADI</b>`,
        ``,
        `📦 <b>Repo:</b> ${escapeHtml(repo)}`,
        `🌿 <b>Branch:</b> ${escapeHtml(branch)}`,
        `👤 <b>Author:</b> ${author}`,
        ``,
        `💬 ${message}`,
        ``,
        `🔗 <a href="${url}">View Commit</a>`,
      ].join("\n");

      await sendTelegramNotification(text);
    }
  }

  if (event === "pull_request") {
    const action = payload.action;
    const pr = payload.pull_request;
    if (pr && (action === "opened" || action === "closed" || action === "merged")) {
      const title = escapeHtml(pr.title || "");
      const user = escapeHtml(pr.user?.login || "unknown");
      const url = escapeHtml(pr.html_url || "");
      const status = pr.merged ? "merged" : action;

      const text = [
        `🔃 <b>PULL REQUEST ${status.toUpperCase()} - ADI</b>`,
        ``,
        `📦 <b>Title:</b> ${title}`,
        `👤 <b>Author:</b> ${user}`,
        ``,
        `🔗 <a href="${url}">View PR</a>`,
      ].join("\n");

      await sendTelegramNotification(text);
    }
  }

  return NextResponse.json({ ok: true });
}
