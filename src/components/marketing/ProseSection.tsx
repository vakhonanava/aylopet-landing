import type { ReactNode } from "react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ProseSectionProps {
  children: ReactNode;
  className?: string;
}

export function ProseSection({ children, className = "" }: ProseSectionProps) {
  return (
    <section className={`mx-auto max-w-3xl px-6 pb-16 lg:px-8 ${className}`}>
      <RevealOnScroll>
        <div className="space-y-6 text-base leading-relaxed text-slate-600 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[var(--brand-primary)] [&_p+p]:mt-4">
          {children}
        </div>
      </RevealOnScroll>
    </section>
  );
}
