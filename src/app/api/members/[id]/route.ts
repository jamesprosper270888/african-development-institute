import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/api-auth";

const memberPatchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  email: z.email().max(320).optional(),
  phone: z.string().max(30).nullable().optional(),
  membershipTier: z.enum(["individual", "professional", "organisation"]).nullable().optional(),
  membershipStatus: z.enum(["interest", "active", "paused", "cancelled"]).optional(),
  pathwayStage: z.enum(["entry", "growth", "leadership", "legacy"]).optional(),
  notes: z.string().max(5000).nullable().optional(),
  userId: z.string().max(100).nullable().optional(),
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

  const parsed = memberPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(parsed.data)) {
    if (value !== undefined) {
      updates[field] = value;
    }
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(members)
    .set(updates)
    .where(eq(members.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
