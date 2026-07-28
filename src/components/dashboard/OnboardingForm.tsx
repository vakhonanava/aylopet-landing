"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, PawPrint, UserPlus } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import {
  ActivityRadioCards,
  BreedCombobox,
  TemperamentTags,
  fieldLabel,
  textInput,
} from "@/components/dashboard/FormControls";
import type { ActivityLevel, Temperament } from "@/lib/dashboard";
import { createPetProfileInSupabase } from "@/lib/platform/pet-persistence";
import { createClient } from "@/utils/supabase/client";

const petSchema = z.object({
  petName: z.string().min(1, "მიუთითე ძაღლის სახელი"),
  breed: z.string().min(1, "აირჩიე ჯიში"),
  weightKg: z
    .number({ message: "მიუთითე წონა" })
    .positive("წონა უნდა იყოს დადებითი")
    .max(120, "შეამოწმე წონა"),
  activity: z.enum(["low", "moderate", "high"], {
    message: "აირჩიე აქტივობის ტიპი",
  }),
  temperament: z.array(z.string()),
});

const guestSchema = z
  .object({
    name: z.string().min(2, "მიუთითე სახელი"),
    email: z.string().email("არასწორი ელ. ფოსტა"),
    password: z.string().min(8, "მინიმუმ 8 სიმბოლო"),
  })
  .merge(petSchema);

type PetFormValues = z.infer<typeof petSchema>;
type GuestFormValues = z.infer<typeof guestSchema>;

const guestSteps = [
  { id: 1, label: "ანგარიში", icon: UserPlus },
  { id: 2, label: "შენი ძაღლი", icon: PawPrint },
];

export function OnboardingForm() {
  const router = useRouter();
  const { user, ready: authReady } = useAuth();
  const { setAccount, addPet } = useDashboard();
  const isAuthenticated = authReady && Boolean(user);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () => (isAuthenticated ? petSchema : guestSchema),
    [isAuthenticated],
  );

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<GuestFormValues | PetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      petName: "",
      breed: "",
      weightKg: undefined as unknown as number,
      activity: undefined as unknown as ActivityLevel,
      temperament: [],
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (isAuthenticated) {
      setStep(2);
    }
  }, [isAuthenticated]);

  const goNext = async () => {
    const valid = await trigger(["name", "email", "password"]);
    if (valid) setStep(2);
  };

  const savePetLocally = (data: PetFormValues) =>
    addPet(
      {
        name: data.petName,
        breed: data.breed,
        weightKg: data.weightKg,
        activity: data.activity,
        temperament: data.temperament as Temperament[],
      },
      undefined,
    );

  const onSubmit = async (data: GuestFormValues | PetFormValues) => {
    setSubmitError(null);
    setSubmitting(true);

    const petData = data as PetFormValues;

    if (isAuthenticated && user) {
      try {
        const supabase = createClient();
        const petResult = await createPetProfileInSupabase(supabase, user.id, {
          name: petData.petName,
          breed: petData.breed,
          weightKg: petData.weightKg,
          activity: petData.activity,
          temperament: petData.temperament as Temperament[],
        });

        if (petResult.error || !petResult.petId) {
          setSubmitError(petResult.error ?? "ცხოველის პროფილი ვერ შეიქმნა.");
          setSubmitting(false);
          return;
        }

        addPet(
          {
            name: petData.petName,
            breed: petData.breed,
            weightKg: petData.weightKg,
            activity: petData.activity,
            temperament: petData.temperament as Temperament[],
          },
          { id: petResult.petId },
        );
        router.push(`/dashboard/pets/${petResult.petId}`);
      } catch {
        setSubmitError("Supabase არ არის კონფიგურირებული.");
        setSubmitting(false);
      }
      return;
    }

    const guestData = data as GuestFormValues;
    setAccount({ name: guestData.name, email: guestData.email });
    const id = savePetLocally(petData);
    setSubmitting(false);
    router.push(`/dashboard/pets/${id}`);
  };

  const petFields = (
    <>
      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel} htmlFor="petName">
          ძაღლის სახელი
        </label>
        <input
          id="petName"
          className={textInput}
          placeholder="მაგ. რექსი"
          {...register("petName")}
        />
        {errors.petName && (
          <p className="text-xs text-red-500">{errors.petName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>ჯიში</label>
        <Controller
          control={control}
          name="breed"
          render={({ field }) => (
            <BreedCombobox
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.breed?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel} htmlFor="weightKg">
          წონა
        </label>
        <div className="relative">
          <input
            id="weightKg"
            type="number"
            step="0.1"
            className={`${textInput} pr-12`}
            placeholder="0"
            {...register("weightKg", { valueAsNumber: true })}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
            kg
          </span>
        </div>
        {errors.weightKg && (
          <p className="text-xs text-red-500">{errors.weightKg.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabel}>ფიზიკური აქტივობის ტიპი</label>
        <Controller
          control={control}
          name="activity"
          render={({ field }) => (
            <ActivityRadioCards
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.activity && (
          <p className="text-xs text-red-500">{errors.activity.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className={fieldLabel}>ხასიათი</label>
        <Controller
          control={control}
          name="temperament"
          render={({ field }) => (
            <TemperamentTags
              value={field.value as Temperament[]}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </>
  );

  if (!authReady) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-400">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        იტვირთება…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {!isAuthenticated && (
        <div className="mb-8 flex items-center gap-4">
          {guestSteps.map((s, i) => {
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                      active
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white"
                        : done
                          ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                          : "border-[#e5e7eb] bg-white text-slate-400"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                  </span>
                  <span
                    className={`text-sm font-medium ${active || done ? "text-[var(--brand-primary)]" : "text-slate-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < guestSteps.length - 1 && (
                  <span className="h-px flex-1 bg-[#e5e7eb]" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2rem] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
      >
        {!isAuthenticated && step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
                შექმენი ანგარიში
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                დაიწყე Aylopet-ის მოგზაურობა.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="name">
                სახელი
              </label>
              <input
                id="name"
                className={textInput}
                placeholder="შენი სახელი"
                {...register("name")}
              />
              {"name" in errors && errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="email">
                ელ. ფოსტა
              </label>
              <input
                id="email"
                type="email"
                className={textInput}
                placeholder="you@example.com"
                {...register("email")}
              />
              {"email" in errors && errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="password">
                პაროლი
              </label>
              <input
                id="password"
                type="password"
                className={textInput}
                placeholder="მინიმუმ 8 სიმბოლო"
                {...register("password")}
              />
              {"password" in errors && errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]"
            >
              გაგრძელება
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {(isAuthenticated || step === 2) && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
                {isAuthenticated ? "ახალი ძაღლის პროფილი" : "დაამატე შენი ძაღლი"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                ეს დაგვეხმარება პერსონალური რეკომენდაციების შექმნაში.
              </p>
            </div>

            {petFields}

            {submitError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <div className="mt-2 flex items-center gap-3">
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-6 py-3.5 text-sm font-medium text-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  უკან
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] disabled:opacity-60"
              >
                {submitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isAuthenticated ? "ძაღლის დამატება" : "დასრულება და პროფილზე გადასვლა"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
