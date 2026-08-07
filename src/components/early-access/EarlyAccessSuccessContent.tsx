"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { CheckCircle2, Share2 } from "lucide-react";
import { AmbassadorProgram } from "@/components/early-access/AmbassadorProgram";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface EarlyAccessSuccessContentProps {
  position: string;
  name: string;
  dog: string;
}

export function EarlyAccessSuccessContent({
  position,
  name,
  dog,
}: EarlyAccessSuccessContentProps) {
  const { dict } = useLocale();
  const s = dict.earlyAccessSuccess;

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text = s.shareHint;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Aylopet", text, url });
      } catch {
        /* user cancelled */
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${url}`);
    }
  }, [s.shareHint]);

  return (
    <div className="w-full max-w-md text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-primary)]">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-3xl font-bold text-[var(--text-primary)]">
        {s.title.replace("{name}", name)}
      </h1>
      <p className="mt-3 text-[var(--text-body)]">
        {s.registered.replace("{dog}", dog)}
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {s.queuePosition.replace("{position}", position)}
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--border-light)] bg-white p-6 text-left text-sm text-[var(--text-body)] shadow-soft">
        <p className="font-semibold text-[var(--text-primary)]">{s.nextTitle}</p>
        <ul className="mt-3 space-y-2">
          {s.nextItems.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-emerald)]"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <AmbassadorProgram className="mt-6" />

      <div className="mt-6 rounded-2xl border border-dashed border-[var(--terracotta)]/40 bg-[var(--terracotta)]/5 p-5 text-left">
        <p className="font-semibold text-[var(--forest-deep)]">{s.shareTitle}</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.shareHint}</p>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">{s.referralHint}</p>
        <button
          type="button"
          onClick={handleShare}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border-light)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-primary)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Share2 className="h-4 w-4" aria-hidden />
          {s.shareButton}
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products/aylopet-ai#chat"
          className="rounded-full bg-[var(--brand-primary)] px-6 py-3 text-sm font-medium text-white"
        >
          {s.tryAi}
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[var(--border-light)] bg-white px-6 py-3 text-sm font-medium text-[var(--brand-primary)]"
        >
          {s.backHome}
        </Link>
      </div>
    </div>
  );
}
