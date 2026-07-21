"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { submitB2BInquiry } from "@/app/b2b/actions";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  b2bPartnershipTypes,
  type B2BInquiryInput,
} from "@/lib/b2b/types";
import { motionEase } from "@/lib/motion";

const inputClass =
  "w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]/40 focus:ring-2 focus:ring-[var(--brand-primary)]/10";

const labelClass = "block text-sm font-medium text-[var(--text-primary)]";

export function B2BInquiryForm() {
  const { dict } = useLocale();
  const f = dict.b2bForm;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "vet-clinic" as B2BInquiryInput["partnershipType"],
    message: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitB2BInquiry({
      companyName: form.companyName.trim(),
      contactName: form.contactName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      partnershipType: form.partnershipType,
      message: form.message.trim(),
      website: form.website,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setEmailed(result.emailed);
    setSuccess(true);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: motionEase }}
        className="rounded-2xl border border-[var(--border-light)] bg-white p-10 text-center shadow-soft"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
          <Check className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-[var(--forest-deep)]">
          {f.successTitle}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-body)]">
          {emailed ? f.successEmailed : f.successSaved}
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border-light)] bg-white p-6 shadow-soft sm:p-8"
    >
      <h2 className="text-xl font-bold text-[var(--forest-deep)]">{f.title}</h2>
      <p className="mt-2 text-sm text-[var(--text-body)]">{f.subtitle}</p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{f.companyName}</span>
            <input
              className={inputClass}
              value={form.companyName}
              onChange={(e) =>
                setForm((p) => ({ ...p, companyName: e.target.value }))
              }
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{f.contactName}</span>
            <input
              className={inputClass}
              value={form.contactName}
              onChange={(e) =>
                setForm((p) => ({ ...p, contactName: e.target.value }))
              }
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{f.workEmail}</span>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>{f.phone}</span>
            <input
              type="tel"
              className={inputClass}
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+995 5XX XX XX XX"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>{f.partnershipType}</span>
          <select
            className={inputClass}
            value={form.partnershipType}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                partnershipType: e.target
                  .value as B2BInquiryInput["partnershipType"],
              }))
            }
          >
            {b2bPartnershipTypes.map((type) => (
              <option key={type} value={type}>
                {f.partnershipTypes[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>{f.partnershipGoals}</span>
          <textarea
            className={`${inputClass} min-h-[120px] resize-y`}
            value={form.message}
            onChange={(e) =>
              setForm((p) => ({ ...p, message: e.target.value }))
            }
            placeholder={f.goalsPlaceholder}
            required
          />
        </label>

        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />
      </div>

      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {f.submit}
      </button>
    </form>
  );
}
