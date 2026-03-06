"use client";

import { useState, useEffect } from "react";
import { AdminGuardClient } from "@/components/app/admin-guard-client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Application = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  organisation: string | null;
  motivation: string;
  status: string;
  cohort: string | null;
  notes: string | null;
  createdAt: string;
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  enquiry: "outline",
  conversation_scheduled: "secondary",
  conversation_complete: "secondary",
  accepted: "default",
  declined: "destructive",
};

export default function LeadershipPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadApplications() {
    const res = await fetch("/api/leadership");
    if (res.ok) {
      setApplications(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function updateApplication(id: string, updates: Record<string, string | null>) {
    await fetch(`/api/leadership/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    loadApplications();
  }

  return (
    <AdminGuardClient>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            Leadership Applications
          </h1>
          <p className="text-muted-foreground">
            {applications.length} application
            {applications.length !== 1 && "s"}
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role / Org</TableHead>
                <TableHead>Motivation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cohort</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No applications yet
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {[app.role, app.organisation].filter(Boolean).join(", ") || "-"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {app.motivation}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(v) => {
                          if (v) updateApplication(app.id, { status: v });
                        }}
                      >
                        <SelectTrigger className="h-8 w-44">
                          <Badge variant={statusColors[app.status] ?? "secondary"}>
                            {app.status.replace(/_/g, " ")}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enquiry">Enquiry</SelectItem>
                          <SelectItem value="conversation_scheduled">
                            Conversation Scheduled
                          </SelectItem>
                          <SelectItem value="conversation_complete">
                            Conversation Complete
                          </SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        className="h-8 w-32"
                        placeholder="e.g. founding-2026"
                        defaultValue={app.cohort ?? ""}
                        onBlur={(e) =>
                          updateApplication(app.id, {
                            cohort: e.target.value || null,
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminGuardClient>
  );
}
