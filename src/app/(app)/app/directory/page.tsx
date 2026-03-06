import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata = { title: "Member Directory" };

export default async function DirectoryPage() {
  const activeMembers = await db.query.members.findMany({
    where: eq(members.membershipStatus, "active"),
    orderBy: (m, { asc }) => [asc(m.name)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Member Directory</h1>
        <p className="text-muted-foreground">
          {activeMembers.length} active member{activeMembers.length !== 1 && "s"}
        </p>
      </div>

      {activeMembers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            No active members yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <Avatar>
                  <AvatarFallback className="bg-adi-red/10 text-adi-red">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {member.pathwayStage}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
