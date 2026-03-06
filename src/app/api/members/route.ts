import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { getAdminSession } from "@/lib/api-auth";

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
  const { name, email, phone, membershipTier, membershipStatus } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

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
