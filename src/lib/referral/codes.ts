/**
 * Referral codes.
 *
 * Format: `AYLO-XXXXXX` where X is from an unambiguous alphabet (no 0/O, 1/I/L)
 * so a code can be read aloud or copied off a screenshot without transcription
 * errors. The database issues every member's code (generate_referral_code in
 * migration 011); this module only validates and normalizes what users type.
 */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;
export const REFERRAL_PREFIX = "AYLO";

const CODE_RE = new RegExp(`^${REFERRAL_PREFIX}-[${ALPHABET}]{${CODE_LENGTH}}$`);

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
