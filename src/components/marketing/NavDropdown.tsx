"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NavChild } from "@/lib/navigation";
import { isNavActive, isNavGroupActive } from "@/lib/navigation";

interface NavDropdownProps {
  label: string;
  items: NavChild[];
  pathname: string;
  onNavigate?: () => void;
  mega?: boolean;
}

export function NavDropdown({
  label,
  items,
  pathname,
  onNavigate,
  mega = true,
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isNavGroupActive(pathname, items);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative shrink-0 overflow-visible"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-lg px-1 py-1.5 text-[11px] font-semibold leading-none tracking-tight transition-colors duration-200 hover:bg-[var(--background-secondary)] hover:text-[var(--brand-primary)] xl:px-1.5 xl:py-2 xl:text-xs 2xl:px-2 2xl:text-sm ${
          active ? "text-[var(--brand-primary)]" : "text-[var(--text-primary)]"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-3 w-3 shrink-0 transition-transform duration-300 xl:h-3.5 xl:w-3.5 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`glass-dropdown absolute left-0 top-full z-[60] mt-1 rounded-2xl border border-[var(--border-light)] bg-white p-2 shadow-[var(--shadow-card-hover)] ${
              mega ? "min-w-[280px]" : "min-w-[220px]"
            }`}
          >
            {items.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.18 }}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={`block rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--background-secondary)] ${
                    isNavActive(pathname, item.href)
                      ? "bg-[var(--brand-accent-soft)]"
                      : ""
                  }`}
                >
                  <span
                    className={`block text-sm font-medium ${
                      isNavActive(pathname, item.href)
                        ? "text-[var(--brand-primary)]"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                      {item.description}
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
