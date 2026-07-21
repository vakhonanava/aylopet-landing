export function PulsingStatusDot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-2.5 w-2.5 ${className}`}
      aria-hidden
    >
      <span className="absolute inline-flex h-full w-full animate-pulse-emerald rounded-full bg-[var(--status-emerald)]" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--status-emerald)]" />
    </span>
  );
}
