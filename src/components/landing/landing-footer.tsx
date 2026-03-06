import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/leadership-programme", label: "Leadership Programme" },
  { href: "/organisations", label: "Organisations" },
  { href: "/contact", label: "Contact" },
];

export function LandingFooter() {
  return (
    <footer className="bg-adi-black py-12 text-white">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <Image
              src="/logos/adi-logo-dark.svg"
              alt="African Development Institute"
              width={160}
              height={47}
              className="mb-4 h-9 w-auto"
            />
            <p className="max-w-sm text-sm text-white/60">
              A values-led developmental organisation for Black people in the UK.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 text-center text-xs text-white/40">
          <p>
            &copy; {new Date().getFullYear()} African Development Institute. All
            rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Link
              href="/terms"
              className="transition-colors hover:text-white/60"
            >
              Terms
            </Link>
            <span>|</span>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white/60"
            >
              Privacy
            </Link>
          </div>
          <p className="mt-2">A D Imperative Ltd. Company No. 12467395.</p>
        </div>
      </div>
    </footer>
  );
}
