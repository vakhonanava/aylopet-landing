"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  id?: string;
  title: string;
  content: React.ReactNode;
}

export function Accordion({
  items,
  defaultOpenIndex = null,
}: {
  items: AccordionItem[];
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        const key = item.id ?? `${i}-${item.title}`;
        return (
          <div
            key={key}
            className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-soft"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[var(--forest-deep)] transition-colors hover:bg-[var(--background-secondary)] sm:text-[15px]"
              aria-expanded={open}
            >
              <span className="pr-2">{item.title}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--border-light)] px-5 py-4 text-sm leading-relaxed text-[var(--text-body)] [&_p]:text-[var(--text-body)] [&_li]:text-[var(--text-body)]">
                    {typeof item.content === "string" ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
