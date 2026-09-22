"use client";

import { useEffect } from "react";
import { captureReferralFromUrl } from "@/lib/referral/storage";

/**
 * Remembers an `?ref=AYLO-XXXXXX` invite from whatever page the friend lands
 * on, so it survives browsing, the onboarding flow and a Google round-trip.
 */
export function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);
  return null;
}
