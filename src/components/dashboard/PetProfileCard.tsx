"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera, Dog } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import {
  ActivityRadioCards,
  BreedCombobox,
  TemperamentTags,
  fieldLabel,
  textInput,
} from "@/components/dashboard/FormControls";
import type { Pet, Temperament } from "@/lib/dashboard";

export function PetProfileCard({ pet }: { pet: Pet }) {
  const { updatePet } = useDashboard();
  const fileRef = useRef<HTMLInputElement>(null);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updatePet(pet.id, { avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#e5e7eb] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Header band */}
      <div className="relative h-28 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-hover)]">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-[var(--brand-accent)]/40 blur-2xl" />
        </div>
      </div>

      <div className="px-6 pb-8 sm:px-8">
        {/* Avatar */}
        <div className="-mt-12 mb-6 flex items-end justify-between">
          <div className="relative">
            <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              {pet.avatarUrl ? (
                <Image
                  src={pet.avatarUrl}
                  alt={pet.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-slate-400">
                  <Dog className="h-10 w-10" />
                </span>
              )}
            </div>
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
        </div>

        {/* Core stats */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel} htmlFor="pet-name">
              სახელი
            </label>
            <input
              id="pet-name"
              className={textInput}
              value={pet.name}
              onChange={(e) => updatePet(pet.id, { name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={fieldLabel}>ჯიში</label>
            <BreedCombobox
              value={pet.breed}
              onChange={(breed) => updatePet(pet.id, { breed })}
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
                value={Number.isFinite(pet.weightKg) ? pet.weightKg : ""}
                onChange={(e) =>
                  updatePet(pet.id, { weightKg: Number(e.target.value) })
                }
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                kg
              </span>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="mt-6 flex flex-col gap-2">
          <label className={fieldLabel}>ფიზიკური აქტივობის ტიპი</label>
          <ActivityRadioCards
            value={pet.activity}
            onChange={(activity) => updatePet(pet.id, { activity })}
          />
        </div>

        {/* Temperament */}
        <div className="mt-6 flex flex-col gap-2">
          <label className={fieldLabel}>ხასიათი & ტემპერამენტი</label>
          <TemperamentTags
            value={pet.temperament}
            onChange={(temperament) =>
              updatePet(pet.id, { temperament: temperament as Temperament[] })
            }
          />
        </div>
      </div>
    </section>
  );
}
