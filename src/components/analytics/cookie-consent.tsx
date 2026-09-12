"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GA4Script } from "./ga4-script";
import { ClarityScript } from "./clarity-script";

/**
 * Cookie consent, and the thing that actually enforces it.
 *
 * GA4 and Clarity are rendered by this component and nowhere else, so they
 * cannot run before someone has said yes. A banner that only announces
 * cookies while the scripts have already loaded is decorative; UK PECR wants
 * non-essential cookies held back until consent, and the ICO is explicit that
 * refusing must be no harder than agreeing. Hence two buttons, same size,
 * refuse listed first.
 *
 * The Meta Pixel is deliberately NOT gated here yet. It is load-bearing for a
 * live campaign's attribution, and switching it off mid-flight would break
 * reporting on money already spent. That is a decision for ADI, not a default.
 */

const STORAGE_KEY = "adi-cookie-consent";

type Choice = "accepted" | "declined";

function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    // Private mode or storage blocked. Treat as undecided rather than
    // assuming consent.
    return null;
  }
}

/** Lets the privacy page reopen the banner. See CookieSettingsButton. */
const REOPEN_EVENT = "adi:cookie-settings";

export function CookieConsent() {
  // undefined means "not read yet", which is the state during server render
  // and first paint. Without it the banner flashes up for everyone who has
  // already chosen, every single page load.
  const [choice, setChoice] = useState<Choice | null | undefined>(undefined);

  useEffect(() => {
    setChoice(readChoice());
    const reopen = () => setChoice(null);
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  function decide(next: Choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable: honour the choice for this visit at least.
    }
    setChoice(next);
  }

  if (choice === undefined) return null;

  return (
    <>
      {choice === "accepted" ? (
        <>
          <GA4Script />
          <ClarityScript />
        </>
      ) : null}

      {choice === null ? (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Cookies on this site"
          className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-lg sm:flex-row sm:items-center sm:gap-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We use a little analytics to see how people find this page and
              where they get stuck, so we can make it better. Nothing runs
              until you say yes, and we never sell anything about you.{" "}
              <Link
                href="/privacy#cookies"
                className="font-semibold text-adi-red underline underline-offset-2"
              >
                How we use cookies
              </Link>
            </p>
            {/* Same height, same weight, refuse first. Refusing has to be as
                easy as agreeing. */}
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide("declined")}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted sm:flex-none"
              >
                No thanks
              </button>
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-adi-green px-5 text-sm font-semibold text-white transition-colors hover:bg-adi-green/90 sm:flex-none"
              >
                Yes, that is fine
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * Put this wherever someone would go looking to change their mind. Consent
 * has to be as easy to withdraw as it was to give, and "clear your browser
 * data" is not that.
 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(REOPEN_EVENT))}
      className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold transition-colors hover:bg-muted"
    >
      Change your cookie choice
    </button>
  );
}
