interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass =
    align === "center"
      ? "mx-auto text-center"
      : "text-left lg:mx-0";

  return (
    <header className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--terracotta)]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-[var(--forest-deep)] sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          {description}
        </p>
      )}
    </header>
  );
}
