"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { authInputClass, authLabelClass } from "@/components/auth/AuthForm";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  labelExtra?: ReactNode;
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordField({
  label,
  labelExtra,
  showLabel,
  hideLabel,
  id,
  className,
  ...props
}: PasswordFieldProps) {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name ?? "password";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <label className={authLabelClass} htmlFor={inputId}>
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={`${authInputClass} pr-12 ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--background-secondary)] hover:text-[var(--brand-primary)]"
          aria-label={visible ? (hideLabel ?? a.hidePassword) : (showLabel ?? a.showPassword)}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
