"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EnquiryType = "general" | "membership" | "organisation";

export function EnquiryForm({
  type = "general",
  showTypeSelector = false,
}: {
  type?: EnquiryType;
  showTypeSelector?: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [selectedType, setSelectedType] = useState<EnquiryType>(type);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          type: selectedType,
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      toast.success("Thank you! We'll be in touch soon.");
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

      {showTypeSelector && (
        <div className="space-y-2">
          <Label htmlFor="type">Enquiry Type</Label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as EnquiryType)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="general">General Enquiry</option>
            <option value="membership">Membership</option>
            <option value="organisation">Organisation Partnership</option>
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us what you're interested in..."
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-adi-red text-white hover:bg-adi-red/90"
      >
        {pending ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}
