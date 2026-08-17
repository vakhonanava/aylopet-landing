"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createSeedPet,
  uid,
  type Account,
  type FoodEntry,
  type LabReportEntry,
  type MoodEntry,
  type Pet,
  type PetProfileSnapshot,
  type SupplementEntry,
  type VaccineEntry,
} from "@/lib/dashboard";
import type { MedicalRecord, Medication, SymptomLog } from "@/lib/medical";
import {
  fetchUserDashboardFromSupabase,
  isPlatformPetId,
} from "@/lib/platform/dashboard-sync";
import {
  createPetProfileSnapshotInSupabase,
  deletePetProfileSnapshotInSupabase,
  deleteVaccineInSupabase,
  petToPayload,
  profilesEqual,
  updatePetProfileInSupabase,
  upsertVaccineInSupabase,
  type PetProfilePayload,
} from "@/lib/platform/pet-persistence";
import {
  createSymptomLogInSupabase,
  deleteMedicationInSupabase,
  deleteSymptomLogInSupabase,
  updatePetIdentityInSupabase,
  upsertMedicalRecordInSupabase,
  upsertMedicationInSupabase,
  type MedicalRecordPayload,
  type PetIdentityPayload,
} from "@/lib/platform/medical-persistence";
import { savePetHistoryInSupabase } from "@/lib/platform/history-persistence";
import { emptyPetHistory, type PetHistory } from "@/lib/pet-history/types";
import { createClient } from "@/utils/supabase/client";

interface DashboardState {
  account: Account | null;
  pets: Pet[];
}

