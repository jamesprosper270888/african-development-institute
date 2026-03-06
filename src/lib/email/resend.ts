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

const EMAIL_FROM = process.env.EMAIL_FROM || "ADI <hello@africandevelopmentinstitute.org>";

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
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
  });

  if (error) {
    console.error("[Email] Send failed:", error);
    return { success: false };
  }

  return { success: true };
}
