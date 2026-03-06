import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendEmail } from "./email/resend";
import { VerificationEmail } from "./email/templates/verification-email";
import { ResetPasswordEmail } from "./email/templates/reset-password-email";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3005",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your ADI password",
        react: ResetPasswordEmail({ name: user.name, url }),
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your ADI email address",
        react: VerificationEmail({ name: user.name, url }),
      });
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  advanced: {
    cookiePrefix: "adi",
    crossSubDomainCookies: process.env.BETTER_AUTH_COOKIE_DOMAIN
      ? { enabled: true, domain: process.env.BETTER_AUTH_COOKIE_DOMAIN }
      : undefined,
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "member",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (isAdmin(user.email)) {
            // Auto-set admin role
            await db.execute(
              `UPDATE "user" SET role = 'admin' WHERE id = '${user.id}'`
            );
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
