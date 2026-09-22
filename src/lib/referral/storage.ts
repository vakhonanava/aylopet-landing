import { isValidReferralCode, normalizeReferralCode } from "@/lib/referral/codes";

/**
 * Pending invite code, carried from an `?ref=` link to whichever signup path
 * the friend ends up using. Password signups send it as metadata; Google
 * sign-ins cannot, so AuthProvider claims it after the first session instead.
 */
const STORAGE_KEY = "aylopet-referral";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface StoredReferral {
  code: string;
  savedAt: number;
}

export function storePendingReferral(input: string): void {
  if (!isValidReferralCode(input)) return;
  try {
    const value: StoredReferral = {
      code: normalizeReferralCode(input),
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode or blocked storage · the form field still works.
  }
}

export function readPendingReferral(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as StoredReferral;
    if (Date.now() - value.savedAt > TTL_MS || !isValidReferralCode(value.code)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return value.code;
  } catch {
    return null;
  }
}

export function clearPendingReferral(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Reads `?ref=` from the current URL into storage. */
export function captureReferralFromUrl(): void {
  const ref = new URLSearchParams(window.location.search).get("ref");
  if (ref) storePendingReferral(ref);
}

export function buildInviteLink(origin: string, code: string): string {
  return `${origin}/auth/register?ref=${encodeURIComponent(code)}`;
}
