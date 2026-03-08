import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/api-auth";

const enquiryPatchSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved", "archived"]).optional(),
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
  const parsed = enquiryPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.notes !== undefined) updates.notes = parsed.data.notes;

  const [updated] = await db
    .update(enquiries)
    .set(updates)
    .where(eq(enquiries.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
