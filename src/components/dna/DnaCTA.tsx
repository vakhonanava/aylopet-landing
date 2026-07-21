import { Button } from "@/components/ui/Button";
import { DnaStrand } from "@/components/dna/DnaStrand";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { BRAND, DNA } from "@/lib/constants";

export function DnaCTA() {
  return (
    <footer id="start" className="pb-12">
      <section className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-hover)] px-8 py-20 text-center shadow-diffuse sm:px-16">
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
              <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[var(--brand-accent)]/40 blur-3xl" />
              <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#6b8f7d]/25 blur-3xl" />
            </div>
            <DnaStrand
              className="pointer-events-none absolute -right-4 top-0 h-full w-auto opacity-40"
              rungs={18}
              accent="#8fb3a3"
              base="#3f5249"
            />
            <DnaStrand
              className="pointer-events-none absolute -left-4 top-0 h-full w-auto opacity-25"
              rungs={18}
              accent="#6b8f7d"
              base="#3f5249"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
                {DNA.cta.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#d3e0da]">
                {DNA.cta.subheadline}
              </p>
              <div className="mt-10 flex justify-center">
                <Button href="#start" variant="onDark">
                  {DNA.cta.cta}
                </Button>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/5 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-primary)] text-xs font-bold text-white">
              A
            </span>
            <span className="text-sm font-semibold text-[var(--text-body)]">
              {BRAND.name}
            </span>
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} {BRAND.name}. DNA × AI × Nutrition.
          </p>
        </div>
      </section>
    </footer>
  );
}
