import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The book's reader pages are for founding readers only (they are also
      // noindex and gated; this just stops well-behaved crawlers knocking).
      disallow: ["/app/", "/stats/", "/api/", "/book/introduction", "/book/questions"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
