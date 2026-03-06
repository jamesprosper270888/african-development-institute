"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LeadershipEnquiryForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leadership-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          roleOrg: data.get("roleOrg"),
          motivation: data.get("motivation"),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      toast.success(
        "Thank you. We'll be in touch to arrange a conversation."
      );
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="roleOrg">Current Role &amp; Organisation</Label>
        <Input
          id="roleOrg"
          name="roleOrg"
          required
          placeholder="e.g. Head of People, Acme Ltd"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">
          What draws you to this programme?
        </Label>
        <Textarea
          id="motivation"
          name="motivation"
          required
          rows={5}
          placeholder="Tell us what's prompting you to explore this work..."
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full bg-adi-red text-sm font-semibold text-white hover:bg-adi-red/90"
      >
        {pending ? "Sending..." : "Request a Conversation"}
      </Button>
    </form>
  );
}
