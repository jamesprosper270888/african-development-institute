// In-memory rate limiter (sufficient for launch, upgrade to Upstash Redis in Session 2)
const requests = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

export function checkRateLimit(identifier: string): { success: boolean } {
  const now = Date.now();
  const entry = requests.get(identifier);

  if (!entry || now > entry.resetAt) {
    requests.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false };
  }

  entry.count++;
  return { success: true };
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0]!.trim() : "unknown";
}
