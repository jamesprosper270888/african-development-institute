"use client";

import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta Pixel (browser side). Server-side CAPI lives in src/lib/meta-capi.ts;
 * the two are deduplicated by passing the same eventID to both.
 */
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return null;

  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/** Fire a standard pixel event with an eventID for CAPI dedupe. No-op if pixel absent. */
export function trackPixel(
  event: string,
  params: Record<string, string | number> = {},
  eventID?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", event, params, eventID ? { eventID } : undefined);
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Attribution captured on the landing page and sent with the lead so the
 * server can attach it to CAPI (fbp/fbc) and to the PCM postback (aff_sub).
 */
export type Attribution = {
  fbp?: string;
  fbc?: string;
  pcmClickId?: string;
  src?: string;
  campaign?: string;
  ad?: string;
  landingUrl?: string;
};

export function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const v = q.get(k);
      if (v) return v;
    }
    return undefined;
  };

  // Meta fbclid -> _fbc format if the pixel has not set the cookie yet
  const fbclid = q.get("fbclid");
  const fbc =
    readCookie("_fbc") ||
    (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

  // Only defined keys, so `{ ...remembered, ...readAttribution() }` never
  // wipes a remembered value (e.g. the PCM click id) on a later page.
  return stripUndefined({
    fbp: readCookie("_fbp"),
    fbc,
    pcmClickId: get("aff_sub", "pcm_click", "click_id"),
    src: get("aff_sub2", "sub1", "src", "utm_source"),
    campaign: get("aff_sub3", "sub2", "camp", "utm_campaign"),
    ad: get("aff_sub4", "sub3", "ad", "utm_content", "utm_ad"),
    landingUrl: window.location.href,
  }) as Attribution;
}

const STORAGE_KEY = "adi_attr";

/** Persist attribution on first touch so the thank-you page can reuse it. */
export function rememberAttribution(attr: Attribution) {
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    const merged = {
      ...(existing ? JSON.parse(existing) : {}),
      ...stripUndefined(attr),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* storage unavailable - ignore */
  }
}

export function recallAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")
  ) as Partial<T>;
}
