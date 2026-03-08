import { redirect } from "next/navigation";
import { headers } from "next/headers";
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
