"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { HONEYPOT_FIELD } from "@/lib/honeypot";

/**
 * "Tell me when the next one is on." Replaces the reservation form on the
 * event page once the day is over. Nothing is booked or paid here: it adds
 * the person to the list Pam and Marcia email first when the date is set.
 */
export function EventInterestForm({ eventName }: { eventName: string }) {
  const [pending, setPending] = useState(false);
  const [doneFor, setDoneFor] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();

    try {
      const res = await fetch("/api/event-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.get("email"),
          phone: data.get("phone"),
          [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      setDoneFor(name.split(/\s+/)[0] || name);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (doneFor) {
    return (
      <div role="status" className="space-y-3 text-center">
        <p className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold">
          Thank you, {doneFor}.
        </p>
        <p className="text-muted-foreground">
          You are on the list for {eventName}. We will email you as soon as
          the date is set.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <HoneypotField />
      {/* Sized like the reservation form it replaces: most of this traffic
          is on a phone. */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="interest-name" className="text-base">
            Name
          </Label>
          <Input
            id="interest-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="h-12 px-4 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interest-email" className="text-base">
            Email
          </Label>
          <Input
            id="interest-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 px-4 text-base"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="interest-phone" className="text-base">
          Mobile number{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="interest-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="07xxx xxxxxx"
          className="h-12 px-4 text-base"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full bg-adi-red text-sm font-semibold text-white hover:bg-adi-red/90"
      >
        {pending ? "Adding you to the list..." : "Tell me when it is on"}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Nothing to pay and nothing booked. We will only write to you about{" "}
        {eventName}. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
