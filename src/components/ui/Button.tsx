import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "onDark" | "terracotta";
  showArrow?: boolean;
  className?: string;
}

const variantStyles = {
  primary:
    "bg-[var(--brand-primary)] text-white shadow-soft hover:bg-[var(--brand-primary-hover)] hover:shadow-organic",
  secondary:
    "border border-[var(--border-light)] bg-white text-[var(--text-primary)] hover:border-[var(--brand-accent)]/40 hover:shadow-soft",
  onDark:
    "bg-white text-[var(--brand-primary)] shadow-soft hover:bg-[var(--background-main)] hover:shadow-organic",
  terracotta:
    "bg-[var(--terracotta-bright)] text-white shadow-soft hover:brightness-95 hover:shadow-organic",
} as const;

export function Button({
  children,
  href = "#process",
  variant = "primary",
  showArrow = true,
  className = "",
}: ButtonProps) {
  const classNames = [
    "group inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-medium",
    "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]",
    variantStyles[variant],
    className,
  ].join(" ");

  const content = (
    <>
      {children}
      {showArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      )}
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classNames}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={classNames}>
      {content}
    </a>
  );
}
