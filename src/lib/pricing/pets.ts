/**
 * Pet profile pricing.
 *
 * First dog profile costs FIRST_PET_PRICE_GEL. Each additional dog is an
 * add-on at ADDITIONAL_PET_PRICE_GEL, and additional dogs stay locked until
 * the first profile is paid for.
 */

export const FIRST_PET_PRICE_GEL = 15;
export const ADDITIONAL_PET_PRICE_GEL = 5;

/** Hard cap for now · family sharing (more profiles) is not shipped yet. */
export const MAX_PETS_PER_ACCOUNT = 2;

/** Monthly total for `petCount` profiles on one account. */
export function petPlanTotalGel(petCount: number): number {
  const count = Math.max(0, Math.floor(petCount));
  if (count === 0) return 0;
  return FIRST_PET_PRICE_GEL + (count - 1) * ADDITIONAL_PET_PRICE_GEL;
}

/** Price to add one more profile on top of `currentPetCount` existing ones. */
export function nextPetPriceGel(currentPetCount: number): number {
  return currentPetCount <= 0 ? FIRST_PET_PRICE_GEL : ADDITIONAL_PET_PRICE_GEL;
}

export type AddPetBlockReason = "payment-required" | "limit-reached";

export interface AddPetEligibility {
  allowed: boolean;
  reason?: AddPetBlockReason;
  priceGel: number;
}

/**
 * A second (or later) profile unlocks only after the first one is paid for.
 * The first profile is always allowed · payment is collected on that profile.
 */
export function canAddPet(
  currentPetCount: number,
  hasPaidPlan: boolean,
): AddPetEligibility {
  const count = Math.max(0, Math.floor(currentPetCount));
  const priceGel = nextPetPriceGel(count);

  if (count === 0) return { allowed: true, priceGel };
  if (count >= MAX_PETS_PER_ACCOUNT) {
    return { allowed: false, reason: "limit-reached", priceGel };
  }
  if (!hasPaidPlan) {
    return { allowed: false, reason: "payment-required", priceGel };
  }
  return { allowed: true, priceGel };
}
