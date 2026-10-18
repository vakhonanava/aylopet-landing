import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/constants";

// The mark is about twice as tall as it is wide, so the boxes run a little
// larger than a square logo would need.
const sizes = {
  sm: { box: "h-9 w-9", text: "text-base" },
  md: { box: "h-10 w-10", text: "text-lg" },
  lg: { box: "h-12 w-12", text: "text-xl" },
} as const;

interface AylopetLogoProps {
  showWordmark?: boolean;
  compact?: boolean;
  size?: keyof typeof sizes;
  href?: string | null;
  className?: string;
  onClick?: () => void;
}

export function AylopetLogo({
  showWordmark = true,
  compact = false,
  size = "md",
  href = "/",
  className = "",
  onClick,
}: AylopetLogoProps) {
  const s = sizes[size];

  const content = (
    <>
      <span
        className={`${s.box} relative shrink-0 text-[var(--brand-primary)]`}
        aria-hidden
      >
        <Image
          src="/brand/logo.png"
          alt={`${BRAND.name} logo`}
          width={255}
          height={512}
          className="h-full w-full object-contain"
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
        onClick={onClick}
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
