"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import type { PetHistory } from "@/lib/pet-history/types";

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Wraps `updatePetHistory` with the transient feedback every editor in this
 * module needs. The success flag self-clears; the timer is cancelled on unmount
 * so a fast navigation can't set state on a dead component.
 */
export function useHistorySave(petId: string) {
  const { updatePetHistory } = useDashboard();
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const save = useCallback(
    async (patch: Partial<PetHistory>) => {
      setState("saving");
      setError(null);

      const result = await updatePetHistory(petId, patch);
      if (!result.ok) {
        setError(result.error ?? "შენახვა ვერ მოხერხდა.");
        setState("error");
        return false;
      }

      setState("saved");
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setState("idle"), 2500);
      return true;
    },
    [petId, updatePetHistory],
  );

  return { save, saving: state === "saving", saved: state === "saved", error };
}