interface DashboardContextValue extends DashboardState {
  ready: boolean;
  setAccount: (account: Account) => void;
  addPet: (
    pet: Omit<
      Pet,
      | "id"
      | "vaccines"
      | "supplements"
      | "food"
      | "moods"
      | "labReports"
      | "profileHistory"
      | "medicalRecord"
      | "medications"
      | "symptomLogs"
    >,
    options?: { id?: string },
  ) => string;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  savePetProfile: (
    petId: string,
    payload: PetProfilePayload,
  ) => Promise<{ ok: boolean; error?: string }>;
  removeProfileSnapshot: (
    petId: string,
    snapshotId: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  getPet: (id: string) => Pet | undefined;
  addVaccine: (
    petId: string,
    entry: Omit<VaccineEntry, "id">,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateVaccine: (
    petId: string,
    entry: VaccineEntry,
  ) => Promise<{ ok: boolean; error?: string }>;
  removeVaccine: (
    petId: string,
    vaccineId: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  addSupplement: (
    petId: string,
    entry: Omit<SupplementEntry, "id">,
  ) => Promise<{ ok: boolean; error?: string }>;
  toggleSupplement: (
    petId: string,
    supplementId: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  addFood: (
    petId: string,
    entry: Omit<FoodEntry, "id">,
  ) => Promise<{ ok: boolean; error?: string }>;
  addMood: (
    petId: string,
    entry: Omit<MoodEntry, "id">,
  ) => Promise<{ ok: boolean; error?: string }>;
  addLabReport: (petId: string, entry: LabReportEntry) => void;
  removeLabReport: (petId: string, reportId: string) => void;
  updatePetIdentity: (
    petId: string,
    payload: PetIdentityPayload,
  ) => Promise<{ ok: boolean; error?: string }>;
  saveMedicalRecord: (
    petId: string,
    payload: MedicalRecordPayload,
  ) => Promise<{ ok: boolean; error?: string }>;
  addSymptomLog: (
    petId: string,
    entry: Omit<SymptomLog, "id" | "petId">,
  ) => Promise<{ ok: boolean; error?: string }>;
  removeSymptomLog: (
    petId: string,
    logId: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  addMedication: (
    petId: string,
    entry: Omit<Medication, "id" | "petId">,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateMedication: (
    petId: string,
    entry: Medication,
  ) => Promise<{ ok: boolean; error?: string }>;
  removeMedication: (
    petId: string,
    medicationId: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  /** Merges a partial patch into `pet.history` and persists the whole blob. */
  updatePetHistory: (
    petId: string,
    patch: Partial<PetHistory>,
  ) => Promise<{ ok: boolean; error?: string }>;
}

const STORAGE_KEY = "aylopet.dashboard.v1";
const UUID_LIKE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DashboardContext = createContext<DashboardContextValue | null>(null);

function emptyPetExtras() {
  return {
    vaccines: [] as VaccineEntry[],
    supplements: [] as SupplementEntry[],
    food: [] as FoodEntry[],
    moods: [] as MoodEntry[],
    labReports: [] as LabReportEntry[],
    profileHistory: [] as PetProfileSnapshot[],
    medicalRecord: null as MedicalRecord | null,
    medications: [] as Medication[],
    symptomLogs: [] as SymptomLog[],
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const [state, setState] = useState<DashboardState>({
    account: null,
    pets: [],
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      queueMicrotask(() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const stored = JSON.parse(raw) as DashboardState;
            setState({
              ...stored,
              pets: stored.pets.map((pet) => ({
                ...pet,
                labReports: pet.labReports ?? [],
                profileHistory: pet.profileHistory ?? [],
                medicalRecord: pet.medicalRecord ?? null,
                medications: pet.medications ?? [],
                symptomLogs: pet.symptomLogs ?? [],
                vaccines: (pet.vaccines ?? []).map((v) => ({
                  ...v,
                  careType: v.careType ?? "vaccine",
                })),
              })),
            });
          } else {
            setState({
              account: { name: "ნინო", email: "nino@example.com" },
              pets: [createSeedPet()],
            });
          }
        } catch {
          setState({
            account: { name: "ნინო", email: "nino@example.com" },
            pets: [createSeedPet()],
          });
        }
        setReady(true);
      });
      return;
    }

    let cancelled = false;
    setReady(false);

    const supabase = (() => {
      try {
        return createClient();
      } catch {
        return null;
      }
    })();

    if (!supabase) {
      setState({
        account: {
          name:
            (user.user_metadata?.full_name as string | undefined) ??
            "მომხმარებელი",
          email: user.email ?? "",
        },
        pets: [],
      });
      setReady(true);
      return;
    }

    void fetchUserDashboardFromSupabase(supabase, user.id).then((data) => {
      if (cancelled) return;
      setState({
        account: data?.account.name
          ? data.account
          : {
              name:
                (user.user_metadata?.full_name as string | undefined) ??
                "მომხმარებელი",
              email: user.email ?? "",
            },
        pets: data?.pets ?? [],
      });
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, user]);

  useEffect(() => {
    if (!ready || user) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, ready, user]);

  const updatePetState = useCallback(
    (id: string, updater: (pet: Pet) => Pet) => {
      setState((prev) => ({
        ...prev,
        pets: prev.pets.map((p) => (p.id === id ? updater(p) : p)),
      }));
    },
    [],
  );

  const getSupabaseClient = useCallback(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  /**
   * Shared by `updatePetHistory` and every Logbook add/toggle (supplements,
   * food, mood) — they all merge a patch into `pet.history` and persist the
   * whole blob. `petPatch` additionally mirrors the result onto flat `Pet`
   * fields in the same state update, so `pet.supplements`/`food`/`moods`
   * (what the Logbook tabs actually read) stay in sync with what got saved.
   */
  const persistHistoryPatch = useCallback(
    async (
      petId: string,
      historyPatch: Partial<PetHistory>,
      petPatch?: Partial<Pick<Pet, "supplements" | "food" | "moods">>,
    ): Promise<{ ok: boolean; error?: string }> => {
      const pet = state.pets.find((p) => p.id === petId);
      if (!pet) return { ok: false, error: "ძაღლი ვერ მოიძებნა." };

      const next: PetHistory = {
        ...emptyPetHistory(),
        ...pet.history,
        ...historyPatch,
      };

      if (user && isPlatformPetId(petId)) {
        const supabase = getSupabaseClient();
        if (!supabase) {
          return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
        }
        const result = await savePetHistoryInSupabase(
          supabase,
          user.id,
          petId,
          next,
        );
        if (result.error) return { ok: false, error: result.error };
      }

      updatePetState(petId, (p) => ({ ...p, history: next, ...petPatch }));
      return { ok: true };
    },
    [state.pets, user, getSupabaseClient, updatePetState],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      ...state,
      ready,
      setAccount: (account) => setState((p) => ({ ...p, account })),
      addPet: (pet, options) => {
        const id = options?.id ?? uid("pet");
        setState((prev) => ({
          ...prev,
          pets: [
            ...prev.pets,
            {
              ...pet,
              id,
              ...emptyPetExtras(),
            },
          ],
        }));
        return id;
      },
      updatePet: (id, patch) => updatePetState(id, (p) => ({ ...p, ...patch })),
      savePetProfile: async (petId, payload) => {
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) return { ok: false, error: "ძაღლი ვერ მოიძებნა." };

        const previous = petToPayload(pet);
        const changed = !profilesEqual(previous, payload);
        let snapshot: PetProfileSnapshot | null = null;

        if (changed) {
          if (user && isPlatformPetId(petId)) {
            const supabase = getSupabaseClient();
            if (!supabase) {
              return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
            }
            const snapResult = await createPetProfileSnapshotInSupabase(
              supabase,
              user.id,
              petId,
              previous,
            );
            if (snapResult.error) {
              return { ok: false, error: snapResult.error };
            }
            snapshot = snapResult.snapshot;
          } else {
            snapshot = {
              id: uid("snap"),
              savedAt: new Date().toISOString(),
              ...previous,
            };
          }
        }

        updatePetState(petId, (p) => ({
          ...p,
          name: payload.name,
          breed: payload.breed,
          weightKg: payload.weightKg,
          activity: payload.activity,
          avatarUrl: payload.avatarUrl,
          profileHistory: snapshot
            ? [snapshot, ...p.profileHistory]
            : p.profileHistory,
        }));

        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) {
            return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          }
          const result = await updatePetProfileInSupabase(
            supabase,
            user.id,
            petId,
            payload,
          );
          if (result.error) return { ok: false, error: result.error };
        }

        return { ok: true };
      },
      removeProfileSnapshot: async (petId, snapshotId) => {
        if (user && isPlatformPetId(petId) && UUID_LIKE.test(snapshotId)) {
          const supabase = getSupabaseClient();
          if (supabase) {
            const result = await deletePetProfileSnapshotInSupabase(
              supabase,
              user.id,
              snapshotId,
            );
            if (result.error) return { ok: false, error: result.error };
          }
        }

        updatePetState(petId, (p) => ({
          ...p,
          profileHistory: p.profileHistory.filter((s) => s.id !== snapshotId),
        }));
        return { ok: true };
      },
      getPet: (id) => state.pets.find((p) => p.id === id),
      addVaccine: async (petId, entry) => {
        const localEntry: VaccineEntry = { ...entry, id: uid("v") };

        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await upsertVaccineInSupabase(
            supabase,
            user.id,
            petId,
            localEntry,
          );
          if (result.error || !result.id) {
            return { ok: false, error: result.error ?? "ვაქცინა ვერ შეინახა." };
          }
          localEntry.id = result.id;
        }

        updatePetState(petId, (p) => ({
          ...p,
          vaccines: [localEntry, ...p.vaccines],
        }));
        return { ok: true };
      },
      updateVaccine: async (petId, entry) => {
        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await upsertVaccineInSupabase(
            supabase,
            user.id,
            petId,
            entry,
          );
          if (result.error) return { ok: false, error: result.error };
        }

        updatePetState(petId, (p) => ({
          ...p,
          vaccines: p.vaccines.map((v) => (v.id === entry.id ? entry : v)),
        }));
        return { ok: true };
      },
      removeVaccine: async (petId, vaccineId) => {
        if (user && isPlatformPetId(petId) && UUID_LIKE.test(vaccineId)) {
          const supabase = getSupabaseClient();
          if (supabase) {
            const result = await deleteVaccineInSupabase(
              supabase,
              user.id,
              vaccineId,
            );
            if (result.error) return { ok: false, error: result.error };
          }
        }

        updatePetState(petId, (p) => ({
          ...p,
          vaccines: p.vaccines.filter((v) => v.id !== vaccineId),
        }));
        return { ok: true };
      },
      addSupplement: (petId, entry) => {
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) return Promise.resolve({ ok: false, error: "ძაღლი ვერ მოიძებნა." });
        const supplements = [{ ...entry, id: uid("s") }, ...pet.supplements];
        return persistHistoryPatch(petId, { supplements }, { supplements });
      },
      toggleSupplement: (petId, supplementId) => {
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) return Promise.resolve({ ok: false, error: "ძაღლი ვერ მოიძებნა." });
        const supplements = pet.supplements.map((s) =>
          s.id === supplementId ? { ...s, givenToday: !s.givenToday } : s,
        );
        return persistHistoryPatch(petId, { supplements }, { supplements });
      },
      addFood: (petId, entry) => {
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) return Promise.resolve({ ok: false, error: "ძაღლი ვერ მოიძებნა." });
        const food = [{ ...entry, id: uid("f") }, ...pet.food];
        return persistHistoryPatch(petId, { foodLogs: food }, { food });
      },
      addMood: (petId, entry) => {
        const pet = state.pets.find((p) => p.id === petId);
        if (!pet) return Promise.resolve({ ok: false, error: "ძაღლი ვერ მოიძებნა." });
        const moods = [{ ...entry, id: uid("m") }, ...pet.moods];
        return persistHistoryPatch(petId, { moodLogs: moods }, { moods });
      },
      addLabReport: (petId, entry) =>
        updatePetState(petId, (pet) => ({
          ...pet,
          labReports: [entry, ...(pet.labReports ?? [])],
        })),
      removeLabReport: (petId, reportId) =>
        updatePetState(petId, (pet) => ({
          ...pet,
          labReports: (pet.labReports ?? []).filter(
            (report) => report.id !== reportId,
          ),
        })),
      updatePetIdentity: async (petId, payload) => {
        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await updatePetIdentityInSupabase(supabase, user.id, petId, payload);
          if (result.error) return { ok: false, error: result.error };
        }

