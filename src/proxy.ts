import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|css|js|map)$/.test(
      pathname
    )
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Allow public auth paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow API routes (except stats-related ones)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/stats")) {
    return NextResponse.next();
  }

  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1";

  // Determine routing context
  let context: "marketing" | "app" | "stats" = "marketing";

  if (isLocalhost) {
    // Path-based routing on localhost
    if (pathname.startsWith("/app")) context = "app";
    else if (pathname.startsWith("/stats")) context = "stats";
  } else {
    // Subdomain-based routing on production
    if (hostname.startsWith("app.")) context = "app";
    else if (hostname.startsWith("stats.")) context = "stats";
  }

  // Marketing routes — no auth needed
  if (context === "marketing") {
    return NextResponse.next();
  }

  // App routes — require session
  if (context === "app") {
    const sessionToken =
      request.cookies.get("adi.session_token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Stats routes — require admin
  if (context === "stats") {
    const adminEmail = request.cookies.get("adi_admin_email")?.value;
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
