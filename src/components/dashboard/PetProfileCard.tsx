"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Dog,
  History,
  LoaderCircle,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import { ImageLightbox } from "@/components/dashboard/ImageLightbox";
import {
  ActivityRadioCards,
  BreedCombobox,
  fieldLabel,
  textInput,
} from "@/components/dashboard/FormControls";
import {
  ACTIVITY_OPTIONS,
  formatDate,
  type ActivityLevel,
  type Pet,
  type PetProfileSnapshot,
} from "@/lib/dashboard";
import { petToPayload, profilesEqual } from "@/lib/platform/pet-persistence";

function snapshotPayload(snapshot: PetProfileSnapshot) {
  return {
    name: snapshot.name,
    breed: snapshot.breed,
    weightKg: snapshot.weightKg,
    activity: snapshot.activity,
    avatarUrl: snapshot.avatarUrl,
  };
}

function CompareRow({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) {
  const changed = before !== after;
  return (
    <div className="grid gap-1 rounded-xl bg-[#FAFAF8] px-3 py-2 sm:grid-cols-[120px_1fr_1fr] sm:items-center sm:gap-3">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className={`text-sm ${changed ? "text-slate-400 line-through" : "text-[var(--brand-primary)]"}`}>
        {before || "·"}
      </span>
      <span className={`text-sm font-medium ${changed ? "text-[var(--brand-primary)]" : "text-slate-600"}`}>
        {after || "·"}
      </span>
    </div>
  );
}

function ProfileHistoryPanel({
  pet,
  current,
  onRestore,
}: {
  pet: Pet;
  current: ReturnType<typeof petToPayload>;
  onRestore: (snapshot: PetProfileSnapshot) => void;
}) {
  const { removeProfileSnapshot } = useDashboard();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  if (pet.profileHistory.length === 0) return null;

  return (
    <div className="mt-8 border-t border-[#e5e7eb] pt-6">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-4 w-4 text-[var(--brand-primary)]" />
        <h3 className="text-sm font-bold text-[var(--brand-primary)]">
          წინა მონაცემები, {pet.profileHistory.length}
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {pet.profileHistory.map((snapshot) => {
          const expanded = expandedId === snapshot.id;
          const snap = snapshotPayload(snapshot);
          return (
            <article
              key={snapshot.id}
              className="rounded-2xl border border-[#e5e7eb] bg-[#FAFAF8] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--brand-primary)]">{snapshot.name}</p>
                  <p className="text-xs text-slate-400">
                    შენახულია, {formatDate(snapshot.savedAt.slice(0, 10))}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : snapshot.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-primary)]"
                  >
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    შედარება
                  </button>
                  <button
                    type="button"
                    onClick={() => onRestore(snapshot)}
                    className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-medium text-[var(--brand-primary)]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    რედაქტირება
                  </button>
                  <button
                    type="button"
                    disabled={busyId === snapshot.id}
                    onClick={async () => {
                      setBusyId(snapshot.id);
                      await removeProfileSnapshot(pet.id, snapshot.id);
                      setBusyId(null);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    წაშლა
                  </button>
                </div>
              </div>
              {expanded && (
                <div className="mt-4 space-y-2">
                  <div className="hidden text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:grid sm:grid-cols-[120px_1fr_1fr] sm:gap-3">
                    <span>ველი</span>
                    <span>წინა</span>
                    <span>ამჟამინდელი</span>
                  </div>
                  <CompareRow label="სახელი" before={snap.name} after={current.name} />
                  <CompareRow label="ჯიში" before={snap.breed} after={current.breed} />
                  <CompareRow
                    label="წონა"
                    before={`${snap.weightKg} kg`}
                    after={`${current.weightKg} kg`}
                  />
                  <CompareRow
                    label="აქტივობა"
                    before={ACTIVITY_OPTIONS.find((o) => o.value === snap.activity)?.label ?? snap.activity}
                    after={ACTIVITY_OPTIONS.find((o) => o.value === current.activity)?.label ?? current.activity}
                  />
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function PetProfileCard({ pet }: { pet: Pet }) {
  const { savePetProfile } = useDashboard();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(() => petToPayload(pet));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setDraft(petToPayload(pet));
  }, [pet.id, pet.name, pet.breed, pet.weightKg, pet.activity, pet.avatarUrl]);

  const saved = useMemo(() => petToPayload(pet), [pet]);
  const isDirty = useMemo(() => !profilesEqual(saved, draft), [saved, draft]);

  const patchDraft = (patch: Partial<typeof draft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setSavedNotice(false);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      patchDraft({ avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const result = await savePetProfile(pet.id, draft);
    setSaving(false);
    if (!result.ok) {
      setSaveError(result.error ?? "შენახვა ვერ მოხერხდა.");
      return;
    }
    setSavedNotice(true);
  };

  return (
    <>
    <section className="overflow-hidden rounded-[2rem] border border-[#e5e7eb] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="relative h-28 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)]">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[var(--brand-accent)]/40 blur-2xl" />
        </div>
      </div>

      <div className="px-6 pb-8 sm:px-8">
        <div className="-mt-12 mb-6 flex items-end justify-between gap-4">
          <div className="relative">
            {draft.avatarUrl ? (
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label={`${draft.name || "ძაღლის"} ფოტოს გადიდება`}
                className="group size-24 cursor-zoom-in overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-transform duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
              >
                <Image
                  src={draft.avatarUrl}
                  alt={draft.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </button>
            ) : (
              <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <span className="flex h-full w-full items-center justify-center text-slate-400">
                  <Dog className="h-10 w-10" />
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[var(--brand-primary)] text-white transition-transform hover:scale-105"
              aria-label="ფოტოს ატვირთვა"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col items-end gap-2">
            {isDirty && (
              <>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  შეუნახავი ცვლილებები
                </span>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  შენახვა
                </button>
              </>
            )}
          </div>
        </div>

        {saveError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {saveError}
          </p>
        )}
        {savedNotice && !isDirty && (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            ცვლილებები შენახულია.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pet-name">
              სახელი
            </label>
            <input
              id="pet-name"
              className={textInput}
              value={draft.name}
              onChange={(e) => patchDraft({ name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>ჯიში</label>
            <BreedCombobox
              value={draft.breed}
              onChange={(breed) => patchDraft({ breed })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pet-weight">
              წონა
            </label>
            <div className="relative">
              <input
                id="pet-weight"
                type="number"
                step="0.1"
                className={`${textInput} pr-12`}
                value={Number.isFinite(draft.weightKg) ? draft.weightKg : ""}
                onChange={(e) =>
                  patchDraft({ weightKg: Number(e.target.value) })
                }
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                kg
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <label className={fieldLabel}>ფიზიკური აქტივობის ტიპი</label>
          <ActivityRadioCards
            value={draft.activity}
            onChange={(activity) => patchDraft({ activity: activity as ActivityLevel })}
          />
        </div>

        <ProfileHistoryPanel
          pet={pet}
          current={draft}
          onRestore={(snapshot) => {
            setDraft(snapshotPayload(snapshot));
            setSavedNotice(false);
          }}
        />
      </div>
    </section>

    <ImageLightbox
      open={zoomOpen}
      src={draft.avatarUrl ?? null}
      alt={draft.name || "ძაღლის ფოტო"}
      onClose={() => setZoomOpen(false)}
    />
    </>
  );
}
