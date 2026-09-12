import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { CookieConsent } from "@/components/analytics/cookie-consent";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "African Development Institute",
    template: "%s | African Development Institute",
  },
  description:
    "A values-led developmental organisation for Black people in the UK. Membership, leadership development, and organisational partnerships.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"
  ),
  icons: {
    icon: "/logos/adi-favicon-sm.svg",
    apple: "/logos/adi-favicon-sm.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
        {/* GA4 and Clarity are rendered inside CookieConsent and nowhere
            else, so neither can run before someone has agreed. */}
        <CookieConsent />
        <MetaPixel />
      </body>
    </html>
  );
}
