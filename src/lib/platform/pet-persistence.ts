import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActivityLevel,
  Pet,
  PetProfileSnapshot,
  Temperament,
  VaccineEntry,
} from "@/lib/dashboard";

export interface PetProfilePayload {
  name: string;
  breed: string;
  weightKg: number;
  activity: ActivityLevel;
  temperament: Temperament[];
  avatarUrl?: string;
}

function snapshotFromPet(pet: PetProfilePayload): Omit<PetProfileSnapshot, "id" | "savedAt"> {
  return {
    name: pet.name,
    breed: pet.breed,
    weightKg: pet.weightKg,
    activity: pet.activity,
    temperament: [...pet.temperament],
    avatarUrl: pet.avatarUrl,
  };
}

export function petToPayload(pet: Pet): PetProfilePayload {
  return {
    name: pet.name,
    breed: pet.breed,
    weightKg: pet.weightKg,
    activity: pet.activity,
    temperament: pet.temperament,
    avatarUrl: pet.avatarUrl,
  };
}

export function profilesEqual(a: PetProfilePayload, b: PetProfilePayload): boolean {
  return (
    a.name === b.name &&
    a.breed === b.breed &&
    a.weightKg === b.weightKg &&
    a.activity === b.activity &&
    a.avatarUrl === b.avatarUrl &&
    a.temperament.join("|") === b.temperament.join("|")
  );
}

export async function updatePetProfileInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  payload: PetProfilePayload,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("pets")
    .update({
      pet_name: payload.name.trim(),
      breed: payload.breed.trim(),
      weight: payload.weightKg,
      weight_unit: "kg",
      activity: payload.activity,
      temperament: payload.temperament,
      avatar_url: payload.avatarUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", petId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

export async function createPetProfileSnapshotInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  previous: PetProfilePayload,
): Promise<{ snapshot: PetProfileSnapshot | null; error: string | null }> {
  const body = {
    ...snapshotFromPet(previous),
    savedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("pet_profile_snapshots")
    .insert({
      pet_id: petId,
      owner_id: userId,
      snapshot: body,
    })
    .select("id, created_at, snapshot")
    .single();

  if (error) return { snapshot: null, error: error.message };

  const snap = data.snapshot as Omit<PetProfileSnapshot, "id" | "savedAt"> & {
    savedAt?: string;
  };

  return {
    snapshot: {
      id: data.id as string,
      savedAt: (snap.savedAt ?? data.created_at) as string,
      name: snap.name,
      breed: snap.breed,
      weightKg: snap.weightKg,
      activity: snap.activity,
      temperament: snap.temperament ?? [],
      avatarUrl: snap.avatarUrl,
    },
    error: null,
  };
}

export async function deletePetProfileSnapshotInSupabase(
  supabase: SupabaseClient,
  userId: string,
  snapshotId: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("pet_profile_snapshots")
    .delete()
    .eq("id", snapshotId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

export async function upsertVaccineInSupabase(
  supabase: SupabaseClient,
  userId: string,
  petId: string,
  entry: VaccineEntry,
): Promise<{ id: string | null; error: string | null }> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entry.id);
  const row = {
    pet_id: petId,
    owner_id: userId,
    name: entry.name.trim(),
    care_type: entry.careType,
    administered: entry.administered,
    next_due: entry.nextDue || null,
    updated_at: new Date().toISOString(),
  };

  if (isUuid) {
    const { error } = await supabase
      .from("pet_vaccines")
      .update(row)
      .eq("id", entry.id)
      .eq("owner_id", userId);
    return { id: entry.id, error: error?.message ?? null };
  }

  const { data, error } = await supabase
    .from("pet_vaccines")
    .insert(row)
    .select("id")
    .single();

  if (error) return { id: null, error: error.message };
  return { id: data.id as string, error: null };
}

export async function deleteVaccineInSupabase(
  supabase: SupabaseClient,
  userId: string,
  vaccineId: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("pet_vaccines")
    .delete()
    .eq("id", vaccineId)
    .eq("owner_id", userId);

  return { error: error?.message ?? null };
}

export async function createPetProfileInSupabase(
  supabase: SupabaseClient,
  userId: string,
  payload: PetProfilePayload & { petName?: string },
): Promise<{ petId: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from("pets")
    .insert({
      owner_id: userId,
      pet_name: (payload.petName ?? payload.name).trim(),
      breed: payload.breed.trim(),
      weight: payload.weightKg,
      weight_unit: "kg",
      activity: payload.activity,
      temperament: payload.temperament,
      avatar_url: payload.avatarUrl ?? null,
      gender: "male",
      is_neutered: false,
      age_dob: null,
      health_history: [],
      medical_notes: null,
      primary_goal: null,
    })
    .select("id")
    .single();

  if (error) return { petId: null, error: error.message };
  return { petId: data.id as string, error: null };
}
