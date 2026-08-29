import { z } from "zod";

// URL validation schema
export const urlSchema = z
  .string()
  .url("Invalid URL")
  .max(2048, "URL is too long");

// Slug validation schema
export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(20, "Slug must be at most 20 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
  .toLowerCase();

// Expiration time options (in minutes)
export const EXPIRATION_OPTIONS = {
  TEN_MINUTES: 10,
  ONE_HOUR: 60,
  ONE_DAY: 24 * 60,
  SEVEN_DAYS: 7 * 24 * 60,
  THIRTY_DAYS: 30 * 24 * 60,
  NEVER: null,
} as const;

export const expirationLabels = {
  [EXPIRATION_OPTIONS.TEN_MINUTES]: "10 minutes",
  [EXPIRATION_OPTIONS.ONE_HOUR]: "1 hour",
  [EXPIRATION_OPTIONS.ONE_DAY]: "1 day",
  [EXPIRATION_OPTIONS.SEVEN_DAYS]: "7 days",
  [EXPIRATION_OPTIONS.THIRTY_DAYS]: "30 days",
  [EXPIRATION_OPTIONS.NEVER]: "Never",
} as const;

/**
 * Calculate expiration date from expiration option (in minutes)
 * Returns null if NEVER option is selected
 */
export function calculateExpiration(minutesFromNow: number | null): Date | null {
  if (minutesFromNow === null) {
    return null;
  }
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
}

/**
 * Check if a link has expired
 * Returns true if link is expired, false if it's still valid
 */
export function isLinkExpired(expiresAt: Date | null): boolean {
  if (expiresAt === null) {
    return false; // Never expires
  }
  return expiresAt < new Date();
}

/**
 * Generate a random slug for URL shortening
 */
export function generateSlug(length: number = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
