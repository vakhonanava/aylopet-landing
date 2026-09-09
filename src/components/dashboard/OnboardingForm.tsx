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
  fieldLabel,
  textInput,
} from "@/components/dashboard/FormControls";
import { useDashboardCopy } from "@/components/dashboard/useDashboardCopy";
import type { ActivityLevel } from "@/lib/dashboard";
import type { DashboardCopy } from "@/lib/content/dashboard-copy";
import { createPetProfileInSupabase } from "@/lib/platform/pet-persistence";
import { createClient } from "@/utils/supabase/client";

/* Built per-render from the active locale so validation messages are
   translated too — they used to be hardcoded Georgian literals. */
function buildPetSchema(e: DashboardCopy["onboarding"]["errors"]) {
  return z.object({
    petName: z.string().min(1, e.dogName),
    breed: z.string().min(1, e.breed),
    weightKg: z
      .number({ message: e.weight })
      .positive(e.weightPositive)
      .max(120, e.weightMax),
    activity: z.enum(["low", "moderate", "high"], { message: e.activity }),
  });
}

function buildGuestSchema(e: DashboardCopy["onboarding"]["errors"]) {
  return z
    .object({
      name: z.string().min(2, e.name),
      email: z.string().email(e.email),
      password: z.string().min(8, e.password),
    })
    .merge(buildPetSchema(e));
}

type PetFormValues = z.infer<ReturnType<typeof buildPetSchema>>;
type GuestFormValues = z.infer<ReturnType<typeof buildGuestSchema>>;

export function OnboardingForm() {
  const router = useRouter();
  const { user, ready: authReady } = useAuth();
  const { setAccount, addPet } = useDashboard();
  const isAuthenticated = authReady && Boolean(user);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { d } = useDashboardCopy();
  const guestSteps = [
    { id: 1, label: d.onboarding.stepAccount, icon: UserPlus },
    { id: 2, label: d.onboarding.stepDog, icon: PawPrint },
  ];

  const schema = useMemo(
    () =>
      isAuthenticated
        ? buildPetSchema(d.onboarding.errors)
        : buildGuestSchema(d.onboarding.errors),
    [isAuthenticated, d.onboarding.errors],
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
        });

        if (petResult.error || !petResult.petId) {
          setSubmitError(petResult.error ?? d.onboarding.petCreateFailed);
          setSubmitting(false);
          return;
        }

        addPet(
          {
            name: petData.petName,
            breed: petData.breed,
            weightKg: petData.weightKg,
            activity: petData.activity,
          },
          { id: petResult.petId },
        );
        router.push(`/dashboard/pets/${petResult.petId}`);
      } catch {
        setSubmitError(d.onboarding.supabaseMissing);
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
          {d.onboarding.dogNameLabel}
        </label>
        <input
          id="petName"
          className={textInput}
          placeholder={d.onboarding.dogNamePlaceholder}
          {...register("petName")}
        />
        {errors.petName && (
          <p className="text-xs text-red-500">{errors.petName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel}>{d.pet.breed}</label>
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
          {d.pet.weightKg}
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
        <label className={fieldLabel}>{d.pet.activityType}</label>
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

    </>
  );

  if (!authReady) {
    return (
      <div className="flex h-48 items-center justify-center text-slate-400">
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
        {d.common.loading}
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
                {d.onboarding.accountTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {d.onboarding.accountSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="name">
                {d.onboarding.nameLabel}
              </label>
              <input
                id="name"
                className={textInput}
                placeholder={d.onboarding.namePlaceholder}
                {...register("name")}
              />
              {"name" in errors && errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="email">
                {d.onboarding.emailLabel}
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
                {d.onboarding.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                className={textInput}
                placeholder={d.onboarding.passwordPlaceholder}
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
              {d.onboarding.continue}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}

        {(isAuthenticated || step === 2) && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
                {isAuthenticated ? d.onboarding.dogTitleNew : d.onboarding.dogTitleFirst}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {d.onboarding.dogSubtitle}
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
                  {d.onboarding.back}
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
                    {isAuthenticated ? d.onboarding.submitAdd : d.onboarding.submitFinish}
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
