"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getDashboardCopy, type DashboardCopy } from "@/lib/content/dashboard-copy";
import type { Locale } from "@/lib/i18n/types";

/** Dashboard copy for the active locale, plus the locale for label getters. */
export function useDashboardCopy(): { d: DashboardCopy; locale: Locale } {
  const { locale } = useLocale();
  const d = useMemo(() => getDashboardCopy(locale), [locale]);
  return { d, locale };
}
