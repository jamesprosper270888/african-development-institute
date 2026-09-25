import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";

/**
 * The frame for pages where someone is paying or has just paid: ADI's logo
 * and nothing to click away to, and a footer with only what these pages owe
 * the reader (who ADI is, and the terms). Used by the (checkout) and
 * (confirmation) route groups, so the URLs themselves never change.
 */
export function FocusedShell({
  secure = false,
  children,
}: {
  /** The /pay pages: "Secure checkout" in the header, the Stripe line in the footer. */
  secure?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-adi-black">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-8">
          <Image
            src="/logos/adi-logo-dark.svg"
            alt="African Development Institute"
            width={758}
            height={74}
            priority
            className="h-6 w-auto md:h-7 lg:h-8"
          />
          {secure ? (
            <p className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Lock className="h-4 w-4" aria-hidden />
              Secure checkout
            </p>
          ) : null}
        </div>
      </header>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground md:px-8">
          {secure ? (
            <p className="mb-2">
              Your payment is processed securely by Stripe. ADI never sees or
              stores your card details.
            </p>
          ) : null}
          <p>
            © {new Date().getFullYear()} African Development Institute. All rights
            reserved. A D Imperative Ltd, Company No. 12467395.
          </p>
          <p className="mt-2">
            <Link href="/terms" className="underline-offset-4 hover:underline">
              Terms
            </Link>
            {"  ·  "}
            <Link href="/privacy" className="underline-offset-4 hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
