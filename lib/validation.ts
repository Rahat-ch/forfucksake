import crypto from "crypto";

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,24}$/;

const HMAC_SECRET = process.env.FFS_HMAC_SECRET || "forfuckssake-v1-default-key";
const HMAC_WINDOW_SEC = 300; // 5 min tolerance

const VALID_WORDS = new Set([
  "wtf", "wth", "ffs", "omfg",
  "shit", "shitty", "shittiest",
  "dumbass", "horrible", "awful",
  "pissed off", "pissing off", "piss off",
  "piece of shit", "piece of crap", "piece of junk",
  "what the fuck", "what the hell",
  "fucking broken", "fucking useless", "fucking terrible", "fucking awful", "fucking horrible",
  "fuckin broken", "fuckin useless", "fuckin terrible", "fuckin awful", "fuckin horrible",
  "fuck you",
  "screw this", "screw you",
  "so frustrating", "this sucks", "damn it",
]);

export function validateUsername(username: unknown): string | null {
  if (typeof username !== "string") return null;
  const trimmed = username.trim().toLowerCase();
  return USERNAME_RE.test(trimmed) ? trimmed : null;
}

export function validateBreakdown(breakdown: unknown): Record<string, number> | null {
  if (!breakdown || typeof breakdown !== "object" || Array.isArray(breakdown)) return null;
  const result: Record<string, number> = {};
  for (const [key, val] of Object.entries(breakdown as Record<string, unknown>)) {
    const k = key.toLowerCase();
    if (!VALID_WORDS.has(k)) return null;
    if (typeof val !== "number" || val < 0 || !Number.isInteger(val)) return null;
    result[k] = val;
  }
  return result;
}

export function getTopWord(breakdown: Record<string, number>): string | null {
  let top: string | null = null;
  let max = 0;
  for (const [word, count] of Object.entries(breakdown)) {
    if (count > max) { max = count; top = word; }
  }
  return top;
}

export function sumBreakdown(breakdown: Record<string, number>): number {
  return Object.values(breakdown).reduce((a, b) => a + b, 0);
}

export function generateHmac(username: string, timestamp: number): string {
  return crypto.createHmac("sha256", HMAC_SECRET).update(`${username}:${timestamp}`).digest("hex");
}

export function validateHmac(username: string, timestamp: number, signature: string): boolean {
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > HMAC_WINDOW_SEC) return false;
  const expected = generateHmac(username, timestamp);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// simple in-memory rate limiter
const rateMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerWindow: number, windowSec: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return true;
  }
  if (entry.count >= maxPerWindow) return false;
  entry.count++;
  return true;
}
