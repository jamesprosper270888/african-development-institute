"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { BOOK } from "@/lib/book-config";

export function BookReservationForm() {
  const [pending, setPending] = useState(false);
  const [reservedAs, setReservedAs] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();

    try {
      const res = await fetch("/api/book-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.get("email"),
          // Where they came from: /go/book (the QR code) adds ?src=qr, so
          // the room on the 26th can be told apart from everything else.
          source: new URLSearchParams(window.location.search).get("src"),
          [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      setReservedAs(name.split(/\s+/)[0] || name);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  // The gift arrives on the spot, not only by email: someone scanning a QR
  // code in a room should be reading within seconds.
  if (reservedAs) {
    return (
      <div className="space-y-5 text-center">
        <p className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold">
          Thank you, {reservedAs}.
        </p>
        <p className="text-muted-foreground">
          Your copy is reserved and you are one of our founding readers. The
          Introduction is yours to read now, and we have emailed you the link.
        </p>
        <Link
          href={BOOK.introductionPath}
          className="inline-flex h-12 w-full items-center justify-center rounded-md bg-adi-red px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-red/90"
        >
          Read the Introduction
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <HoneypotField />
      <div className="space-y-2">
        <Label htmlFor="book-name">Name</Label>
        <Input
          id="book-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="book-email">Email</Label>
        <Input
          id="book-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full bg-adi-red text-sm font-semibold text-white hover:bg-adi-red/90"
      >
        {pending ? "Reserving..." : "Reserve my copy"}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Free to reserve, nothing to pay now. We will email you the Introduction
        straight away, then write as the book develops and when pre-orders
        open. Ask us to stop at any time. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
