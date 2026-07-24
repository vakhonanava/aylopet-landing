import { createSupabaseAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  PRODUCT_INTEREST_LABELS,
  type ProductInterest,
} from "@/lib/leads/types";

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
  const { getLeadStorageMode: getBlobOrFileMode } =
    require("@/lib/leads/blob-storage") as typeof import("@/lib/leads/blob-storage");
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