        updatePetState(petId, (p) => ({
          ...p,
          birthDate: payload.birthDate ?? undefined,
          bcsScore: payload.bcsScore ?? undefined,
          microchipId: payload.microchipId ?? undefined,
        }));
        return { ok: true };
      },
      saveMedicalRecord: async (petId, payload) => {
        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await upsertMedicalRecordInSupabase(supabase, user.id, petId, payload);
          if (result.error) return { ok: false, error: result.error };
        }

        updatePetState(petId, (p) => ({
          ...p,
          medicalRecord: { ...payload, updatedAt: new Date().toISOString() },
        }));
        return { ok: true };
      },
      addSymptomLog: async (petId, entry) => {
        const localEntry: SymptomLog = { ...entry, id: uid("sym"), petId };

        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await createSymptomLogInSupabase(supabase, user.id, petId, entry);
          if (result.error || !result.id) {
            return { ok: false, error: result.error ?? "სიმპტომი ვერ შეინახა." };
          }
          localEntry.id = result.id;
        }

        updatePetState(petId, (p) => ({
          ...p,
          symptomLogs: [localEntry, ...p.symptomLogs],
        }));
        return { ok: true };
      },
      removeSymptomLog: async (petId, logId) => {
        if (user && isPlatformPetId(petId) && UUID_LIKE.test(logId)) {
          const supabase = getSupabaseClient();
          if (supabase) {
            const result = await deleteSymptomLogInSupabase(supabase, user.id, logId);
            if (result.error) return { ok: false, error: result.error };
          }
        }

        updatePetState(petId, (p) => ({
          ...p,
          symptomLogs: p.symptomLogs.filter((s) => s.id !== logId),
        }));
        return { ok: true };
      },
      addMedication: async (petId, entry) => {
        const localEntry: Medication = { ...entry, id: uid("med"), petId };

        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await upsertMedicationInSupabase(supabase, user.id, petId, localEntry);
          if (result.error || !result.id) {
            return { ok: false, error: result.error ?? "მედიკამენტი ვერ შეინახა." };
          }
          localEntry.id = result.id;
        }

        updatePetState(petId, (p) => ({
          ...p,
          medications: [localEntry, ...p.medications],
        }));
        return { ok: true };
      },
      updateMedication: async (petId, entry) => {
        if (user && isPlatformPetId(petId)) {
          const supabase = getSupabaseClient();
          if (!supabase) return { ok: false, error: "Supabase არ არის კონფიგურირებული." };
          const result = await upsertMedicationInSupabase(supabase, user.id, petId, entry);
          if (result.error) return { ok: false, error: result.error };
        }

        updatePetState(petId, (p) => ({
          ...p,
          medications: p.medications.map((m) => (m.id === entry.id ? entry : m)),
        }));
        return { ok: true };
      },
      removeMedication: async (petId, medicationId) => {
        if (user && isPlatformPetId(petId) && UUID_LIKE.test(medicationId)) {
          const supabase = getSupabaseClient();
          if (supabase) {
            const result = await deleteMedicationInSupabase(supabase, user.id, medicationId);
            if (result.error) return { ok: false, error: result.error };
          }
        }

        updatePetState(petId, (p) => ({
          ...p,
          medications: p.medications.filter((m) => m.id !== medicationId),
        }));
        return { ok: true };
      },
      updatePetHistory: (petId, patch) => persistHistoryPatch(petId, patch),
    }),
    [state, ready, user, updatePetState, getSupabaseClient, persistHistoryPatch],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
