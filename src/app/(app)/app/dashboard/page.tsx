import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const member = await db.query.members.findFirst({
    where: eq(members.userId, session.user.id),
  });

  const pathwayLabels: Record<string, string> = {
    entry: "Entry",
    growth: "Growth",
    leadership: "Leadership",
    legacy: "Legacy",
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    paused: "Paused",
    cancelled: "Cancelled",
    interest: "Interest",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">
          Welcome, {session.user.name}
        </h1>
        <p className="text-muted-foreground">
          Your ADI member dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membership Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member ? (
              <Badge
                variant={
                  member.membershipStatus === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {statusLabels[member.membershipStatus] || member.membershipStatus}
              </Badge>
            ) : (
              <Badge variant="secondary">Not linked</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pathway Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {member
                ? pathwayLabels[member.pathwayStage] || member.pathwayStage
                : "—"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Membership Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {member?.membershipTier || "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {!member && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            Your account has not been linked to a member profile yet. Your admin
            will connect your account shortly.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
