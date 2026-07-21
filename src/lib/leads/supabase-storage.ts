import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { EarlyAdopterInput, StoredLead } from "@/lib/leads/types";

interface LeadRow {
  id: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  dog_name: string;
  breed: string;
  age_months: number;
  weight_kg: number;
  neutered: boolean;
  allergies: string[];
  primary_goal: string;
  product_expectation: string;
  product_interests: string[];
  feature_expectations: string[];
  feature_wishlist: string;
  referral_source: string;
  notes: string | null;
  wants_dna_kit: boolean;
  consent: boolean;
  position: number;
  status: StoredLead["status"];
  created_at: string;
}

function uid(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function rowToLead(row: LeadRow): StoredLead {
  return {
    id: row.id,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    dogName: row.dog_name,
    breed: row.breed,
    ageMonths: row.age_months,
    weightKg: Number(row.weight_kg),
    neutered: row.neutered,
    allergies: row.allergies ?? [],
    primaryGoal: row.primary_goal as StoredLead["primaryGoal"],
    productExpectation: row.product_expectation as StoredLead["productExpectation"],
    productInterests: (row.product_interests ?? []) as StoredLead["productInterests"],
    featureExpectations: (row.feature_expectations ??
      []) as StoredLead["featureExpectations"],
    featureWishlist: row.feature_wishlist,
    referralSource: row.referral_source as StoredLead["referralSource"],
    notes: row.notes ?? undefined,
    wantsDnaKit: row.wants_dna_kit,
    consent: row.consent,
    position: row.position,
    status: row.status,
    createdAt: row.created_at,
  };
}

function leadToRow(input: EarlyAdopterInput, meta: {
  id: string;
  position: number;
  status: StoredLead["status"];
  createdAt: string;
}): LeadRow {
  return {
    id: meta.id,
    owner_name: input.ownerName,
    email: input.email.toLowerCase(),
    phone: input.phone,
    city: input.city,
    dog_name: input.dogName,
    breed: input.breed,
    age_months: input.ageMonths,
    weight_kg: input.weightKg,
    neutered: input.neutered,
    allergies: input.allergies,
    primary_goal: input.primaryGoal,
    product_expectation: input.productExpectation,
    product_interests: input.productInterests,
    feature_expectations: input.featureExpectations,
    feature_wishlist: input.featureWishlist,
    referral_source: input.referralSource,
    notes: input.notes ?? null,
    wants_dna_kit: input.wantsDnaKit,
    consent: input.consent,
    position: meta.position,
    status: meta.status,
    created_at: meta.createdAt,
  };
}

export async function readLeadsFromSupabase(): Promise<StoredLead[]> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("early_adopter_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as LeadRow[]).map(rowToLead);
}

export async function saveLeadToSupabase(
  input: EarlyAdopterInput,
): Promise<StoredLead> {
  const supabase = createSupabaseAdmin();

  const { data: existing, error: existingError } = await supabase
    .from("early_adopter_leads")
    .select("*")
    .ilike("email", input.email)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    const row = leadToRow(input, {
      id: existing.id,
      position: existing.position,
      status: existing.status,
      createdAt: existing.created_at,
    });

    const { data, error } = await supabase
      .from("early_adopter_leads")
      .update(row)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return rowToLead(data as LeadRow);
  }

  const { count, error: countError } = await supabase
    .from("early_adopter_leads")
    .select("*", { count: "exact", head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  const row = leadToRow(input, {
    id: uid(),
    position: (count ?? 0) + 1,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  const { data, error } = await supabase
    .from("early_adopter_leads")
    .insert(row)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToLead(data as LeadRow);
}
