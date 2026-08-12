"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Download,
  Loader2,
  Pencil,
  ScanLine,
  ShieldAlert,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { QrCode } from "@/components/dashboard/history/QrCode";
import { SectionCard, StatusPill } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, type Pet } from "@/lib/dashboard";
import { MICROCHIP_STATUS } from "@/lib/pet-history/labels";
import type {
  MicrochipRegistration,
  MicrochipRegistryStatus,
} from "@/lib/pet-history/types";

/** Keeps a Georgian name from pushing the payload past QR version 6. */
const MAX_NAME_LENGTH = 20;

/**
 * The SOS code carries the contact details as plain text rather than a URL.
 * A finder gets the chip number and a callback number straight from the scan —
 * no network, no public profile endpoint, and nothing exposed beyond what the
 * owner already put in the profile.
 */
function buildSosPayload(pet: Pet, chip: string | null): string {
  const lines = ["AYLOPET SOS", `Dog: ${pet.name.slice(0, MAX_NAME_LENGTH)}`];
  if (chip) lines.push(`Chip: ${chip}`);

  const vet = pet.history?.vet;
  if (vet?.phone) lines.push(`Vet: ${vet.phone}`);
  if (vet?.emergencyPhone) lines.push(`SOS: ${vet.emergencyPhone}`);

  lines.push("aylopet.com");
  return lines.join("\n");
}

export function MicrochipSosCard({ pet }: { pet: Pet }) {
  const [editing, setEditing] = useState(false);
  const { save, saving, error } = useHistorySave(pet.id);
  const svgRef = useRef<HTMLDivElement>(null);

  const registration = pet.history?.microchip ?? null;
  const chip = registration?.code ?? pet.microchipId ?? null;

  const [code, setCode] = useState(chip ?? "");
  const [registryName, setRegistryName] = useState(
    registration?.registryName ?? "",
  );
  const [status, setStatus] = useState<MicrochipRegistryStatus>(
    registration?.status ?? "unchecked",
  );

  const payload = useMemo(() => buildSosPayload(pet, chip), [pet, chip]);
  const hasCallback = Boolean(
    pet.history?.vet?.phone || pet.history?.vet?.emergencyPhone,
  );

  const submit = async () => {
    const next: MicrochipRegistration = {
      code: code.trim(),
      registryName: registryName.trim(),
      status,
      verifiedAt:
        status === "registered" ? new Date().toISOString() : null,
      ...(registration?.implantedAt
        ? { implantedAt: registration.implantedAt }
        : {}),
    };
    if (await save({ microchip: next })) setEditing(false);
  };

  const downloadQr = () => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(
      new Blob([source], { type: "image/svg+xml" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `aylopet-sos-${pet.name}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SectionCard
      id="microchip"
      icon={ScanLine}
      title="მიკროჩიპი და SOS იდენტიფიკაცია"
      description="ჩიპის ნომერი, ბაზის სტატუსი და QR კოდი დაკარგვის შემთხვევისთვის."
      action={
        <button
          type="button"
          onClick={() => setEditing((value) => !value)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#e5e7eb] px-3.5 py-2 text-xs font-medium text-slate-500 transition-colors hover:border-[var(--brand-primary)]/30 hover:text-[var(--brand-primary)]"
        >
          {editing ? (
            <>
              <X className="h-3.5 w-3.5" /> გაუქმება
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" /> რედაქტირება
            </>
          )}
        </button>
      }
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="space-y-3">
          <div className="rounded-2xl bg-[#FAFAF8] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              ჩიპის ნომერი
            </p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-tight text-[var(--brand-primary)]">
              {chip ?? "·"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              tone={MICROCHIP_STATUS[registration?.status ?? "unchecked"]}
            />
            {registration?.registryName ? (
              <span className="text-xs text-slate-400">
                {registration.registryName}
              </span>
            ) : null}
            {registration?.verifiedAt ? (
              <span className="text-xs text-slate-400">
                შემოწმდა {formatDate(registration.verifiedAt)}
              </span>
            ) : null}
          </div>

          {!hasCallback ? (
            <p className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              QR კოდს საკონტაქტო ნომერი არ აქვს. დაამატეთ ვეტერინარის კონტაქტი,
              რომ მპოვნელმა დარეკვა შეძლოს.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            ref={svgRef}
            className="rounded-2xl border border-[#e5e7eb] bg-white p-3"
          >
            <QrCode value={payload} size={148} />
          </div>
          <button
            type="button"
            onClick={downloadQr}
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
          >
            <Download className="h-3.5 w-3.5" /> QR-ის ჩამოტვირთვა
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {editing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabel} htmlFor="chip-code">
                    ჩიპის ნომერი (15 ციფრი)
                  </label>
                  <input
                    id="chip-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    inputMode="numeric"
                    maxLength={15}
                    placeholder="981020000000000"
                    className={`${textInput} mt-2 font-mono`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="chip-registry">
                    რეგისტრის სახელი
                  </label>
                  <input
                    id="chip-registry"
                    value={registryName}
                    onChange={(event) => setRegistryName(event.target.value)}
                    placeholder="PetMaxx / Europetnet"
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              <div>
                <span className={fieldLabel}>ბაზის სტატუსი</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      "registered",
                      "pending",
                      "not_found",
                      "unchecked",
                    ] as MicrochipRegistryStatus[]
                  ).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStatus(option)}
                      className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                        status === option
                          ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                          : "border-[#e5e7eb] bg-white text-slate-500 hover:border-[var(--brand-primary)]/30"
                      }`}
                    >
                      {MICROCHIP_STATUS[option].label}
                    </button>
                  ))}
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || code.trim().length === 0}
                className={`${addButton} cursor-pointer disabled:opacity-60`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BadgeCheck className="h-4 w-4" />
                )}
                შენახვა
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionCard>
  );
}
