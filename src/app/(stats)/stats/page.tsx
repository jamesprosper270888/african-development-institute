import { db } from "@/lib/db";
import { members, enquiries, leadershipApplications } from "@/lib/schema";
import { eq, count, gte, sql } from "drizzle-orm";
import { StatCard } from "@/components/stats/stat-card";
import { EnquiryFeed } from "@/components/stats/enquiry-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Stats Dashboard" };

export default async function StatsPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalMembers,
    activeMembers,
    monthlyMembers,
    annualMembers,
    entryStage,
    growthStage,
    leadershipStage,
    legacyStage,
    enquiries7d,
    enquiries30d,
    totalEnquiries,
    convertedEnquiries,
    leadershipByStatus,
    recentEnquiries,
  ] = await Promise.all([
    db.select({ count: count() }).from(members),
    db.select({ count: count() }).from(members).where(eq(members.membershipStatus, "active")),
    db.select({ count: count() }).from(members).where(eq(members.membershipTier, "monthly")),
    db.select({ count: count() }).from(members).where(eq(members.membershipTier, "annual")),
    db.select({ count: count() }).from(members).where(eq(members.pathwayStage, "entry")),
    db.select({ count: count() }).from(members).where(eq(members.pathwayStage, "growth")),
    db.select({ count: count() }).from(members).where(eq(members.pathwayStage, "leadership")),
    db.select({ count: count() }).from(members).where(eq(members.pathwayStage, "legacy")),
    db.select({ count: count() }).from(enquiries).where(gte(enquiries.createdAt, sevenDaysAgo)),
    db.select({ count: count() }).from(enquiries).where(gte(enquiries.createdAt, thirtyDaysAgo)),
    db.select({ count: count() }).from(enquiries),
    db.select({ count: count() }).from(enquiries).where(eq(enquiries.status, "converted")),
    db
      .select({ status: leadershipApplications.status, count: count() })
      .from(leadershipApplications)
      .groupBy(leadershipApplications.status),
    db.query.enquiries.findMany({
      orderBy: (e, { desc }) => [desc(e.createdAt)],
      limit: 10,
    }),
  ]);

  const conversionRate =
    totalEnquiries[0].count > 0
      ? Math.round((convertedEnquiries[0].count / totalEnquiries[0].count) * 100)
      : 0;

  const pathwayData = [
    { label: "Entry", value: entryStage[0].count },
    { label: "Growth", value: growthStage[0].count },
    { label: "Leadership", value: leadershipStage[0].count },
    { label: "Legacy", value: legacyStage[0].count },
  ];

  const maxPathway = Math.max(...pathwayData.map((d) => d.value), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Stats Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of ADI membership and engagement
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={totalMembers[0].count} />
        <StatCard title="Active Members" value={activeMembers[0].count} />
        <StatCard
          title="Enquiries (7d)"
          value={enquiries7d[0].count}
          subtitle={`${enquiries30d[0].count} in 30 days`}
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtitle="Enquiry to member"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Members by Tier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Monthly</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 rounded bg-adi-red"
                  style={{
                    width: `${Math.max((monthlyMembers[0].count / Math.max(monthlyMembers[0].count + annualMembers[0].count, 1)) * 200, 4)}px`,
                  }}
                />
                <span className="text-sm font-medium">
                  {monthlyMembers[0].count}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Annual</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 rounded bg-adi-green"
                  style={{
                    width: `${Math.max((annualMembers[0].count / Math.max(monthlyMembers[0].count + annualMembers[0].count, 1)) * 200, 4)}px`,
                  }}
                />
                <span className="text-sm font-medium">
                  {annualMembers[0].count}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pathway Stages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pathwayData.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <span className="text-sm">{d.label}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 rounded bg-adi-red/70"
                    style={{
                      width: `${Math.max((d.value / maxPathway) * 200, 4)}px`,
                    }}
                  />
                  <span className="text-sm font-medium">{d.value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leadership Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            {leadershipByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet</p>
            ) : (
              <div className="space-y-3">
                {leadershipByStatus.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm capitalize">
                      {s.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <EnquiryFeed enquiries={recentEnquiries} />
      </div>
    </div>
  );
}
