"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Sparkles, User } from "lucide-react";
import { submitQuickAdopter } from "@/app/early-access/actions";
import { useAuth } from "@/components/auth/AuthProvider";
import { ProductInterestMultiSelect } from "@/components/early-access/ProductInterestMultiSelect";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { saveAdopterSession } from "@/lib/adopter-session";
import type { ProductInterest } from "@/lib/leads/types";

const inputClass =
  "w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10";

const labelClass = "block text-sm font-medium text-[var(--text-primary)]";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EarlyAdopterQuickForm({ leadCount = 0 }: { leadCount?: number }) {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const { dict, locale } = useLocale();
  const wf = dict.waitlistForm;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    phone: "",
    city: "თბილისი",
    dogName: "",
    productInterests: [] as ProductInterest[],
  });

  const canSubmit =
    form.ownerName.trim().length >= 2 &&
    EMAIL_RE.test(form.email.trim()) &&
    form.phone.replace(/\D/g, "").length >= 9 &&
    form.productInterests.length > 0 &&
    consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);

    const result = await submitQuickAdopter({
      ownerName: form.ownerName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      dogName: form.dogName.trim() || undefined,
      productInterests: form.productInterests,
      consent: true,
    });

    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    const email = form.email.trim().toLowerCase();
    const ownerName = form.ownerName.trim();
    const dogName = form.dogName.trim() || "·";

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
      router.push(`/early-access/success?${params.toString()}`);
    }, 900);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[var(--border-light)] bg-white p-10 text-center shadow-soft"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
          <Check className="h-7 w-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-[var(--forest-deep)]">{wf.successTitle}</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{wf.successRedirect}</p>
      </motion.div>
    );
  }

  const countLabel =
    leadCount > 0
      ? wf.familiesJoined.replace("{count}", String(leadCount))
      : dict.projectStatus.beAmongFirst;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--terracotta)] text-white">
          <User className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-[var(--forest-deep)]">{wf.quickTitle}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{wf.quickSubtitle}</p>
        </div>
      </div>

      <p className="mb-4 rounded-xl bg-[var(--brand-accent-soft)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--brand-primary)]">
        {countLabel}
      </p>

      <div className="space-y-4">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>{wf.name}</span>
          <input
            className={inputClass}
            value={form.ownerName}
            onChange={(e) => setForm((p) => ({ ...p, ownerName: e.target.value }))}
            placeholder={wf.namePlaceholder}
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{wf.email}</span>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{wf.phone}</span>
            <input
              type="tel"
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+995 5XX XX XX XX"
              required
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{wf.dogName}</span>
            <input
              className={inputClass}
              value={form.dogName}
              onChange={(e) => setForm((p) => ({ ...p, dogName: e.target.value }))}
              placeholder={wf.dogNamePlaceholder}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{wf.city}</span>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            />
          </label>
        </div>

        <ProductInterestMultiSelect
          value={form.productInterests}
          onChange={(productInterests) =>
            setForm((previous) => ({ ...previous, productInterests }))
          }
          locale={locale}
          disabled={loading}
        />

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--border-light)] text-[var(--brand-primary)]"
          />
          <span className="text-sm text-[var(--text-body)]">{wf.consent}</span>
        </label>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--text-tertiary)]">{wf.privacy}</p>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--terracotta)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {wf.submit}
      </button>

      <p className="mt-4 text-center">
        <Link
          href="/early-access"
          className="text-sm font-medium text-[var(--brand-primary)] underline-offset-2 hover:underline"
        >
          {wf.fullProfileLink}
        </Link>
      </p>
    </form>
  );
}
