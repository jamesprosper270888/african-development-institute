"use client";

import { useEffect } from "react";
import {
  readAttribution,
  recallAttribution,
  rememberAttribution,
  trackPixel,
} from "@/components/analytics/meta-pixel";
import { EVENT, currentTicketPrice } from "@/lib/event-config";

const FIRED_KEY = "adi_purchase_fired";

/**
 * Fires Purchase (browser pixel + server CAPI, same eventID) exactly once per
 * browser when GHL sends the buyer back with ?paid=1.
 */
export function PurchaseTracker({ paid }: { paid: boolean }) {
  useEffect(() => {
    const fresh = readAttribution();
    rememberAttribution(fresh);
    if (!paid) return;

    try {
      if (sessionStorage.getItem(FIRED_KEY)) return;
      sessionStorage.setItem(FIRED_KEY, "1");
    } catch {
      /* ignore */
    }

    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const attribution = { ...recallAttribution(), ...fresh };

    trackPixel(
      "Purchase",
      {
        value: currentTicketPrice(),
        currency: EVENT.pricing.currency,
        content_name: EVENT.name,
      },
      eventId
    );

    fetch("/api/track/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, attribution }),
      keepalive: true,
    }).catch(() => {});
  }, [paid]);

  return null;
}
