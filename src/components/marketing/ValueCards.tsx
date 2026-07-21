import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

interface ValueCard {
  title: string;
  body: string;
}

export function ValueCards({ items }: { items: readonly ValueCard[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item, i) => (
          <RevealOnScroll key={item.title} y={20} delay={0.08 * i}>
            <article className="h-full rounded-[2rem] border border-[#e5e7eb] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
              <h3 className="text-lg font-bold tracking-tight text-[var(--brand-primary)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.body}
              </p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
