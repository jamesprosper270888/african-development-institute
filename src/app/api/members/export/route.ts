import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { members } from "@/lib/schema";
import { getAdminSession } from "@/lib/api-auth";

// Prevent CSV formula injection by prefixing dangerous characters
function sanitizeCsvValue(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return `'${value}`;
  }
  return value;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allMembers = await db.query.members.findMany({
    orderBy: (m, { asc }) => [asc(m.name)],
  });

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Tier",
    "Status",
    "Pathway Stage",
    "Joined",
    "Notes",
  ];

  const rows = allMembers.map((m) => [
    sanitizeCsvValue(m.name),
    sanitizeCsvValue(m.email),
    sanitizeCsvValue(m.phone || ""),
    sanitizeCsvValue(m.membershipTier || ""),
    sanitizeCsvValue(m.membershipStatus),
    sanitizeCsvValue(m.pathwayStage),
    m.joinedAt ? new Date(m.joinedAt).toISOString().split("T")[0] : "",
    sanitizeCsvValue((m.notes || "").replace(/"/g, '""')),
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="adi-members-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
