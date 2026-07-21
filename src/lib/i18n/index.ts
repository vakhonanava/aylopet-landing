import { en } from "@/lib/i18n/locales/en";
import { ka } from "@/lib/i18n/locales/ka";
import type { Dictionary, Locale } from "@/lib/i18n/types";

export const dictionaries: Record<Locale, Dictionary> = { ka, en };

export const DEFAULT_LOCALE: Locale = "ka";

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export type { Dictionary, Locale };
