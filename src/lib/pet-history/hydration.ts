import type {
  HydrationLogEntry,
  StoolConsistency,
  WaterChange,
} from "@/lib/pet-history/types";

export const WATER_CHANGE_LABELS: Record<WaterChange, string> = {
  increased: "გაზრდილი",
  normal: "ჩვეულებრივი",
  decreased: "შემცირებული",
};

export const STOOL_CONSISTENCY_LABELS: Record<StoolConsistency, string> = {
  normal: "ნორმალური",
  soft: "რბილი",
  diarrhea: "დიარეა",
  hard: "მაგარი",
};

export function sortHydrationEntries(
  entries: HydrationLogEntry[],
): HydrationLogEntry[] {
  return [...entries].sort(
    (a, b) =>
      new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );
}

export function latestHydrationEntry(
  entries: HydrationLogEntry[],
): HydrationLogEntry | null {
  return sortHydrationEntries(entries).at(-1) ?? null;
}

export interface HydrationFlag {
  label: string;
  severity: "warning" | "danger";
}

/** The clinically notable signals in one entry — polydipsia, blood, straining, diarrhea. */
export function hydrationEntryFlags(entry: HydrationLogEntry): HydrationFlag[] {
  const flags: HydrationFlag[] = [];
  if (entry.waterChange === "increased") {
    flags.push({ label: "წყლის მოხმარება გაზრდილია", severity: "warning" });
  }
  if (entry.stoolConsistency === "diarrhea") {
    flags.push({ label: "დიარეა", severity: "warning" });
  }
  if (entry.urinationStraining) {
    flags.push({ label: "გაძნელებული შარდვა", severity: "danger" });
  }
  if (entry.urinationBlood) {
    flags.push({ label: "სისხლი შარდში", severity: "danger" });
  }
  if (entry.stoolBlood) {
    flags.push({ label: "სისხლი განავალში", severity: "danger" });
  }
  return flags;
}

/** Flags from the most recent entry only — what needs attention right now. */
export function latestHydrationFlags(
  entries: HydrationLogEntry[],
): HydrationFlag[] {
  const latest = latestHydrationEntry(entries);
  return latest ? hydrationEntryFlags(latest) : [];
}
