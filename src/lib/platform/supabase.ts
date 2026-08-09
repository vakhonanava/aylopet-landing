import type { SupabaseClient } from "@supabase/supabase-js";
import { establishSessionAfterSignUp } from "@/lib/auth/session";
import {
  PET_DOCUMENTS_BUCKET,
  type OwnerProfile,
  type PetFileCategory,
  type PetProfile,
  type UploadedFileMetadata,
  type WaitlistEntry,
  type WaitlistExpectation,
} from "@/lib/platform/types";

export async function fetchWaitlistCount(
  supabase: SupabaseClient,
): Promise<number> {
  const { data, error } = await supabase.rpc("get_waitlist_count");
  if (error) return 0;
  return Number(data ?? 0);
}

export async function registerWaitlistUser(
  supabase: SupabaseClient,
  entry: WaitlistEntry,
): Promise<{ userId: string | null; error: string | null }> {
  const email = entry.email.trim().toLowerCase();

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: entry.password,
    options: {
      data: { full_name: entry.fullName.trim() },
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/platform`,
    },
  });

  if (signUpError) {
    if (signUpError.message.toLowerCase().includes("already registered")) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: entry.password,
      });
      if (signInError) {
        return { userId: null, error: "ეს ელ. ფოსტა უკვე არსებობს. შეამოწმე პაროლი." };
      }
    } else {
      return { userId: null, error: signUpError.message };
    }
  } else if (!signUpData.session) {
    const sessionResult = await establishSessionAfterSignUp(
      supabase,
      email,
      entry.password,
    );
    if (sessionResult.error || !sessionResult.userId) {
      return {
        userId: null,
        error: sessionResult.error ?? "ანგარიში ვერ შეიქმნა.",
      };
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id ?? signUpData?.user?.id ?? null;
  if (!userId) {
    return { userId: null, error: "ანგარიში ვერ შეიქმნა." };
  }

  const { error: waitlistError } = await supabase.from("waitlist").insert({
    user_id: userId,
    full_name: entry.fullName.trim(),
    email,
    phone: entry.phone.trim(),
    expectations: entry.expectations,
  });

  if (waitlistError && !waitlistError.message.includes("duplicate")) {
    return { userId, error: waitlistError.message };
  }

  return { userId, error: null };
}

/** Everything before the first space is the first name. */
function splitName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  if (!trimmed) return { first: "", last: "" };
  const index = trimmed.indexOf(" ");
  if (index === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, index), last: trimmed.slice(index + 1) };
}

export async function upsertOwnerProfile(
  supabase: SupabaseClient,
  userId: string,
  profile: OwnerProfile,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: profile.fullName.trim(),
      // Greetings use the first name only; keep both parts queryable rather
      // than re-splitting full_name at every read site (migration 009).
      first_name: splitName(profile.fullName).first,
      last_name: splitName(profile.fullName).last,
      email: profile.email.trim().toLowerCase(),
      phone: profile.phone.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  return { error: error?.message ?? null };
}

export async function createPetProfile(
  supabase: SupabaseClient,
  userId: string,
  pet: PetProfile,
): Promise<{ petId: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from("pets")
    .insert({
      owner_id: userId,
      pet_name: pet.petName.trim(),
      breed: pet.breed.trim(),
      age_dob: pet.ageDob.trim() || null,
      gender: pet.gender,
      is_neutered: pet.isNeutered,
      weight: pet.weight,
      weight_unit: pet.weightUnit,
      health_history: pet.healthHistory,
      medical_notes: pet.medicalNotes.trim() || null,
      primary_goal: pet.primaryGoal || null,
    })
    .select("id")
    .single();

  if (error) return { petId: null, error: error.message };
  return { petId: data.id as string, error: null };
}

export async function uploadPetDocument(
  supabase: SupabaseClient,
  input: {
    userId: string;
    petId: string;
    file: File;
    category: PetFileCategory;
  },
): Promise<{ metadata: UploadedFileMetadata | null; error: string | null }> {
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const filePath = `${input.userId}/${input.petId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(PET_DOCUMENTS_BUCKET)
    .upload(filePath, input.file, {
      contentType: input.file.type,
      upsert: false,
    });

  if (uploadError) return { metadata: null, error: uploadError.message };

  const { data, error: metaError } = await supabase
    .from("pet_files")
    .insert({
      pet_id: input.petId,
      owner_id: input.userId,
      file_name: input.file.name,
      file_path: filePath,
      file_size: input.file.size,
      file_type: input.file.type,
      category: input.category,
      status: "uploaded",
    })
    .select("*")
    .single();

  if (metaError) {
    await supabase.storage.from(PET_DOCUMENTS_BUCKET).remove([filePath]);
    return { metadata: null, error: metaError.message };
  }

  return {
    metadata: {
      id: data.id as string,
      petId: data.pet_id as string,
      fileName: data.file_name as string,
      filePath: data.file_path as string,
      fileSize: data.file_size as number,
      fileType: data.file_type as string,
      category: data.category as PetFileCategory,
      status: data.status as string,
      createdAt: data.created_at as string,
    },
    error: null,
  };
}

export async function deletePetDocument(
  supabase: SupabaseClient,
  file: UploadedFileMetadata,
): Promise<{ error: string | null }> {
  const { error: storageError } = await supabase.storage
    .from(PET_DOCUMENTS_BUCKET)
    .remove([file.filePath]);

  if (storageError) return { error: storageError.message };

  const { error } = await supabase.from("pet_files").delete().eq("id", file.id);
  return { error: error?.message ?? null };
}

export function toggleExpectation(
  current: WaitlistExpectation[],
  value: WaitlistExpectation,
): WaitlistExpectation[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}
