"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getPlatformOnboardingCopy } from "@/lib/content/platform-onboarding";
import { BreedCombobox } from "@/components/dashboard/FormControls";
import { checkWaitlistDuplicate } from "@/app/onboarding/actions";
import {
  createPetProfile,
  deletePetDocument,
  fetchWaitlistCount,
  registerWaitlistUser,
  toggleExpectation,
  uploadPetDocument,
  upsertOwnerProfile,
} from "@/lib/platform/supabase";
import {
  ACCEPTED_PET_FILE_TYPES,
  MAX_PET_FILE_BYTES,
  PET_FILE_CATEGORIES,
  PET_PRIMARY_GOALS,
  WAITLIST_EXPECTATIONS,
  type PetFileCategory,
  type PetPrimaryGoal,
  type PetProfile,
  type UploadedFileMetadata,
  type WaitlistEntry,
  type WaitlistExpectation,
} from "@/lib/platform/types";
import { createClient } from "@/utils/supabase/client";

type OnboardingStep = 1 | 2 | 3;

const shell =
  "rounded-[2rem] border border-cyan-400/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,240,255,0.08)] backdrop-blur-xl sm:p-8";
const input =
  "w-full rounded-2xl border border-white/10 bg-[#111827]/80 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/15";
const pill =
  "rounded-full border px-3 py-2 text-xs font-medium transition duration-200";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function WaitlistCounterBadge({
  count,
  locale,
  suffix,
}: {
  count: number;
  locale: string;
  suffix: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-4 py-2 text-sm text-cyan-100"
    >
      <Sparkles className="h-4 w-4 text-cyan-300" />
      <span>
        <strong className="font-semibold tabular-nums text-white">
          {count.toLocaleString(locale === "ka" ? "ka-GE" : "en-US")}
        </strong>{" "}
        {suffix}
      </span>
    </motion.div>
  );
}

