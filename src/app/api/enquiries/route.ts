import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/schema";
import { getAdminSession } from "@/lib/api-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allEnquiries = await db.query.enquiries.findMany({
    orderBy: (e, { desc }) => [desc(e.createdAt)],
  });

  return NextResponse.json(allEnquiries);
}
