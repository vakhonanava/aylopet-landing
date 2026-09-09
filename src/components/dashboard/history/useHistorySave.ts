"use client";

import { useCallback, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { useToast } from "@/components/dashboard/Toast";
import { useDashboardCopy } from "@/components/dashboard/useDashboardCopy";
import type { PetHistory } from "@/lib/pet-history/types";

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Wraps `updatePetHistory` with the feedback every editor in this module needs.
 *
 * The success flag used to clear itself on a 2.5s timer, so the button dropped
 * back to "Save" moments after a successful write and owners read that as the
 * save having failed. It now stays set until the next save starts, and a toast
 * carries the confirmation even when the panel collapses on save.
 */
export function useHistorySave(petId: string) {
  const { updatePetHistory } = useDashboard();
  const { d } = useDashboardCopy();
  const toast = useToast();
  const [state, setState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (patch: Partial<PetHistory>) => {
      setState("saving");
      setError(null);

      const result = await updatePetHistory(petId, patch);
      if (!result.ok) {
        const message = result.error ?? d.toast.saveFailed;
        setError(message);
        setState("error");
        toast.error(message);
        return false;
      }

      setState("saved");
      toast.success(d.toast.saved);
      return true;
    },
    [petId, updatePetHistory, toast, d.toast.saved, d.toast.saveFailed],
  );

  return { save, saving: state === "saving", saved: state === "saved", error };
}
