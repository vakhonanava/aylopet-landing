import type { SupabaseClient } from "@supabase/supabase-js";

export interface ReferralSummary {
  code: string | null;
  /** Invited members who confirmed their email · these earned points. */
  completed: number;
  /** Signed up with the code but not confirmed yet. */
  pending: number;
  earnedPoints: number;
  pointsPerInvite: number;
  /** Position in joining order · 1 is the first member ever. */
  ambassadorNumber: number;
}

interface SummaryRow {
  code: string | null;
  completed: number;
  pending: number;
  earned_points: number;
  points_per_invite: number;
  ambassador_number: number;
}

/** Reads the signed-in member's own numbers (migration 011). */
export async function fetchReferralSummary(
  supabase: SupabaseClient,
): Promise<ReferralSummary | null> {
  const { data, error } = await supabase.rpc("get_my_referral_summary");
  if (error || !data) return null;
  const row = data as SummaryRow;
  return {
    code: row.code,
    completed: Number(row.completed) || 0,
    pending: Number(row.pending) || 0,
    earnedPoints: Number(row.earned_points) || 0,
    pointsPerInvite: Number(row.points_per_invite) || 0,
    ambassadorNumber: Number(row.ambassador_number) || 0,
  };
}

/** Attaches a stored invite code to a brand-new account (OAuth path). */
export async function claimReferral(
  supabase: SupabaseClient,
  code: string,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("claim_referral", { p_code: code });
  return !error && data === true;
}
