import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { getAdminSession } from "@/lib/api-auth";

const memberCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email().max(320),
  phone: z.string().max(30).nullable().optional(),
  membershipTier: z.enum(["individual", "professional", "organisation"]).nullable().optional(),
  membershipStatus: z.enum(["interest", "active", "paused", "cancelled"]).optional(),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allMembers = await db.query.members.findMany({
    orderBy: (m, { desc }) => [desc(m.createdAt)],
  });

  return NextResponse.json(allMembers);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = memberCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
  }

  const { name, email, phone, membershipTier, membershipStatus } = parsed.data;

  const [member] = await db
    .insert(members)
    .values({
      name,
      email,
      phone: phone || null,
      membershipTier: membershipTier || null,
      membershipStatus: membershipStatus || "interest",
      joinedAt:
        membershipStatus === "active" ? new Date() : null,
    })
    .returning();

  return NextResponse.json(member, { status: 201 });
}
