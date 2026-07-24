"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, PawPrint, Sparkles, User } from "lucide-react";
import { submitEarlyAdopter } from "@/app/early-access/actions";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProductInterestMultiSelect } from "@/components/early-access/ProductInterestMultiSelect";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { saveAdopterSession } from "@/lib/adopter-session";
import { BREED_SUGGESTIONS } from "@/lib/nutrition/types";
import {
  FEATURE_EXPECTATION_LABELS,
  GOAL_LABELS,
  REFERRAL_LABELS,
  primaryExpectationFromInterests,
  type EarlyAdopterInput,
  type ProductInterest,
} from "@/lib/leads/types";
import { fadeUp, motionEase, staggerContainer } from "@/lib/motion";

const inputClass =
  "w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10";

const labelClass = "block text-sm font-medium text-[var(--text-primary)]";

const ALLERGY_OPTIONS = [
  "ქათამი",
  "საქონლის ხორცი",
  "ლაქი",
  "ხორბალი",
  "სოი",
  "თევზი",
  "კვერცხი",
  "არ აქვს",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EarlyAdopterForm() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const { dict, locale } = useLocale();
  const wf = dict.waitlistForm;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    phone: "",
    city: "თბილისი",
    dogName: "",
    breed: "",
    ageMonths: 24,
    weightKg: 12,
    neutered: true,
    allergies: [] as string[],
    primaryGoal: "maintenance" as EarlyAdopterInput["primaryGoal"],
    productInterests: [] as ProductInterest[],
    featureExpectations: [] as EarlyAdopterInput["featureExpectations"],
    featureWishlist: "",
    referralSource: "instagram" as EarlyAdopterInput["referralSource"],
    notes: "",
    wantsDnaKit: false,
    consent: false,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const canContinue =
    step === 1
      ? form.ownerName.trim().length >= 2 &&
        EMAIL_RE.test(form.email.trim()) &&
        form.phone.replace(/\D/g, "").length >= 9 &&
        form.city.trim().length >= 2
      : step === 2
        ? form.dogName.trim().length >= 1 && form.breed.trim().length >= 1
        : step === 3
          ? form.productInterests.length >= 1 &&
            form.featureExpectations.length >= 1 &&
            form.featureWishlist.trim().length >= 10
          : form.consent;

  const toggleAllergy = (allergy: string) => {
    setForm((prev) => {
      if (allergy === "არ აქვს") {
        return { ...prev, allergies: ["არ აქვს"] };
      }
      const next = prev.allergies.filter((a) => a !== "არ აქვს");
      return {
        ...prev,
        allergies: next.includes(allergy)
          ? next.filter((a) => a !== allergy)
          : [...next, allergy],
      };
    });
  };

  const toggleFeatureExpectation = (
    feature: EarlyAdopterInput["featureExpectations"][number],
  ) => {
    setForm((prev) => ({
      ...prev,
      featureExpectations: prev.featureExpectations.includes(feature)
        ? prev.featureExpectations.filter((f) => f !== feature)
        : [...prev.featureExpectations, feature],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const payload: EarlyAdopterInput = {
      ownerName: form.ownerName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      dogName: form.dogName.trim(),
      breed: form.breed.trim(),
      ageMonths: form.ageMonths,
      weightKg: form.weightKg,
      neutered: form.neutered,
      allergies: form.allergies,
      primaryGoal: form.primaryGoal,
      productExpectation: primaryExpectationFromInterests(
        form.productInterests,
      ),
      productInterests: form.productInterests,
      featureExpectations: form.featureExpectations,
      featureWishlist: form.featureWishlist.trim(),
      referralSource: form.referralSource,
      notes: form.notes.trim() || undefined,
      wantsDnaKit: form.wantsDnaKit,
      consent: true,
    };

    const result = await submitEarlyAdopter(payload);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const email = form.email.trim().toLowerCase();
    const ownerName = form.ownerName.trim();
    const dogName = form.dogName.trim();

    saveAdopterSession({
      ownerName,
      email,
      dogName,
      position: result.position,
      registeredAt: new Date().toISOString(),
    });
    registerAuth({ name: ownerName, email });

    setSuccess(true);

    const params = new URLSearchParams({
      position: String(result.position),
      name: ownerName,
      dog: dogName,
      email,
    });

    window.setTimeout(() => {
      router.push("/onboarding/platform");
    }, 1200);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: motionEase }}
        className="mx-auto flex w-full max-w-xl flex-col items-center rounded-2xl border border-[var(--border-light)] bg-white px-8 py-14 text-center shadow-soft"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
        >
          <Sparkles className="h-8 w-8" />
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-5 text-2xl font-bold text-[var(--text-primary)]"
        >
          წარმატებით დარეგისტრირდი!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm text-[var(--text-secondary)]"
        >
          გადამისამართება...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          <span>
            ნაბიჯი {step} / {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border-light)]">
          <motion.div
            className="h-full rounded-full bg-[var(--terracotta,#df6a41)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: motionEase }}
          />
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: motionEase }}
        className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-soft sm:p-8"
      >
        {step === 1 && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                <User className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  შენი მონაცემები
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Early adopter სიაში რეგისტრაცია
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>სახელი *</span>
                <input
                  className={inputClass}
                  value={form.ownerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, ownerName: e.target.value }))
                  }
                  placeholder="შენი სახელი"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>{wf.email}</span>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>{wf.phone}</span>
                <input
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+995 5XX XX XX XX"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>ქალაქი *</span>
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                />
              </label>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                <PawPrint className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  შენი ძაღლი
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  პერსონალური რაციონისთვის
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>ძაღლის სახელი *</span>
                <input
                  className={inputClass}
                  value={form.dogName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dogName: e.target.value }))
                  }
                  placeholder="მაგ. კოკო"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>ჯიში *</span>
                <input
                  className={inputClass}
                  value={form.breed}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, breed: e.target.value }))
                  }
                  placeholder="აირჩიე ან ჩაწერე"
                  list="breed-suggestions"
                />
                <datalist id="breed-suggestions">
                  {BREED_SUGGESTIONS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>ასაკი (თვე) *</span>
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={form.ageMonths}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        ageMonths: Number(e.target.value),
                      }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelClass}>წონა (კგ) *</span>
                  <input
                    type="number"
                    min={0.5}
                    step={0.1}
                    className={inputClass}
                    value={form.weightKg}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        weightKg: Number(e.target.value),
                      }))
                    }
                  />
                </label>
              </div>
              <div>
                <span className={labelClass}>სტერილიზებულია?</span>
                <div className="mt-2 flex gap-2">
                  {[
                    { value: true, label: "კი" },
                    { value: false, label: "არა" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, neutered: opt.value }))
                      }
                      className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                        form.neutered === opt.value
                          ? "border-[var(--brand-primary)] bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
                          : "border-[var(--border-light)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className={labelClass}>ალერგიები</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALLERGY_OPTIONS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAllergy(a)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        form.allergies.includes(a)
                          ? "border-[var(--brand-primary)] bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
                          : "border-[var(--border-light)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  შენი მოლოდინები
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  დაგვეხმარე პროდუქტის განვითარებაში
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-5">
              <ProductInterestMultiSelect
                value={form.productInterests}
                onChange={(productInterests) =>
                  setForm((previous) => ({
                    ...previous,
                    productInterests,
                  }))
                }
                locale={locale}
                disabled={loading}
              />

              <div>
                <span className={labelClass}>
                  რა ფუნქციებს ელი პროდუქტისგან? * (მინ. 1)
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    Object.entries(FEATURE_EXPECTATION_LABELS) as [
                      EarlyAdopterInput["featureExpectations"][number],
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleFeatureExpectation(value)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        form.featureExpectations.includes(value)
                          ? "border-[var(--brand-primary)] bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]"
                          : "border-[var(--border-light)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>
                  {wf.featureWishlist} *
                </span>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  value={form.featureWishlist}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, featureWishlist: e.target.value }))
                  }
                  placeholder={wf.featureWishlistPlaceholder}
                />
              </label>
            </motion.div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.h2
              variants={fadeUp}
              className="text-xl font-bold text-[var(--text-primary)]"
            >
              მთავარი მიზანი
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-1 text-sm text-[var(--text-secondary)]">
              რატომ გინდა Aylopet-ის სცადება?
            </motion.p>

            <motion.div variants={fadeUp} className="mt-5 grid gap-2 sm:grid-cols-2">
              {(
                Object.entries(GOAL_LABELS) as [
                  EarlyAdopterInput["primaryGoal"],
                  string,
                ][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, primaryGoal: value }))}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    form.primaryGoal === value
                      ? "border-[var(--terracotta,#df6a41)] bg-[var(--terracotta,#df6a41)]/10 text-[var(--forest-deep,#0d2e27)]"
                      : "border-[var(--border-light)] text-[var(--text-secondary)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>

            <motion.label variants={fadeUp} className="mt-5 flex flex-col gap-1.5">
              <span className={labelClass}>საიდან გაიგე ჩვენს შესახებ?</span>
              <select
                className={inputClass}
                value={form.referralSource}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    referralSource: e.target
                      .value as EarlyAdopterInput["referralSource"],
                  }))
                }
              >
                {(
                  Object.entries(REFERRAL_LABELS) as [
                    EarlyAdopterInput["referralSource"],
                    string,
                  ][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </motion.label>

            <motion.label variants={fadeUp} className="mt-4 flex flex-col gap-1.5">
              <span className={labelClass}>დამატებითი შენიშვნა</span>
              <textarea
                className={`${inputClass} min-h-[80px] resize-none`}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="მაგ. კიბოს დიაგნოზი, მგრძნობიარე კუჭი..."
              />
            </motion.label>

            <motion.label
              variants={fadeUp}
              className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--background-secondary)] p-4"
            >
              <input
                type="checkbox"
                checked={form.wantsDnaKit}
                onChange={(e) =>
                  setForm((p) => ({ ...p, wantsDnaKit: e.target.checked }))
                }
                className="mt-1 accent-[var(--brand-primary)]"
              />
              <span className="text-sm text-[var(--text-body)]">
                მაინტერესებს DNA ტესტიც (მალე ხელმისაწვდომი იქნება)
              </span>
            </motion.label>

            <motion.label
              variants={fadeUp}
              className="mt-3 flex cursor-pointer items-start gap-3"
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) =>
                  setForm((p) => ({ ...p, consent: e.target.checked }))
                }
                className="mt-1 accent-[var(--brand-primary)]"
                required
              />
              <span className="text-sm text-[var(--text-secondary)]">
                ვეთანხმები, რომ Aylopet დამიკავშირდეს early adopter პროგრამის
                ფარგლებში და შეინახოს ჩემი მონაცემები.
              </span>
            </motion.label>

            <motion.div
              variants={fadeUp}
              className="mt-5 rounded-xl border border-[var(--brand-accent)]/30 bg-[var(--brand-accent-soft)] p-4 text-sm text-[var(--brand-primary)]"
            >
              🎁 Early adopter სტატუსი: 40% ფასდაკლება პირველ შეკვეთაზე + უფასო
              კონსულტაცია
            </motion.div>
          </motion.div>
        )}

        {error && (
          <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
        )}
      </motion.div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || loading}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          უკან
        </button>

        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            გაგრძელება
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canContinue || loading}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--terracotta,#df6a41)] px-6 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            რეგისტრაცია
          </button>
        )}
      </div>
    </div>
  );
}
