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
import {
  createSeedPet,
  uid,
  type Account,
  type FoodEntry,
  type LabReportEntry,
  type MoodEntry,
  type Pet,
  type SupplementEntry,
  type VaccineEntry,
} from "@/lib/dashboard";

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
      "id" | "vaccines" | "supplements" | "food" | "moods" | "labReports"
    >,
  ) => string;
  updatePet: (id: string, patch: Partial<Pet>) => void;
  getPet: (id: string) => Pet | undefined;
  addVaccine: (petId: string, entry: Omit<VaccineEntry, "id">) => void;
  addSupplement: (petId: string, entry: Omit<SupplementEntry, "id">) => void;
  toggleSupplement: (petId: string, supplementId: string) => void;
  addFood: (petId: string, entry: Omit<FoodEntry, "id">) => void;
  addMood: (petId: string, entry: Omit<MoodEntry, "id">) => void;
  addLabReport: (petId: string, entry: LabReportEntry) => void;
  removeLabReport: (petId: string, reportId: string) => void;
}

const STORAGE_KEY = "aylopet.dashboard.v1";

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    account: { name: "ნინო", email: "nino@example.com" },
    pets: [createSeedPet()],
  });
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
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
            })),
          });
        }
      } catch {
        // ignore malformed storage
      }
      setReady(true);
    });
  }, []);

  // Persist on change (after hydration).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, ready]);

  const updatePetState = useCallback(
    (id: string, updater: (pet: Pet) => Pet) => {
      setState((prev) => ({
        ...prev,
        pets: prev.pets.map((p) => (p.id === id ? updater(p) : p)),
      }));
    },
    [],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      ...state,
      ready,
      setAccount: (account) => setState((p) => ({ ...p, account })),
      addPet: (pet) => {
        const id = uid("pet");
        setState((prev) => ({
          ...prev,
          pets: [
            ...prev.pets,
            {
              ...pet,
              id,
              vaccines: [],
              supplements: [],
              food: [],
              moods: [],
              labReports: [],
            },
          ],
        }));
        return id;
      },
      updatePet: (id, patch) => updatePetState(id, (p) => ({ ...p, ...patch })),
      getPet: (id) => state.pets.find((p) => p.id === id),
      addVaccine: (petId, entry) =>
        updatePetState(petId, (p) => ({
          ...p,
          vaccines: [{ ...entry, id: uid("v") }, ...p.vaccines],
        })),
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
    [state, ready, updatePetState],
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
