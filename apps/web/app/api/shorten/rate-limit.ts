// Simple in-memory rate limiter for demo
// In production, use Redis or similar

const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number }
>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP

export function getRateLimitKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
  return ip;
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export function getRemainingRequests(key: string): number {
  const record = rateLimitStore.get(key);
  if (!record || Date.now() > record.resetTime) {
    return MAX_REQUESTS;
  }
  return Math.max(0, MAX_REQUESTS - record.count);
}

export function getResetTime(key: string): number {
  const record = rateLimitStore.get(key);
  if (!record) {
    return Date.now() + RATE_LIMIT_WINDOW;
  }
  return record.resetTime;
}
