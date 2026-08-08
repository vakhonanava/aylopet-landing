"use client";

import { LoaderCircle, MailCheck, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

export function EmailVerificationBanner() {
  const { user, ready, emailVerified, sendVerificationEmail } = useAuth();
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!ready || !user || emailVerified || dismissed) return null;

  const handleSend = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await sendVerificationEmail();
    if (result.error) {
      setError(a.errors[result.error]);
    } else {
      setMessage(a.verifySent);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6 rounded-[1.5rem] border border-amber-200/80 bg-amber-50/90 px-4 py-4 sm:px-5 print:hidden">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-950">
            {a.verifyPrompt}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/80">
            {a.verifyBody}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-800 disabled:opacity-60"
            >
              {loading ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <MailCheck className="h-3.5 w-3.5" />
              )}
              {a.verifySend}
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-full px-3 py-2 text-xs font-medium text-amber-800/80 transition hover:bg-amber-100"
            >
              {a.verifyLater}
            </button>
          </div>
          {message && (
            <p className="mt-2 text-xs text-emerald-700">{message}</p>
          )}
          {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1 text-amber-700/70 transition hover:bg-amber-100 hover:text-amber-900"
          aria-label={a.close}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
