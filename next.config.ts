import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@react-email/components",
    ],
  },
  async redirects() {
    return [
      {
        source: "/events/the-journey-within",
        destination: "/events/you-are-not-alone",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://connect.facebook.net https://js.stripe.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://www.facebook.com https://connect.facebook.net https://api.stripe.com https://checkout.stripe.com https://merchant-ui-api.stripe.com",
              // 'self', not 'none': withBotId marks its own challenge path as
              // frameable by this site only (X-Frame-Options SAMEORIGIN,
              // frame-ancestors 'self'), and 'none' would block that frame
              // too, failing real visitors. Outside sites still cannot frame us.
              // Stripe's embedded checkout (/pay) and the bank approval
              // (3-D Secure) screens it opens.
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withBotId(nextConfig);
