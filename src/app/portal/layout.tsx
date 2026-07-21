import Link from "next/link";
import { Dna, MessageCircle } from "lucide-react";

const PORTAL_LINKS = [
  {
    href: "/products/aylopet-ai#chat",
    label: "AylopetAI",
    icon: MessageCircle,
  },
  {
    href: "/dna-journey",
    label: "DNA Platform",
    icon: Dna,
  },
] as const;

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bone-alabaster)]">
      <div className="border-b border-[var(--oat-soft)] bg-[var(--forest-deep)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-[var(--bone-alabaster)]"
          >
            Aylopet Platform
          </Link>
          <nav className="flex flex-wrap gap-2">
            {PORTAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/80 transition-colors duration-300 hover:border-white/35 hover:text-white"
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
