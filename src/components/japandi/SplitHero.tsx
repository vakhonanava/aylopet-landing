import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Scene3D } from "@/components/visual/Scene3D";

interface SplitHeroProps {
  title: string;
  children: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  priority?: boolean;
}

export function SplitHero({
  title,
  children,
  imageSrc,
  imageAlt,
  priority,
}: SplitHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[var(--background-main)] pt-8 pb-16 lg:pt-12 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <RevealOnScroll y={20}>
          <div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] sm:text-5xl">
              {title}
            </h1>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-[var(--text-body)]">
              {children}
            </div>
          </div>
        </RevealOnScroll>
        <RevealOnScroll y={20} delay={0.15}>
          <Scene3D
            src={imageSrc}
            alt={imageAlt}
            aspect="landscape"
            priority={priority}
            glow="sage"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
