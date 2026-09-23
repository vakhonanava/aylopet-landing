"use client";

import { useState, type InputHTMLAttributes } from "react";

/**
 * Normalises typed decimal text: a comma (the Georgian keyboard's decimal key)
 * becomes a dot, and only digits plus a single dot survive.
 */
export function sanitizeDecimal(raw: string): string {
  const cleaned = raw.replace(/,/g, ".").replace(/[^\d.]/g, "");
  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned;
  return cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, "");
}

function parseDecimal(text: string): number | null {
  if (text === "" || text === ".") return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

function formatDecimal(value: number | null | undefined): string {
  return value == null || Number.isNaN(value) ? "" : String(value);
}

type DecimalInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "inputMode"
> & {
  value: number | null | undefined;
  onValueChange: (value: number | null) => void;
};

/**
 * A numeric field for number-typed state. `type="number"` bound to a number
 * loses the in-between text — „0.“ parses back to 0, so the next key yields
 * „05“ — and drops a typed comma entirely. This keeps the raw text locally and
 * only reports the parsed number upward.
 */
export function DecimalInput({ value, onValueChange, ...rest }: DecimalInputProps) {
  const [text, setText] = useState(() => formatDecimal(value));
  const [reported, setReported] = useState<number | null>(value ?? null);

  // The parent changed the value itself (reset, restore) — show it.
  if ((value ?? null) !== reported) {
    setReported(value ?? null);
    setText(formatDecimal(value));
  }

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={text}
      onChange={(event) => {
        const next = sanitizeDecimal(event.target.value);
        const parsed = parseDecimal(next);
        setText(next);
        setReported(parsed);
        onValueChange(parsed);
      }}
    />
  );
}
