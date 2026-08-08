import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

/** No back link · the logo in the header is the way back to the home page. */
export function PageHero({ title, subtitle, eyebrow }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--background-main)] pt-24 pb-12 lg:pt-32 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-[460px] w-[460px] rounded-full bg-[var(--brand-primary)]/8 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
        {eyebrow && (
          <RevealOnScroll y={16} delay={0.05}>
            <span className="mb-4 inline-block rounded-full bg-[var(--brand-accent-soft)] px-4 py-1.5 text-sm font-medium text-[var(--brand-primary)]">
              {eyebrow}
            </span>
          </RevealOnScroll>
        )}
        <RevealOnScroll y={16} delay={0.1}>
          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {title}
          </h1>
        </RevealOnScroll>
        {subtitle && (
          <RevealOnScroll y={16} delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-body)]">
              {subtitle}
            </p>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}
