import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leadershipApplications } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/api-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if ("status" in body) updates.status = body.status;
  if ("cohort" in body) updates.cohort = body.cohort;
  if ("notes" in body) updates.notes = body.notes;

  const [updated] = await db
    .update(leadershipApplications)
    .set(updates)
    .where(eq(leadershipApplications.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
