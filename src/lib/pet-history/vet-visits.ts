import type { ToneClasses } from "@/lib/pet-history/labels";
import type { VetVisitEntry, VetVisitOutcome, VetVisitReason } from "@/lib/pet-history/types";

export const VET_VISIT_REASON_LABELS: Record<VetVisitReason, string> = {
  checkup: "პროფილაქტიკური შემოწმება",
  vaccination: "ვაქცინაცია",
  illness: "დაავადება",
  injury: "ტრავმა",
  surgery: "ოპერაცია",
  follow_up: "საკონტროლო ვიზიტი",
  other: "სხვა",
};

export const VET_VISIT_OUTCOME: Record<VetVisitOutcome, ToneClasses> = {
  resolved: {
    label: "მოგვარებულია",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
  ongoing: {
    label: "მიმდინარეობს მკურნალობა",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    dotClass: "bg-sky-500",
  },
  follow_up_needed: {
    label: "საჭიროებს საკონტროლო ვიზიტს",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
  },
};

export function sortVetVisits(entries: VetVisitEntry[]): VetVisitEntry[] {
  return [...entries].sort(
    (a, b) => new Date(a.visitedAt).getTime() - new Date(b.visitedAt).getTime(),
  );
}

export function latestVetVisit(entries: VetVisitEntry[]): VetVisitEntry | null {
  return sortVetVisits(entries).at(-1) ?? null;
}

/** Visits still waiting on a follow-up, soonest first. */
export function pendingFollowUps(entries: VetVisitEntry[]): VetVisitEntry[] {
  return entries
    .filter((entry) => entry.outcome === "follow_up_needed")
    .sort((a, b) => {
      if (!a.followUpDate) return 1;
      if (!b.followUpDate) return -1;
      return (
        new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime()
      );
    });
}
