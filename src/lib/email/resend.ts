import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (resendClient) return resendClient;
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — emails will be logged to console");
    return null;
  }
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const EMAIL_FROM = process.env.EMAIL_FROM || "ADI <hello@africandevelopmentinstitute.com>";

/**
 * Who receives internal notifications (new enquiry, seat reserved, ticket paid).
 * NOTIFY_EMAILS = comma-separated list; falls back to the EMAIL_FROM mailbox.
 */
export function internalRecipients(): string[] {
  const list = (process.env.NOTIFY_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length) return list;
  return [
    process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] ||
      "hello@africandevelopmentinstitute.com",
  ];
}

export async function sendEmail({
  to,
  subject,
  react,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  replyTo?: string;
}): Promise<{ success: boolean }> {
  const resend = getResend();

  if (!resend) {
    console.log(`[Email] To: ${to}, Subject: ${subject}`);
    return { success: true };
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    console.error("[Email] Send failed:", error);
    return { success: false };
  }

  return { success: true };
}
