import { headers } from "next/headers";
import { auth, isAdmin } from "./auth";

export async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !isAdmin(session.user.email)) {
    return null;
  }
  return session;
}

export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
