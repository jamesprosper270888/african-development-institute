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

type Enquiry = {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  sourcePage: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  in_conversation: "outline",
  converted: "default",
  closed: "destructive",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEnquiries() {
    const res = await fetch("/api/enquiries");
    if (res.ok) {
      setEnquiries(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadEnquiries();
  }

  return (
    <AdminGuardClient>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Enquiries</h1>
          <p className="text-muted-foreground">
            {enquiries.length} total enquir{enquiries.length !== 1 ? "ies" : "y"}
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : enquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No enquiries yet
                  </TableCell>
                </TableRow>
              ) : (
                enquiries.map((enq) => (
                  <TableRow key={enq.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{enq.name}</TableCell>
                    <TableCell>{enq.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {enq.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {enq.message}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={enq.status}
                        onValueChange={(v) => {
                          if (v) updateStatus(enq.id, v);
                        }}
                      >
                        <SelectTrigger className="h-8 w-36">
                          <Badge variant={statusColors[enq.status] ?? "secondary"}>
                            {enq.status.replace("_", " ")}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="in_conversation">In Conversation</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
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
