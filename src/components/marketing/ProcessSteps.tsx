import { Play } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

export function VideoPlaceholder({ caption }: { caption?: string }) {
  return (
    <RevealOnScroll className="mx-auto max-w-4xl px-6 pb-12 lg:px-8">
      <div
        className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[2rem] border border-[#e5e7eb] bg-[var(--brand-primary)]/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        role="img"
        aria-label="ვიდეო პლეისჰოლდერი"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Play className="ml-1 h-7 w-7" fill="currentColor" />
          </span>
          <p className="text-sm font-medium text-[var(--brand-primary)]">
            {caption ?? "ვიდეო მალე დაემატება"}
          </p>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export function ProcessSteps({ steps }: { steps: readonly string[] }) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-12 lg:px-8">
      <RevealOnScroll>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)]/[0.06] text-sm font-bold text-[var(--brand-primary)]">
                {i + 1}
              </span>
              <p className="pt-1.5 text-sm leading-relaxed text-slate-600">{step}</p>
            </li>
          ))}
        </ol>
      </RevealOnScroll>
    </section>
  );
}
