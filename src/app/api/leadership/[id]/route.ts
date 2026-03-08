import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { leadershipApplications } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/api-auth";

const leadershipPatchSchema = z.object({
  status: z.enum(["enquiry", "in_progress", "accepted", "declined", "archived"]).optional(),
  cohort: z.string().max(100).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

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
  const parsed = leadershipPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.cohort !== undefined) updates.cohort = parsed.data.cohort;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

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
