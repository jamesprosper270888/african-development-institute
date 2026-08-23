"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  readAttribution,
  rememberAttribution,
  recallAttribution,
  trackPixel,
  type Attribution,
} from "@/components/analytics/meta-pixel";

/**
 * "Reserve your seat" form. Free for everyone to submit; it is the Meta Lead
 * event. Guests are sent to the thank-you page to pay; members are confirmed
 * and verified by the team from the Google Sheet.
 */
export function EventRegistrationForm({
  event,
  thankYouPath,
}: {
  event: string;
  thankYouPath: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const attribution = useRef<Attribution>({});

  useEffect(() => {
    const fresh = readAttribution();
    rememberAttribution(fresh);
    attribution.current = { ...recallAttribution(), ...fresh };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const isMember = data.get("isMember") === "on";
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Refresh cookie-based ids right before send (pixel may have set _fbp by now)
    attribution.current = { ...attribution.current, ...readAttribution() };

    try {
      const res = await fetch("/api/event-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          isMember,
          event,
          eventId,
          attribution: attribution.current,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      trackPixel("Lead", { content_name: event }, eventId);

      const params = new URLSearchParams();
      if (isMember) params.set("member", "1");
      params.set("n", String(data.get("name") ?? "").split(" ")[0] ?? "");
      router.push(`${thankYouPath}?${params.toString()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Mobile number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="07xxx xxxxxx"
        />
        <p className="text-xs text-muted-foreground">
          So we can confirm your seat. No marketing calls.
        </p>
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="isMember"
          className="mt-1 h-4 w-4 accent-adi-green"
        />
        <span className="text-muted-foreground">
          I am an ADI member (members attend free)
        </span>
      </label>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full bg-adi-red text-sm font-semibold text-white hover:bg-adi-red/90"
      >
        {pending ? "Reserving your seat..." : "Reserve my seat"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Reserving is free and takes 20 seconds. You will then be able to secure
        your seat with the early-bird ticket.
      </p>
    </form>
  );
}
