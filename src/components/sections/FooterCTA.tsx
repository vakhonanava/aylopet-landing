import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Scene3D } from "@/components/visual/Scene3D";
import { CONTENT } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export function FooterCTA() {
  return (
    <section id="process" className="pb-20 pt-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealOnScroll>
          <div className="grain-texture relative overflow-hidden rounded-[var(--radius-bento)] border border-[var(--border-light)] bg-[var(--background-secondary)] shadow-diffuse">
            <div className="grid items-center lg:grid-cols-2">
              <div className="relative hidden min-h-[320px] lg:block">
                <Scene3D
                  src={IMAGES.production}
                  alt="Aylopet production process"
                  aspect="fill"
                  className="absolute inset-4"
                  glow="forest"
                  float={false}
                />
              </div>
              <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20 lg:text-left">
                <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
                  <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />
                </div>
                <div className="relative">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--forest-deep)] sm:text-4xl">
                    {CONTENT.footer.headline}
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--text-body)] lg:mx-0">
                    {CONTENT.footer.subheadline}
                  </p>
                  <div className="mt-10 flex justify-center lg:justify-start">
                    <Button href="/early-access">{CONTENT.footer.cta}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
