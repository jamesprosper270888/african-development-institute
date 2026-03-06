"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005",
});

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
export const getSession = authClient.getSession;

// BetterAuth password methods exist on the proxy at runtime
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const client = authClient as any;
export const forgetPassword: (
  data: { email: string; redirectTo?: string },
  opts?: { onError?: (ctx: { error: { message: string } }) => void; onSuccess?: () => void }
) => Promise<void> = client.forgetPassword;

export const resetPassword: (
  data: { newPassword: string; token: string },
  opts?: { onError?: (ctx: { error: { message: string } }) => void; onSuccess?: () => void }
) => Promise<void> = client.resetPassword;
