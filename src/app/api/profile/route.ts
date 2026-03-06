import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { members, user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getAuthSession } from "@/lib/api-auth";

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await db.query.members.findFirst({
    where: eq(members.userId, session.user.id),
  });

  if (!member) {
    return NextResponse.json({
      name: session.user.name,
      email: session.user.email,
      phone: null,
    });
  }

  return NextResponse.json({
    name: member.name,
    email: member.email,
    phone: member.phone,
  });
}

export async function PATCH(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, phone } = body;

  // Update the member record if linked
  const member = await db.query.members.findFirst({
    where: eq(members.userId, session.user.id),
  });

  if (member) {
    await db
      .update(members)
      .set({
        name: name || member.name,
        phone: phone ?? member.phone,
        updatedAt: new Date(),
      })
      .where(eq(members.id, member.id));
  }

  // Also update the auth user name
  if (name) {
    await db
      .update(user)
      .set({ name, updatedAt: new Date() })
      .where(eq(user.id, session.user.id));
  }

  return NextResponse.json({ success: true });
}
