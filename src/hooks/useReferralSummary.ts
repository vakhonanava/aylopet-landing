"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { fetchReferralSummary, type ReferralSummary } from "@/lib/referral/summary";
import { createClient } from "@/utils/supabase/client";

/** The signed-in member's invite code and counts · null until loaded or signed out. */
export function useReferralSummary(): ReferralSummary | null {
  const { user } = useAuth();
  const userId = user?.id;
  const [summary, setSummary] = useState<ReferralSummary | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    let supabase;
    try {
      supabase = createClient();
    } catch {
      return;
    }
    void fetchReferralSummary(supabase).then((result) => {
      if (!cancelled) setSummary(result);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return userId ? summary : null;
}
