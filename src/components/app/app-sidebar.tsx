"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  ShieldCheck,
  MessageSquare,
  GraduationCap,
  BarChart3,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const memberNav = [
  { title: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { title: "Directory", href: "/app/directory", icon: Users },
  { title: "Profile", href: "/app/profile", icon: UserCircle },
];

const adminNav = [
  { title: "Admin Overview", href: "/app/admin", icon: ShieldCheck },
  { title: "Members", href: "/app/admin/members", icon: Users },
  { title: "Enquiries", href: "/app/admin/enquiries", icon: MessageSquare },
  { title: "Leadership", href: "/app/admin/leadership", icon: GraduationCap },
  { title: "Stats", href: "/stats", icon: BarChart3 },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/app/dashboard" className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold text-sidebar-foreground">
            ADI
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Member</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      render={<Link href={item.href} />}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <button
          onClick={() => {
            signOut().then(() => {
              window.location.href = "/login";
            });
          }}
          className="flex w-full items-center gap-2 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
