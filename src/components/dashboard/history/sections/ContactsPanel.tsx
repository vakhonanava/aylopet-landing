"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Loader2,
  Mail,
  MapPin,
  NotebookPen,
  Pencil,
  Phone,
  Siren,
  Stethoscope,
  X,
} from "lucide-react";
import { useState } from "react";
import { addButton, fieldLabel, textInput } from "@/components/dashboard/FormControls";
import { EmptyState, SectionCard } from "@/components/dashboard/history/ui";
import { useHistorySave } from "@/components/dashboard/history/useHistorySave";
import { formatDate, type Pet } from "@/lib/dashboard";
import type { CaretakerNotes, VetContact } from "@/lib/pet-history/types";

/** Strips spacing/formatting so `tel:` gets a dialable string. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function VetCard({ pet }: { pet: Pet }) {
  const [editing, setEditing] = useState(false);
  const { save, saving, error } = useHistorySave(pet.id);
  const vet = pet.history?.vet ?? null;

  const [clinicName, setClinicName] = useState(vet?.clinicName ?? "");
  const [vetName, setVetName] = useState(vet?.vetName ?? "");
  const [phone, setPhone] = useState(vet?.phone ?? "");
  const [emergencyPhone, setEmergencyPhone] = useState(
    vet?.emergencyPhone ?? "",
  );
  const [email, setEmail] = useState(vet?.email ?? "");
  const [address, setAddress] = useState(vet?.address ?? "");

  const submit = async () => {
    const next: VetContact = {
      clinicName: clinicName.trim(),
      vetName: vetName.trim(),
      phone: phone.trim(),
      ...(emergencyPhone.trim() ? { emergencyPhone: emergencyPhone.trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}),
      ...(address.trim() ? { address: address.trim() } : {}),
    };
    if (await save({ vet: next })) setEditing(false);
  };

  return (
    <SectionCard
      id="vet"
      icon={Stethoscope}
      title="ვეტერინარი და გადაუდებელი კონტაქტი"
      description="ერთი შეხებით დარეკვა კრიტიკულ სიტუაციაში."
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
      {vet ? (
        <div className="rounded-2xl border border-[#eceae5] bg-gradient-to-br from-[var(--brand-primary)]/[0.05] to-transparent p-5">
          <p className="text-lg font-bold tracking-tight text-[var(--brand-primary)]">
            {vet.clinicName || "·"}
          </p>
          {vet.vetName ? (
            <p className="mt-0.5 text-sm text-slate-500">{vet.vetName}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {vet.phone ? (
              <a
                href={telHref(vet.phone)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]"
              >
                <Phone className="h-4 w-4" /> დარეკვა, {vet.phone}
              </a>
            ) : null}
            {vet.emergencyPhone ? (
              <a
                href={telHref(vet.emergencyPhone)}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-100"
              >
                <Siren className="h-4 w-4" /> გადაუდებელი, {vet.emergencyPhone}
              </a>
            ) : null}
          </div>

          <div className="mt-4 space-y-1.5 text-sm text-slate-500">
            {vet.email ? (
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <a
                  href={`mailto:${vet.email}`}
                  className="underline underline-offset-2"
                >
                  {vet.email}
                </a>
              </p>
            ) : null}
            {vet.address ? (
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                {vet.address}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Stethoscope}
          title="ვეტერინარი დამატებული არ არის"
          body="დაამატე კლინიკის კონტაქტი. ის გამოჩნდება SOS QR კოდზეც."
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
            <div className="mt-5 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={fieldLabel} htmlFor="vet-clinic">
                    კლინიკის სახელი
                  </label>
                  <input
                    id="vet-clinic"
                    value={clinicName}
                    onChange={(event) => setClinicName(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="vet-name">
                    ვეტერინარის სახელი
                  </label>
                  <input
                    id="vet-name"
                    value={vetName}
                    onChange={(event) => setVetName(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="vet-phone">
                    ტელეფონი
                  </label>
                  <input
                    id="vet-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+995 5XX XX XX XX"
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="vet-emergency">
                    გადაუდებელი ნომერი
                  </label>
                  <input
                    id="vet-emergency"
                    type="tel"
                    value={emergencyPhone}
                    onChange={(event) => setEmergencyPhone(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="vet-email">
                    ელ. ფოსტა
                  </label>
                  <input
                    id="vet-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="vet-address">
                    მისამართი
                  </label>
                  <input
                    id="vet-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    className={`${textInput} mt-2`}
                  />
                </div>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="button"
                onClick={() => void submit()}
                disabled={saving || clinicName.trim().length === 0}
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

const NOTE_FIELDS: {
  key: keyof Omit<CaretakerNotes, "updatedAt">;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "routine",
    label: "დღის რეჟიმი",
    placeholder: "გასეირნება 08:00 და 19:00, ძილი დივანზე...",
  },
  {
    key: "feeding",
    label: "კვების ინსტრუქცია",
    placeholder: "220 გ დილით, 220 გ საღამოს. წყალი ყოველთვის ხელმისაწვდომი.",
  },
  {
    key: "medication",
    label: "მედიკამენტები",
    placeholder: "ომეგა-3 დილით საკვებთან ერთად...",
  },
  {
    key: "behaviour",
    label: "ქცევითი შენიშვნები",
    placeholder: "ეშინია ჭექა-ქუხილის, არ უყვარს უცნობი ძაღლები...",
  },
  {
    key: "emergency",
    label: "გადაუდებელი ინსტრუქცია",
    placeholder: "ალერგიის შემთხვევაში დარეკე კლინიკაში...",
  },
];

function CaretakerCard({ pet }: { pet: Pet }) {
  const [editing, setEditing] = useState(false);
  const { save, saving, error } = useHistorySave(pet.id);
  const notes = pet.history?.caretaker ?? null;

  const [draft, setDraft] = useState<Omit<CaretakerNotes, "updatedAt">>({
    routine: notes?.routine ?? "",
    feeding: notes?.feeding ?? "",
    medication: notes?.medication ?? "",
    behaviour: notes?.behaviour ?? "",
    emergency: notes?.emergency ?? "",
  });

  const filled = NOTE_FIELDS.filter(
    (field) => (notes?.[field.key] ?? "").trim().length > 0,
  );

  const submit = async () => {
    const next: CaretakerNotes = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };
    if (await save({ caretaker: next })) setEditing(false);
  };

  return (
    <SectionCard
      id="caretaker"
      icon={NotebookPen}
      title="ინსტრუქცია მომვლელისთვის"
      description="რას უნდა იცოდეს ძაღლის მომვლელი ან სასტუმრო შენი არყოფნისას."
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
      {filled.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="ინსტრუქცია ჯერ არ არის"
          body="ჩაწერე დღის რეჟიმი, კვება და ქცევითი თავისებურებები, რომ მომვლელს ყველაფერი ხელთ ჰქონდეს."
        />
      ) : (
        <div className="space-y-3">
          {filled.map((field) => (
            <div key={field.key} className="rounded-2xl bg-[#FAFAF8] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {field.label}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                {notes?.[field.key]}
              </p>
            </div>
          ))}
          {notes?.updatedAt ? (
            <p className="text-xs text-slate-400">
              განახლდა {formatDate(notes.updatedAt)}
            </p>
          ) : null}
        </div>
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
            <div className="mt-5 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-5">
              {NOTE_FIELDS.map((field) => (
                <div key={field.key}>
                  <label className={fieldLabel} htmlFor={`note-${field.key}`}>
                    {field.label}
                  </label>
                  <textarea
                    id={`note-${field.key}`}
                    value={draft[field.key]}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className={`${textInput} mt-2 min-h-20 resize-none`}
                  />
                </div>
              ))}

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

export function ContactsPanel({ pet }: { pet: Pet }) {
  return (
    <>
      <VetCard pet={pet} />
      <CaretakerCard pet={pet} />
    </>
  );
}
