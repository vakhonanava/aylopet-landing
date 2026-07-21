"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  getDictionary,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

const STORAGE_KEY = "aylopet-locale";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "ka" || stored === "en") {
        setLocaleState(stored);
      }
      setReady(true);
    });
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "ka" ? "ka" : "en";
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ka" ? "en" : "ka");
  }, [locale, setLocale]);

  const dict = useMemo(() => getDictionary(locale), [locale]);

  if (!ready) {
    return (
      <LocaleContext.Provider
        value={{
          locale: DEFAULT_LOCALE,
          dict: getDictionary(DEFAULT_LOCALE),
          setLocale,
          toggleLocale,
        }}
      >
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, dict, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
