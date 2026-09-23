"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Download,
  FileText,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  ScanLine,
  ShieldAlert,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { QrCode } from "@/components/dashboard/history/QrCode";
import { SectionCard, StatusPill } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, type Pet } from "@/lib/dashboard";
import { MICROCHIP_STATUS } from "@/lib/pet-history/labels";
import { chipOwnerContact } from "@/lib/pet-history/owner-contact";
import { buildSosPayload } from "@/lib/pet-history/sos";
import type {
  MicrochipRegistration,
  MicrochipRegistryStatus,
} from "@/lib/pet-history/types";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function MicrochipSosCard({ pet }: { pet: Pet }) {
  const { account } = useDashboard();
  const [editing, setEditing] = useState(false);
  const { save, saving, error } = useHistorySave(pet.id);

  const registration = pet.history?.microchip ?? null;
  const chip = registration?.code || pet.microchipId || null;
  const contact = chipOwnerContact(pet, account);
  const payload = useMemo(() => buildSosPayload(pet, account), [pet, account]);
  const svgRef = useRef<HTMLDivElement>(null);

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

  const [code, setCode] = useState(chip ?? "");
  const [registryName, setRegistryName] = useState(
    registration?.registryName ?? "",
  );
  const [status, setStatus] = useState<MicrochipRegistryStatus>(
    registration?.status ?? "unchecked",
  );
  const [ownerName, setOwnerName] = useState(contact.name);
  const [ownerPhone, setOwnerPhone] = useState(contact.phone);
  const [ownerAddress, setOwnerAddress] = useState(contact.address);

  // Prefill from the profile each time the form opens, keeping saved values.
  const toggleEditing = () => {
    if (!editing) {
      setOwnerName(contact.name);
      setOwnerPhone(contact.phone);
      setOwnerAddress(contact.address);
    }
    setEditing((value) => !value);
  };

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
      ...(ownerName.trim() ? { ownerName: ownerName.trim() } : {}),
      ...(ownerPhone.trim() ? { ownerPhone: ownerPhone.trim() } : {}),
      ...(ownerAddress.trim() ? { ownerAddress: ownerAddress.trim() } : {}),
    };
    if (await save({ microchip: next })) setEditing(false);
  };

  return (
    <SectionCard
      id="microchip"
      icon={ScanLine}
      title="მიკროჩიპი და მეპატრონის კონტაქტი"
      description="ჩიპის ნომერი, მეპატრონის კონტაქტი და QR კოდი დაკარგვის შემთხვევისთვის."
      action={
        <button
          type="button"
          onClick={toggleEditing}
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
        <div className="min-w-0 space-y-3">
          <div className="rounded-2xl bg-[#FAFAF8] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              ჩიპის ნომერი
            </p>
            <p className="mt-1 break-all font-mono text-lg font-semibold tracking-tight text-[var(--brand-primary)]">
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

        <div className="space-y-2 rounded-2xl border border-[#e5e7eb] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            მეპატრონე
          </p>
          <p className="flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)]">
            <User className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="min-w-0 break-words">{contact.name || "·"}</span>
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-slate-400" />
            {contact.phone ? (
              <a
                href={telHref(contact.phone)}
                className="font-medium text-[var(--brand-primary)] underline-offset-2 hover:underline"
              >
                {contact.phone}
              </a>
            ) : (
              <span className="text-slate-400">·</span>
            )}
          </p>
          <p className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span className="min-w-0 break-words">{contact.address || "·"}</span>
          </p>
        </div>
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
          <Link
            href={`/dashboard/pets/${pet.id}/sos-card`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[var(--brand-primary)]"
          >
            <FileText className="h-3.5 w-3.5" /> სრული ბარათი (PDF)
          </Link>
        </div>
      </div>

      {!contact.phone ? (
        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          მეპატრონის ნომერი არ არის მითითებული, ამიტომ QR კოდზე ნომერი არ წერია.
          დაამატეთ „რედაქტირებიდან“, რომ ძაღლის მპოვნელმა დაგირეკოთ.
        </p>
      ) : null}

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

              <div className="border-t border-[#eceae5] pt-4">
                <p className="text-sm font-semibold text-[var(--brand-primary)]">
                  მეპატრონის კონტაქტი
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  შევსებულია პროფილიდან — შეამოწმე და საჭიროების შემთხვევაში შეცვალე.
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel} htmlFor="chip-owner-name">
                      სახელი და გვარი
                    </label>
                    <input
                      id="chip-owner-name"
                      value={ownerName}
                      onChange={(event) => setOwnerName(event.target.value)}
                      autoComplete="name"
                      className={`${textInput} mt-2`}
                    />
                  </div>
                  <div>
                    <label className={fieldLabel} htmlFor="chip-owner-phone">
                      ტელეფონის ნომერი
                    </label>
                    <input
                      id="chip-owner-phone"
                      type="tel"
                      value={ownerPhone}
                      onChange={(event) => setOwnerPhone(event.target.value)}
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+995 5XX XX XX XX"
                      className={`${textInput} mt-2`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel} htmlFor="chip-owner-address">
                      საცხოვრებელი ლოკაცია
                    </label>
                    <input
                      id="chip-owner-address"
                      value={ownerAddress}
                      onChange={(event) => setOwnerAddress(event.target.value)}
                      autoComplete="street-address"
                      placeholder="ქალაქი, უბანი, ქუჩა"
                      className={`${textInput} mt-2`}
                    />
                  </div>
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving}
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
