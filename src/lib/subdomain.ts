const APP_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3005";

export function getSubdomain(host: string | null): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0] ?? host;
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  if (hostname.startsWith("app.")) return "app";
  if (hostname.startsWith("stats.")) return "stats";
  return null;
}

export function isStatsSubdomain(host: string | null): boolean {
  return getSubdomain(host) === "stats";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005";
}

export function getMarketingUrl(): string {
  return process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3005";
}

export function getStatsUrl(): string {
  return process.env.NEXT_PUBLIC_STATS_URL || "http://localhost:3005/stats";
}
