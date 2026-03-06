import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth, isAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !isAdmin(session.user.email)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/stats"
              className="font-heading text-lg font-bold"
            >
              ADI Stats
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/app/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/app/admin" className="hover:text-foreground">
              Admin
            </Link>
            <span>{session.user.name}</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