export function AyliopetOnboarding() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getPlatformOnboardingCopy(locale);
  const { user, displayName, email, ready: authReady } = useAuth();
  const supabase = useMemo(() => {
    try {
      return createClient();
    } catch {
      return null;
    }
  }, []);

  const [step, setStep] = useState<OnboardingStep>(1);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [petId, setPetId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileMetadata[]>([]);
  const [pendingUpload, setPendingUpload] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<PetFileCategory>("vet_medical");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [waitlist, setWaitlist] = useState<WaitlistEntry>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    expectations: [],
  });

  const [owner, setOwner] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [pet, setPet] = useState<PetProfile>({
    petName: "",
    breed: "",
    ageDob: "",
    gender: "male",
    isNeutered: false,
    weight: null,
    weightUnit: "kg",
    healthHistory: [],
    medicalNotes: "",
    primaryGoal: "",
  });

  const refreshCount = useCallback(async () => {
    if (!supabase) return;
    const count = await fetchWaitlistCount(supabase);
    setWaitlistCount(count);
  }, [supabase]);

  useEffect(() => {
    void refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    if (!authReady || !user) return;
    setUserId(user.id);
    setOwner({
      fullName: displayName,
      email: email || user.email || "",
      phone: "",
    });
    setWaitlist((current) => ({
      ...current,
      fullName: current.fullName || displayName,
      email: current.email || email || user.email || "",
    }));
  }, [authReady, user, displayName, email]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_PET_FILE_TYPES.includes(file.type as (typeof ACCEPTED_PET_FILE_TYPES)[number])) {
      return `${file.name}: ${t.errors.invalidFileType}`;
    }
    if (file.size > MAX_PET_FILE_BYTES) {
      return `${file.name}: ${t.errors.fileTooLarge}`;
    }
    return null;
  };

  const handleWaitlistSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError(t.errors.supabaseMissing);
      return;
    }
    if (waitlist.expectations.length === 0) {
      setError(t.errors.pickExpectation);
      return;
    }

    setLoading(true);
    setError(null);

    if (user?.id) {
      const { error: insertError } = await supabase.from("waitlist").insert({
        user_id: user.id,
        full_name: waitlist.fullName.trim() || displayName,
        email: (waitlist.email || email).trim().toLowerCase(),
        phone: waitlist.phone.trim(),
        expectations: waitlist.expectations,
      });
      if (insertError && !insertError.message.includes("duplicate")) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
      setUserId(user.id);
      setOwner({
        fullName: waitlist.fullName.trim() || displayName,
        email: (waitlist.email || email).trim().toLowerCase(),
        phone: waitlist.phone.trim(),
      });
      await refreshCount();
      setStep(2);
      setLoading(false);
      return;
    }

    const duplicateCheck = await checkWaitlistDuplicate(
      waitlist.email,
      waitlist.phone,
    );
    if (duplicateCheck.emailTaken || duplicateCheck.phoneTaken) {
      setError(t.errors.alreadyOnWaitlist);
      setLoading(false);
      return;
    }

    const result = await registerWaitlistUser(supabase, waitlist);
    if (result.error && !result.userId) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (!result.userId) {
      setError(result.error ?? t.errors.accountNotCreated);
      setLoading(false);
      return;
    }

    setUserId(result.userId);
    setOwner({
      fullName: waitlist.fullName.trim(),
      email: waitlist.email.trim().toLowerCase(),
      phone: waitlist.phone.trim(),
    });
    await refreshCount();
    setStep(2);
    setLoading(false);
  };

  const handlePetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !userId) return;
    if (!pet.petName.trim() || !pet.breed.trim()) {
      setError(t.errors.petFieldsMissing);
      return;
    }

    setLoading(true);
    setError(null);

    const profileResult = await upsertOwnerProfile(supabase, userId, owner);
    if (profileResult.error) {
      setError(profileResult.error);
      setLoading(false);
      return;
    }

    const petResult = await createPetProfile(supabase, userId, pet);
    if (petResult.error || !petResult.petId) {
      setError(petResult.error ?? t.errors.petCreateFailed);
      setLoading(false);
      return;
    }

    setPetId(petResult.petId);
    setStep(3);
    setLoading(false);
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!supabase || !userId || !petId) return;
    const list = Array.from(files);
    const validation = list.map(validateFile).filter(Boolean);
    if (validation.length) {
      setError(validation.join(" "));
      return;
    }

    setError(null);
    setPendingUpload(true);

    for (const file of list) {
      setPendingUpload(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      const result = await uploadPetDocument(supabase, {
        userId,
        petId,
        file,
        category: uploadCategory,
      });
      if (result.error || !result.metadata) {
        setError(result.error ?? t.errors.uploadFailed);
        continue;
      }
      setUploadedFiles((current) => [result.metadata!, ...current]);
    }

    setPendingUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = async (file: UploadedFileMetadata) => {
    if (!supabase) return;
    setError(null);
    const result = await deletePetDocument(supabase, file);
    if (result.error) {
      setError(result.error);
      return;
    }
    setUploadedFiles((current) => current.filter((item) => item.id !== file.id));
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <WaitlistCounterBadge
          count={waitlistCount}
          locale={locale}
          suffix={t.counterSuffix}
        />

        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-sm text-white/55">
            {t.stepIndicator.replace("{step}", String(step))}
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= item ? "bg-cyan-300" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className={shell}
          >
            {error && (
              <p className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            )}

            {step === 1 && (
              <form onSubmit={handleWaitlistSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">{t.stepOneTitle}</h2>
                  <p className="mt-1 text-sm text-white/50">
                    {t.stepOneSubtitle}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs text-white/45">{t.fullName}</span>
                    <input
                      className={input}
                      value={waitlist.fullName}
                      onChange={(e) =>
                        setWaitlist((c) => ({ ...c, fullName: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs text-white/45">{t.email}</span>
                    <input
                      type="email"
                      className={input}
                      value={waitlist.email}
                      onChange={(e) =>
                        setWaitlist((c) => ({ ...c, email: e.target.value }))
                      }
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs text-white/45">{t.phone}</span>
                    <input
                      className={input}
                      value={waitlist.phone}
                      onChange={(e) =>
                        setWaitlist((c) => ({ ...c, phone: e.target.value }))
                      }
                      required
                    />
                  </label>
                  {!user && (
                    <label className="sm:col-span-2">
                      <span className="mb-1.5 block text-xs text-white/45">{t.password}</span>
                      <input
                        type="password"
                        className={input}
                        minLength={6}
                        value={waitlist.password}
                        onChange={(e) =>
                          setWaitlist((c) => ({ ...c, password: e.target.value }))
                        }
                        required
                      />
                    </label>
                  )}
                </div>

                <div>
                  <p className="mb-2 text-xs text-white/45">
                    {t.expectationsLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WAITLIST_EXPECTATIONS.map((value) => {
                      const active = waitlist.expectations.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setWaitlist((c) => ({
                              ...c,
                              expectations: toggleExpectation(c.expectations, value),
                            }))
                          }
                          className={`${pill} ${
                            active
                              ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                              : "border-white/10 bg-white/[0.03] text-white/60 hover:border-cyan-300/20"
                          }`}
                        >
                          {t.expectationLabels[value]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 text-sm font-semibold text-[#0B0F17] transition hover:bg-cyan-200 disabled:opacity-60"
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t.continueCta}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-white/40">
                  {t.alreadyHaveAccount}{" "}
                  <Link href="/auth/login?next=/onboarding/platform" className="text-cyan-200 underline">
                    {t.signIn}
                  </Link>
                </p>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePetSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">{t.stepTwoTitle}</h2>
                  <p className="mt-1 text-sm text-white/50">
                    {t.ownerLine}: {owner.fullName || displayName}, {owner.email}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="mb-1.5 block text-xs text-white/45">{t.dogName}</span>
                    <input
                      className={input}
                      value={pet.petName}
                      onChange={(e) => setPet((c) => ({ ...c, petName: e.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs text-white/45">{t.breed}</span>
                    <BreedCombobox
                      variant="dark"
                      value={pet.breed}
                      onChange={(breed) => setPet((c) => ({ ...c, breed }))}
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs text-white/45">{t.ageOrDob}</span>
                    <input
                      className={input}
                      value={pet.ageDob}
                      onChange={(e) => setPet((c) => ({ ...c, ageDob: e.target.value }))}
                    />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-xs text-white/45">{t.weight}</span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className={input}
                        value={pet.weight ?? ""}
                        onChange={(e) =>
                          setPet((c) => ({
                            ...c,
                            weight: e.target.value ? Number(e.target.value) : null,
                          }))
                        }
                      />
                      <select
                        className={`${input} max-w-[88px]`}
                        value={pet.weightUnit}
                        onChange={(e) =>
                          setPet((c) => ({
                            ...c,
                            weightUnit: e.target.value as "kg" | "lbs",
                          }))
                        }
                      >
                        <option value="kg">kg</option>
                        <option value="lbs">lbs</option>
                      </select>
                    </div>
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["male", "female"] as const).map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setPet((c) => ({ ...c, gender }))}
                      className={`${pill} ${
                        pet.gender === gender
                          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                          : "border-white/10 text-white/60"
                      }`}
                    >
                      {gender === "male" ? t.male : t.female}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPet((c) => ({ ...c, isNeutered: !c.isNeutered }))}
                    className={`${pill} ${
                      pet.isNeutered
                        ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                        : "border-white/10 text-white/60"
                    }`}
                  >
                    {t.neutered}
                  </button>
                </div>

                <div>
                  <p className="mb-2 text-xs text-white/45">{t.primaryGoal}</p>
                  <div className="flex flex-wrap gap-2">
                    {PET_PRIMARY_GOALS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => setPet((c) => ({ ...c, primaryGoal: goal }))}
                        className={`${pill} ${
                          pet.primaryGoal === goal
                            ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                            : "border-white/10 text-white/60"
                        }`}
                      >
                        {t.primaryGoalLabels[goal]}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs text-white/45">{t.medicalNotes}</span>
                  <textarea
                    className={`${input} min-h-24 resize-y`}
                    value={pet.medicalNotes}
                    onChange={(e) =>
                      setPet((c) => ({ ...c, medicalNotes: e.target.value }))
                    }
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 text-sm font-semibold text-[#0B0F17] disabled:opacity-60"
                >
                  {loading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    t.uploadDocumentsCta
                  )}
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">{t.stepThreeTitle}</h2>
                  <p className="mt-1 text-sm text-white/50">
                    Private bucket: pet-documents / {userId?.slice(0, 8)}…
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PET_FILE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setUploadCategory(category)}
                      className={`${pill} ${
                        uploadCategory === category
                          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100"
                          : "border-white/10 text-white/60"
                      }`}
                    >
                      {t.fileCategoryLabels[category]}
                    </button>
                  ))}
                </div>

                <label
                  className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-300/25 bg-cyan-300/[0.04] px-5 py-8 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    void handleFiles(e.dataTransfer.files);
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.files) void handleFiles(e.target.files);
                    }}
                  />
                  <UploadCloud className="h-8 w-8 text-cyan-200" />
                  <p className="mt-3 text-sm font-medium">{t.dropzone}</p>
                  <p className="mt-1 text-xs text-white/40">PDF/JPEG/PNG, 10MB</p>
                </label>

                {pendingUpload && (
                  <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] p-4">
                    <p className="text-sm text-cyan-100">Analyzing file content…</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-cyan-300"
                        animate={{ width: ["10%", "90%", "100%"] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{file.fileName}</p>
                        <p className="text-xs text-white/40">
                          {formatBytes(file.fileSize)} ·{" "}
                          {t.fileCategoryLabels[file.category]}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          {t.uploadedOk}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeFile(file)}
                        className="rounded-xl p-2 text-white/40 hover:bg-red-400/10 hover:text-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      petId ? `/dashboard/pets/${petId}` : "/dashboard",
                    )
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3.5 text-sm font-semibold text-[#0B0F17]"
                >
                  {petId
                    ? t.finishEditProfile
                    : t.finishGoToDashboard}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-6 flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-xs leading-relaxed text-white/45">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300/70" />
          <p>
            {t.privacyNote}
          </p>
        </footer>
      </div>
    </div>
  );
}
