import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/stats/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
