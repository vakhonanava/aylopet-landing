"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dna, FlaskConical, Microscope, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AncestryChart } from "@/components/dashboard/history/AncestryChart";
import { OwnerDnaForm } from "@/components/dashboard/history/sections/OwnerDnaForm";
import {
  EmptyState,
  MetricTile,
  SectionCard,
  StatusPill,
} from "@/components/dashboard/history/ui";
import { formatDate, type Pet } from "@/lib/dashboard";
import {
  COMING_SOON,
  DNA_STATUS,
  GENETIC_CATEGORY_LABELS,
  GENETIC_LEVEL,
} from "@/lib/pet-history/labels";
import type {
  DnaProfile,
  GeneticRiskCategory,
  GeneticRiskMarker,
  OwnerDnaRecord,
} from "@/lib/pet-history/types";

function ScanProgress({ scanned, total }: { scanned: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const ratio = total > 0 ? Math.min(1, scanned / total) : 0;

  return (
    <div className="rounded-2xl border border-[#eceae5] bg-white px-5 py-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            დამუშავებული მარკერები
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--brand-primary)]">
            {scanned.toLocaleString("ka-GE")}
            <span className="ml-1.5 text-sm font-medium text-slate-400">
              / {total.toLocaleString("ka-GE")} SNP
            </span>
          </p>
        </div>
        <span className="text-sm font-semibold text-[var(--brand-accent)]">
          {Math.round(ratio * 100)}%
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-[var(--brand-primary)]"
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${ratio * 100}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function RiskRow({ marker }: { marker: GeneticRiskMarker }) {
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-[#FAFAF8] px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--brand-primary)]">
          {marker.condition}
          {marker.gene ? (
            <span className="ml-2 font-mono text-xs font-normal text-slate-400">
              {marker.gene}
            </span>
          ) : null}
        </p>
        {marker.summary ? (
          <p className="mt-0.5 text-xs text-slate-500">{marker.summary}</p>
        ) : null}
      </div>
      <StatusPill tone={GENETIC_LEVEL[marker.level]} />
    </li>
  );
}

/** Categories containing an at-risk call float to the top. */
function groupRisks(risks: GeneticRiskMarker[]) {
  const map = new Map<GeneticRiskCategory, GeneticRiskMarker[]>();
  for (const marker of risks) {
    const list = map.get(marker.category) ?? [];
    list.push(marker);
    map.set(marker.category, list);
  }
  return [...map.entries()].sort(([, a], [, b]) => {
    const weight = (markers: GeneticRiskMarker[]) =>
      markers.some((m) => m.level === "at_risk")
        ? 2
        : markers.some((m) => m.level === "carrier")
          ? 1
          : 0;
    return weight(b) - weight(a);
  });
}

function RiskSection({ risks }: { risks: GeneticRiskMarker[] }) {
  const grouped = useMemo(() => groupRisks(risks), [risks]);
  if (grouped.length === 0) return null;

  return (
    <div className="mt-6 space-y-5">
      <h3 className="text-sm font-semibold text-[var(--brand-primary)]">
        მემკვიდრეობითი რისკების სკრინინგი
      </h3>
      {grouped.map(([category, markers]) => (
        <div key={category}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            {GENETIC_CATEGORY_LABELS[category]}
          </p>
          <ul className="space-y-2">
            {markers.map((marker) => (
              <RiskRow key={marker.id} marker={marker} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Results produced by the Aylopet lab pipeline. */
function LabResults({ dna }: { dna: DnaProfile }) {
  const atRisk = dna.risks.filter((marker) => marker.level === "at_risk").length;
  const carriers = dna.risks.filter((marker) => marker.level === "carrier").length;

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr]">
        <ScanProgress scanned={dna.markersScanned} total={dna.markersTotal} />
        <MetricTile
          icon={Microscope}
          label="რისკის ქვეშ"
          value={atRisk}
          sub={`${carriers} მატარებელი`}
        />
        <MetricTile
          icon={Dna}
          label="ინბრიდინგი (COI)"
          value={dna.coiPercent !== undefined ? `${dna.coiPercent}` : "·"}
          unit={dna.coiPercent !== undefined ? "%" : undefined}
        />
      </div>

      {dna.ancestry.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">
            ჯიშური წარმომავლობა
          </h3>
          <AncestryChart segments={dna.ancestry} />
        </div>
      ) : null}

      <RiskSection risks={dna.risks} />
    </>
  );
}

/** Results the owner typed in from a third-party lab. */
function OwnerResults({ record }: { record: OwnerDnaRecord }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-[#FAFAF8] px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          წყარო
        </span>
        <span className="text-sm font-semibold text-[var(--brand-primary)]">
          {record.provider}
        </span>
        {record.testedAt ? (
          <span className="text-xs text-slate-400">
            {formatDate(record.testedAt)}
          </span>
        ) : null}
      </div>

      {record.ancestry.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold text-[var(--brand-primary)]">
            ჯიშური წარმომავლობა
          </h3>
          <AncestryChart segments={record.ancestry} />
        </div>
      ) : null}

      <RiskSection risks={record.risks} />

      {record.notes ? (
        <p className="mt-5 rounded-2xl bg-[#FAFAF8] px-4 py-3 text-sm text-slate-500">
          {record.notes}
        </p>
      ) : null}
    </>
  );
}

interface DnaPanelProps {
  pet: Pet;
  /** Aylopet lab result. Null until the DNA pipeline ships. */
  dna: DnaProfile | null;
}

export function DnaPanel({ pet, dna }: DnaPanelProps) {
  const [editing, setEditing] = useState(false);
  const ownerRecord = pet.history?.dna ?? null;

  // Aylopet lab results outrank a manually entered third-party test.
  const labComplete = dna !== null && dna.status === "complete";
  const hasOwnerData =
    ownerRecord !== null &&
    (ownerRecord.ancestry.length > 0 || ownerRecord.risks.length > 0);

  const action = labComplete ? (
    <StatusPill tone={DNA_STATUS[dna.status]} />
  ) : (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill tone={COMING_SOON} />
      {hasOwnerData && !editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e5e7eb] px-3.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
        >
          <Pencil className="h-3.5 w-3.5" /> რედაქტირება
        </button>
      ) : null}
    </div>
  );

  return (
    <SectionCard
      id="dna"
      icon={Dna}
      title="გენეტიკური პროფილი"
      description={
        labComplete && dna.processedAt
          ? `ანალიზი დასრულდა ${formatDate(dna.processedAt)}`
          : "Aylopet DNA ლაბორატორია მალე ამოქმედდება. თუ ტესტი უკვე გაქვთ, შედეგები ახლავე შეგიძლიათ შეიყვანოთ."
      }
      action={action}
    >
      {labComplete ? (
        <LabResults dna={dna} />
      ) : hasOwnerData ? (
        <OwnerResults record={ownerRecord} />
      ) : editing ? null : (
        <EmptyState
          icon={FlaskConical}
          title="Aylopet DNA ტესტი მალე"
          body="ჩვენი ლაბორატორია ჯერ არ ამოქმედებულა. თუ სხვა ლაბორატორიის დნმ ტესტი უკვე გაქვთ, შეიყვანეთ შედეგები. AylopetAI მათ პრევენციულ რჩევებში გამოიყენებს."
          action={
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-primary-hover)]"
            >
              <Plus className="h-4 w-4" /> ჩემი შედეგების შეყვანა
            </button>
          }
        />
      )}

      <AnimatePresence initial={false}>
        {editing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <OwnerDnaForm pet={pet} onDone={() => setEditing(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionCard>
  );
}
