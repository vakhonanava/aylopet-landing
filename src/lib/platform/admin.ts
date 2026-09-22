import { createSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  PRODUCT_INTEREST_LABELS,
  type ProductInterest,
} from "@/lib/leads/types";
import { getLeadStorageMode as getBlobOrFileMode } from "@/lib/leads/blob-storage";

export interface PlatformSignupRow {
  id: string;
  created_at: string;
  owner_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  expectations: string[];
  consent: boolean;
  source: string;
  user_id: string | null;
  dog_name: string | null;
  breed: string | null;
  primary_goal: string | null;
  is_neutered: boolean | null;
  weight: number | null;
  weight_unit: string | null;
  file_count: number;
}

export type LeadStorageMode = "supabase" | "blob" | "file";

export function getLeadStorageMode(): LeadStorageMode {
  if (isSupabaseConfigured()) return "supabase";
  return getBlobOrFileMode();
}

export async function getPlatformSignupCount(): Promise<number> {
  if (!isSupabaseConfigured()) {
    const { getLeadCount: legacyCount } = await import("@/lib/leads/repository");
    return legacyCount();
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("get_waitlist_count");
  if (error) return 0;
  return Number(data ?? 0);
}

export async function getAllPlatformSignups(): Promise<PlatformSignupRow[]> {
  if (!isSupabaseConfigured()) {
    const { getAllLeads } = await import("@/lib/leads/repository");
    const legacy = await getAllLeads();
    return legacy.map((lead, index) => ({
      id: lead.id,
      created_at: lead.createdAt,
      owner_name: lead.ownerName,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
      expectations: lead.productInterests ?? [],
      consent: lead.consent,
      source: "legacy_early_adopter",
      user_id: null,
      dog_name: lead.dogName,
      breed: lead.breed,
      primary_goal: lead.primaryGoal,
      is_neutered: lead.neutered,
      weight: lead.weightKg,
      weight_unit: "kg",
      file_count: 0,
    }));
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_signups_overview")
    .select("*");

  if (error) {
    // Fallback if view not migrated yet
    const { data: waitlist } = await supabase
      .from("waitlist")
      .select("*")
      .order("created_at", { ascending: false });
    return (waitlist ?? []) as unknown as PlatformSignupRow[];
  }

  return (data ?? []) as PlatformSignupRow[];
}

export interface ReferralRow {
  id: string;
  code: string;
  status: "pending" | "completed";
  points_awarded: number;
  created_at: string;
  completed_at: string | null;
  referrer: { full_name: string | null; email: string | null } | null;
  referred: { full_name: string | null; email: string | null } | null;
}

/** Who invited whom (migration 011) · service role, admin page only. */
export async function getAllReferrals(): Promise<ReferralRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("referrals")
    .select(
      "id, code, status, points_awarded, created_at, completed_at, referrer:profiles!referrals_referrer_id_fkey(full_name, email), referred:profiles!referrals_referred_id_fkey(full_name, email)",
    )
    .order("created_at", { ascending: false });

  // Missing table (migration 011 not applied) reads as "no referrals yet".
  if (error) return [];
  return (data ?? []) as unknown as ReferralRow[];
}

export interface MemberBenefitRow {
  ambassador_number: number;
  full_name: string | null;
  email: string | null;
  referral_code: string | null;
  confirmed_invites: number;
  food_discount_now: number | null;
  food_discount_after_intro: number;
  food_intro_percent: number;
  food_intro_months: number;
  intro_started_at: string | null;
  intro_ends_at: string | null;
  ai_free_months: number;
  collar_percent: number;
  collar_free_months: number;
  dna_percent: number;
}

/** Founding members and the discount each one is owed (migration 015). */
export async function getMemberBenefits(): Promise<MemberBenefitRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_member_benefits")
    .select("*")
    .order("ambassador_number", { ascending: true });

  if (error) return [];
  return (data ?? []) as MemberBenefitRow[];
}

export function formatExpectations(values: string[]): string {
  return values
    .map((value) => {
      if (value in PRODUCT_INTEREST_LABELS) {
        return PRODUCT_INTEREST_LABELS[value as ProductInterest];
      }
      return value.replaceAll("_", " ");
    })
    .join(", ");
}
