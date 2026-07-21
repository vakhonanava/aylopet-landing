"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { scrollToWaitlist } from "@/lib/navigation";

export function StickyMobileCta() {
  const { dict } = useLocale();
  const t = dict.stickyCta;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const waitlist = document.getElementById("waitlist");
    if (!waitlist) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.08, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(waitlist);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-light)] bg-white/95 p-3 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 ease-out lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="region"
      aria-label={t.label}
    >
      <button
        type="button"
        onClick={scrollToWaitlist}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-[var(--terracotta)] px-4 py-3.5 text-left text-white active:scale-[0.99]"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            <span className="block text-sm font-bold">{t.label}</span>
            <span className="block text-xs text-white/85">{t.sublabel}</span>
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
      </button>
    </div>
  );
}
