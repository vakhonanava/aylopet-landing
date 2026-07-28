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
      "id" | "vaccines" | "supplements" | "food" | "moods" | "labReports" | "profileHistory"
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
  addSupplement: (petId: string, entry: Omit<SupplementEntry, "id">) => void;
  toggleSupplement: (petId: string, supplementId: string) => void;
  addFood: (petId: string, entry: Omit<FoodEntry, "id">) => void;
  addMood: (petId: string, entry: Omit<MoodEntry, "id">) => void;
  addLabReport: (petId: string, entry: LabReportEntry) => void;
  removeLabReport: (petId: string, reportId: string) => void;
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
          temperament: payload.temperament,
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
      addSupplement: (petId, entry) =>
        updatePetState(petId, (p) => ({
          ...p,
          supplements: [{ ...entry, id: uid("s") }, ...p.supplements],
        })),
      toggleSupplement: (petId, supplementId) =>
        updatePetState(petId, (p) => ({
          ...p,
          supplements: p.supplements.map((s) =>
            s.id === supplementId ? { ...s, givenToday: !s.givenToday } : s,
          ),
        })),
      addFood: (petId, entry) =>
        updatePetState(petId, (p) => ({
          ...p,
          food: [{ ...entry, id: uid("f") }, ...p.food],
        })),
      addMood: (petId, entry) =>
        updatePetState(petId, (p) => ({
          ...p,
          moods: [{ ...entry, id: uid("m") }, ...p.moods],
        })),
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
    }),
    [state, ready, user, updatePetState, getSupabaseClient],
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
