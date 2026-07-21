"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, PawPrint, UserPlus } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardStore";
import {
  ActivityRadioCards,
  BreedCombobox,
  TemperamentTags,
  fieldLabel,
  textInput,
} from "@/components/dashboard/FormControls";
import type { ActivityLevel, Temperament } from "@/lib/dashboard";

const schema = z.object({
  name: z.string().min(2, "მიუთითე სახელი"),
  email: z.string().email("არასწორი ელ. ფოსტა"),
  password: z.string().min(8, "მინიმუმ 8 სიმბოლო"),
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

type FormValues = z.infer<typeof schema>;

const steps = [
  { id: 1, label: "ანგარიში", icon: UserPlus },
  { id: 2, label: "შენი ძაღლი", icon: PawPrint },
];

export function OnboardingForm() {
  const router = useRouter();
  const { setAccount, addPet } = useDashboard();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
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

  const goNext = async () => {
    const valid = await trigger(["name", "email", "password"]);
    if (valid) setStep(2);
  };

  const onSubmit = (data: FormValues) => {
    setAccount({ name: data.name, email: data.email });
    const id = addPet({
      name: data.petName,
      breed: data.breed,
      weightKg: data.weightKg,
      activity: data.activity,
      temperament: data.temperament as Temperament[],
    });
    router.push(`/dashboard/pets/${id}`);
  };

  return (
    <div className="mx-auto max-w-xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-4">
        {steps.map((s, i) => {
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
              {i < steps.length - 1 && (
                <span className="h-px flex-1 bg-[#e5e7eb]" />
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2rem] border border-[#e5e7eb] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8"
      >
        {step === 1 && (
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
              <input id="name" className={textInput} placeholder="შენი სახელი" {...register("name")} />
              {errors.name && (
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
              {errors.email && (
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
              {errors.password && (
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

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--brand-primary)]">
                დაამატე შენი ძაღლი
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                ეს დაგვეხმარება პერსონალური რეკომენდაციების შექმნაში.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={fieldLabel} htmlFor="petName">
                ძაღლის სახელი
              </label>
              <input id="petName" className={textInput} placeholder="მაგ. რექსი" {...register("petName")} />
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

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-6 py-3.5 text-sm font-medium text-[var(--brand-primary)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <ArrowLeft className="h-4 w-4" />
                უკან
              </button>
              <button
                type="submit"
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)]"
              >
                დასრულება და პროფილზე გადასვლა
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
