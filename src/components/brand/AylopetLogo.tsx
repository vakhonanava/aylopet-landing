import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";

const sizes = {
  sm: { box: "h-8 w-8", text: "text-base" },
  md: { box: "h-9 w-9", text: "text-lg" },
  lg: { box: "h-11 w-11", text: "text-xl" },
} as const;

interface AylopetLogoProps {
  showWordmark?: boolean;
  compact?: boolean;
  size?: keyof typeof sizes;
  href?: string | null;
  className?: string;
}

export function AylopetLogo({
  showWordmark = true,
  compact = false,
  size = "md",
  href = "/",
  className = "",
}: AylopetLogoProps) {
  const s = sizes[size];

  const content = (
    <>
      <span
        className={`${s.box} relative shrink-0 text-[var(--brand-primary)]`}
        aria-hidden
      >
        <Image
          src="/brand/logo.svg"
          alt={`${BRAND.name} logo`}
          width={36}
          height={36}
          className="h-full w-full"
          priority
        />
      </span>
      {showWordmark && (
        <span
          className={`${s.text} font-bold tracking-tight text-[var(--text-primary)] ${compact ? "hidden sm:inline" : ""}`}
        >
          {BRAND.name}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80 ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>{content}</div>
  );
}
