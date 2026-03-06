import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { auth, isAdmin } from "@/lib/auth";
import { AppSidebar } from "@/components/app/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userIsAdmin = isAdmin(session.user.email);

  // Set admin cookie for middleware stats check
  if (userIsAdmin) {
    const cookieStore = await cookies();
    cookieStore.set("adi_admin_email", session.user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar isAdmin={userIsAdmin} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">
            {session.user.name}
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
