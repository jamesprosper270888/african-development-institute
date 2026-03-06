const APP_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3002";

export function getSubdomain(host: string | null): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0] ?? host;
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  if (hostname.startsWith("app.")) return "app";
  return null;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
}

export function getMarketingUrl(): string {
  return process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3002";
}
