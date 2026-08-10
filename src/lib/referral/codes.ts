/**
 * Referral codes.
 *
 * Format: `AYLO-XXXXXX` where X is from an unambiguous alphabet (no 0/O, 1/I/L)
 * so a code can be read aloud or copied off a screenshot without transcription
 * errors. Codes are generated client-side on signup and stored on `profiles`;
 * the unique index in migration 009 is what actually guarantees uniqueness, so
 * a collision surfaces as an insert error rather than a silent duplicate.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
export const REFERRAL_PREFIX = "AYLO";

const CODE_RE = new RegExp(`^${REFERRAL_PREFIX}-[${ALPHABET}]{${CODE_LENGTH}}$`);

export function generateReferralCode(): string {
  const bytes =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint8Array(CODE_LENGTH))
      : Uint8Array.from({ length: CODE_LENGTH }, () =>
          Math.floor(Math.random() * 256),
        );

  let body = "";
  for (const byte of bytes) body += ALPHABET[byte % ALPHABET.length];
  return `${REFERRAL_PREFIX}-${body}`;
}

/** Uppercases and re-inserts the dash so users can type `aylo9k2m4p`. */
export function normalizeReferralCode(input: string): string {
  const cleaned = input.trim().toUpperCase().replace(/[\s-]+/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith(REFERRAL_PREFIX)) {
    return `${REFERRAL_PREFIX}-${cleaned.slice(REFERRAL_PREFIX.length)}`;
  }
  return `${REFERRAL_PREFIX}-${cleaned}`;
}

export function isValidReferralCode(input: string): boolean {
  return CODE_RE.test(normalizeReferralCode(input));
}
