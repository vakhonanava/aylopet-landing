"use client";

import type { ReactNode } from "react";

export type IconType = "personalize" | "science" | "loyalty";

const paths: Record<IconType, ReactNode> = {
  personalize: (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden>
      <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M32 14l4-4M36 22h5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </svg>
  ),
  science: (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden>
      <rect x="10" y="28" width="6" height="12" stroke="currentColor" strokeWidth="1.5" />
      <rect x="21" y="20" width="6" height="20" stroke="currentColor" strokeWidth="1.5" />
      <rect x="32" y="12" width="6" height="28" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 40h36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-40 group-hover:opacity-100 transition-opacity"
      />
    </svg>
  ),
  loyalty: (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10" aria-hidden>
      <path
        d="M24 38s-14-9.5-14-18a8 8 0 0114-4 8 8 0 0114 4c0 8.5-14 18-14 18z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="transition-transform duration-300 group-hover:scale-105"
      />
    </svg>
  ),
};

export function ValueLineIcon({ type }: { type: IconType }) {
  return (
    <span className="text-[var(--brand-primary)] transition-colors duration-300 group-hover:text-[var(--brand-accent)]">
      {paths[type]}
    </span>
  );
}

export function DnaLeafFusion({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M100 20 C70 50 70 90 100 120 C130 90 130 50 100 20"
        stroke="var(--brand-primary)"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M100 80 C85 95 85 115 100 130 C115 115 115 95 100 80"
        stroke="var(--brand-accent)"
        strokeWidth="1.2"
        opacity="0.5"
      />
      <path
        d="M60 100 Q100 60 140 100"
        stroke="var(--brand-primary)"
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d="M100 140 L100 175 M92 168 L100 175 L108 168"
        stroke="var(--brand-accent)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="100" cy="175" r="3" fill="var(--status-emerald)" opacity="0.8" />
    </svg>
  );
}

export function GeometricPattern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="0.5"
            opacity="0.08"
          />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#grid)" />
    </svg>
  );
}
