import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadershipApplications } from "@/lib/schema";
import { getAdminSession } from "@/lib/api-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allApps = await db.query.leadershipApplications.findMany({
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  return NextResponse.json(allApps);
}
