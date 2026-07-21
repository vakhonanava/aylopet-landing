"use client";

interface TypingIndicatorProps {
  label?: string;
  className?: string;
}

/** Messenger-style bouncing dots while the assistant is “typing”. */
export function TypingIndicator({
  label = "AylopetAI is typing",
  className = "",
}: TypingIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3.5 shadow-sm ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot h-2 w-2 rounded-full bg-[var(--forest-deep)]/50"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </div>
  );
}
