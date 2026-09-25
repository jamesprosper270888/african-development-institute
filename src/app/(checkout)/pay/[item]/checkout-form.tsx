"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import type { PayItem } from "@/lib/stripe";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

/**
 * Stripe's own checkout, inside our page. Stripe runs the card form, the
 * bank's approval step, Apple Pay and Google Pay; we only open the session.
 */
export function CheckoutForm({ item, refId }: { item: PayItem; refId?: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, ref: refId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.clientSecret) setClientSecret(data.clientSecret);
        else setError(data.error ?? "We could not open the payment form. Please try again.");
      })
      .catch(() => {
        if (!cancelled) setError("We could not reach the payment form. Check your connection and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [item, refId]);

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-lg">{error}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          If it keeps happening, email{" "}
          <a className="underline" href="mailto:africandevelopmentinstitute01@gmail.com">
            africandevelopmentinstitute01@gmail.com
          </a>{" "}
          and we will sort it out with you.
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-border bg-card">
        <p className="text-muted-foreground">Opening secure payment…</p>
      </div>
    );
  }

  return (
    // No panel or border of our own: Stripe draws the one white card, and a
    // second edge around it reads as a double line.
    <div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
