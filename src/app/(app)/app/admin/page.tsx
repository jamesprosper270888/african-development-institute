import { AdminGuard } from "@/components/app/admin-guard";
import { db } from "@/lib/db";
import { members, enquiries, leadershipApplications } from "@/lib/schema";
import { eq, count, sql, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata = { title: "Admin Overview" };

export default async function AdminPage() {
  const [
    totalMembers,
    activeMembers,
    newEnquiries,
    pendingLeadership,
  ] = await Promise.all([
    db.select({ count: count() }).from(members),
    db
      .select({ count: count() })
      .from(members)
      .where(eq(members.membershipStatus, "active")),
    db
      .select({ count: count() })
      .from(enquiries)
      .where(eq(enquiries.status, "new")),
    db
      .select({ count: count() })
      .from(leadershipApplications)
      .where(eq(leadershipApplications.status, "enquiry")),
  ]);

  const stats = [
    {
      title: "Total Members",
      value: totalMembers[0].count,
      href: "/app/admin/members",
    },
    {
      title: "Active Members",
      value: activeMembers[0].count,
      href: "/app/admin/members",
    },
    {
      title: "New Enquiries",
      value: newEnquiries[0].count,
      href: "/app/admin/enquiries",
    },
    {
      title: "Pending Leadership",
      value: pendingLeadership[0].count,
      href: "/app/admin/leadership",
    },
  ];

  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground">Quick stats and navigation</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}
