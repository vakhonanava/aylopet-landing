"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, TriangleAlert, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Dashboard-wide save feedback.
 *
 * Every editor used to signal success only by flipping its own button label for
 * a couple of seconds, which owners read as "nothing happened" — especially when
 * the panel collapsed on save and took the label with it. A toast outlives the
 * form that produced it, so the confirmation is still on screen after the panel
 * closes. Errors stay until dismissed; successes fade on their own.
 */

type ToastTone = "success" | "error";

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  dismiss: (id: number) => void;
}

const SUCCESS_TTL_MS = 4500;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, number>());

  useEffect(
    () => () => {
      timers.current.forEach((handle) => window.clearTimeout(handle));
      timers.current.clear();
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    const handle = timers.current.get(id);
    if (handle !== undefined) {
      window.clearTimeout(handle);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current++;
      // Only ever show the newest note — stacked confirmations from a rapid
      // series of saves are noise, not information.
      setItems([{ id, tone, message }]);
      if (tone === "success") {
        timers.current.set(
          id,
          window.setTimeout(() => dismiss(id), SUCCESS_TTL_MS),
        );
      }
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message: string) => push("success", message),
      error: (message: string) => push("error", message),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end print:hidden"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_40px_rgb(0,0,0,0.12)] ${
                item.tone === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {item.tone === "success" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              )}
              <p className="min-w-0 flex-1 text-sm font-medium">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="-mr-1 shrink-0 cursor-pointer rounded-full p-1 opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">×</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Safe outside a ToastProvider — panels are also rendered by the public vet
 * report view, which has no dashboard shell around it.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  const noop = useMemo<ToastContextValue>(
    () => ({ success: () => {}, error: () => {}, dismiss: () => {} }),
    [],
  );
  return ctx ?? noop;
}
