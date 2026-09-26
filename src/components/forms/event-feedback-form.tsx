"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import {
  FEEDBACK_QUESTIONS,
  PHOTO_PERMISSION,
  PUBLISH_PERMISSION,
} from "@/lib/event-feedback";

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/**
 * Feedback from people who came to the day. The two permission questions are
 * required and have no default on purpose: a pre-ticked "yes, use my name"
 * is not consent, so each person has to choose.
 */
export function EventFeedbackForm() {
  const [pending, setPending] = useState(false);
  const [rating, setRating] = useState(0);
  const [doneFor, setDoneFor] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();

    try {
      const res = await fetch("/api/event-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: data.get("email"),
          rating: Number(data.get("rating")),
          valuable: data.get("valuable"),
          adviceToOthers: data.get("adviceToOthers"),
          improve: data.get("improve"),
          publish: data.get("publish"),
          photos: data.get("photos"),
          [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD),
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      setDoneFor(name.split(/\s+/)[0] || name);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  if (doneFor) {
    return (
      <div role="status" className="space-y-5 text-center">
        <p className="font-[family-name:var(--font-cormorant)] text-4xl font-semibold">
          Thank you, {doneFor}.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Pam and Marcia will read every word of this themselves. Thank you for
          being in the room, and for taking the time to tell us about it.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          You are not alone, and you do not have to wait for the next one to
          stay connected.
        </p>
        <Link
          href="/membership"
          className="inline-flex h-12 items-center justify-center rounded-md bg-adi-green px-8 text-sm font-semibold text-white transition-colors hover:bg-adi-green/90"
        >
          See ADI membership
        </Link>
      </div>
    );
  }

  const radioRow =
    "flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 text-base transition-colors has-[:checked]:border-adi-green has-[:checked]:bg-adi-green/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-adi-green/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <HoneypotField />

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fb-name" className="text-base">
            Name
          </Label>
          <Input
            id="fb-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="h-12 px-4 text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fb-email" className="text-base">
            Email
          </Label>
          <Input
            id="fb-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby="fb-email-hint"
            className="h-12 px-4 text-base"
          />
          <p id="fb-email-hint" className="text-sm text-muted-foreground">
            The one you booked with, if you can. It is never published.
          </p>
        </div>
      </div>

      {/* Real radio inputs, visually hidden but still focusable, so the stars
          work with a keyboard (arrow keys move between them) and a screen
          reader hears "3 out of 5" rather than five unlabelled icons. */}
      <fieldset>
        <legend className="text-base font-medium">
          How would you rate the day overall?
        </legend>
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-adi-green/50"
            >
              <input
                type="radio"
                name="rating"
                value={n}
                required
                className="sr-only"
                onChange={() => setRating(n)}
              />
              <span className="sr-only">
                {n} out of 5, {RATING_WORDS[n]}
              </span>
              <Star
                aria-hidden
                className={`h-9 w-9 transition-colors ${n <= rating ? "fill-adi-red text-adi-red" : "text-muted-foreground/50"}`}
              />
            </label>
          ))}
          <span className="ml-3 text-sm text-muted-foreground" aria-hidden>
            {rating ? RATING_WORDS[rating] : ""}
          </span>
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="fb-valuable" className="text-base">
          {FEEDBACK_QUESTIONS.valuable}
        </Label>
        <Textarea
          id="fb-valuable"
          name="valuable"
          required
          rows={4}
          maxLength={4000}
          className="min-h-28 px-4 py-3 text-base md:text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fb-advice" className="text-base">
          {FEEDBACK_QUESTIONS.adviceToOthers}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="fb-advice"
          name="adviceToOthers"
          rows={3}
          maxLength={4000}
          className="min-h-24 px-4 py-3 text-base md:text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fb-improve" className="text-base">
          {FEEDBACK_QUESTIONS.improve}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="fb-improve"
          name="improve"
          rows={3}
          maxLength={4000}
          className="min-h-24 px-4 py-3 text-base md:text-base"
        />
      </div>

      <fieldset>
        <legend className="text-base font-medium">
          May we share what you have written?
        </legend>
        <p className="mt-1 text-sm text-muted-foreground">
          For example on our website or in posts about the next gathering.
          Your email address is never shared.
        </p>
        <div className="mt-3 space-y-3">
          {Object.entries(PUBLISH_PERMISSION).map(([value, label]) => (
            <label key={value} className={radioRow}>
              <input
                type="radio"
                name="publish"
                value={value}
                required
                className="mt-1 h-5 w-5 shrink-0 accent-adi-green"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-base font-medium">Photos from the day</legend>
        <div className="mt-3 space-y-3">
          {Object.entries(PHOTO_PERMISSION).map(([value, label]) => (
            <label key={value} className={radioRow}>
              <input
                type="radio"
                name="photos"
                value={value}
                required
                className="mt-1 h-5 w-5 shrink-0 accent-adi-green"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full bg-adi-red text-sm font-semibold text-white hover:bg-adi-red/90"
      >
        {pending ? "Sending..." : "Send my feedback"}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        You can change your mind about either permission at any time: just
        reply to any email from us. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
