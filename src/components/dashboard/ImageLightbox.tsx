"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
  open: boolean;
  src: string | null;
  alt: string;
  onClose: () => void;
}

/**
 * Enlarged image preview. Rendered through a portal so the card's
 * `overflow-hidden` and stacking context can't clip or under-layer it.
 */
export function ImageLightbox({ open, src, alt, onClose }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Freeze the page behind the overlay, restoring whatever was set before.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && src ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--forest-deep)]/85 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.img
            src={src}
            alt={alt}
            // Stop propagation so clicking the photo itself doesn't dismiss.
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-[1.75rem] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="დახურვა"
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors hover:bg-white/22 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
