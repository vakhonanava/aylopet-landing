"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getAuthCopy } from "@/lib/content/auth";

const input =
  "w-full rounded-2xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--brand-primary)] outline-none transition-all duration-200 placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/5";
const label = "block text-sm font-medium text-[var(--brand-primary)]";

interface AuthFormShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
}: AuthFormShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-main)] px-6 py-24">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--brand-primary)]">
            {title}
          </h1>
          <p className="mt-2 text-[var(--text-body)]">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-5 rounded-[2rem] border border-[var(--border-light)] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          {footer}
        </p>
      </div>
    </main>
  );
}

export { input as authInputClass, label as authLabelClass };

interface LoginFormProps {
  nextPath?: string;
}

export function LoginForm({ nextPath = "/dashboard" }: LoginFormProps) {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signInWithPassword(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = nextPath;
  };

  return (
    <>
      <GoogleSignInButton nextPath={nextPath} />

      <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
        <span className="h-px flex-1 bg-[var(--border-light)]" />
        {a.orWithEmail}
        <span className="h-px flex-1 bg-[var(--border-light)]" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="email">
            {a.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            className={input}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <PasswordField
          id="login-password"
          label={a.passwordLabel}
          labelExtra={
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
            >
              {a.forgotPasswordLink}
            </Link>
          }
          placeholder={a.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          minLength={6}
          required
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {a.signIn}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>
    </>
  );
}

interface RegisterFormProps {
  nextPath?: string;
}

export function RegisterForm({ nextPath = "/dashboard" }: RegisterFormProps) {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const { signUpWithPassword } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const result = await signUpWithPassword(name, email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.needsEmailConfirmation) {
      setInfo(
        a.registerSuccess,
      );
      setLoading(false);
      return;
    }

    window.location.href = nextPath;
  };

  return (
    <>
      <GoogleSignInButton nextPath={nextPath} label={a.googleRegister} />

      <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
        <span className="h-px flex-1 bg-[var(--border-light)]" />
        {a.orWithEmail}
        <span className="h-px flex-1 bg-[var(--border-light)]" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="name">
            {a.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            className={input}
            placeholder={a.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            minLength={2}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="email">
            {a.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            className={input}
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <PasswordField
          id="password"
          label={a.passwordLabel}
          placeholder={a.minSixChars}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {a.createAccount}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs leading-relaxed text-[var(--text-tertiary)]">
        {a.termsPrefix}{" "}
        <Link href="/terms" className="underline hover:text-[var(--brand-primary)]">
          {a.termsLink}
        </Link>{" "}
        {a.termsAnd}{" "}
        <Link href="/privacy" className="underline hover:text-[var(--brand-primary)]">
          {a.privacyLink}
        </Link>
        .
      </p>
    </>
  );
}

export function ForgotPasswordForm() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const result = await requestPasswordReset(email);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setInfo(
      a.forgotSent,
    );
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="email">
          {a.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          className={input}
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {a.forgotSubmit}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(a.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(a.passwordsDoNotMatch);
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard?password=updated";
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <PasswordField
        id="password"
        label={a.newPassword}
        placeholder={a.minSixChars}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <PasswordField
        id="confirmPassword"
        label={a.repeatNewPassword}
        placeholder={a.repeatPassword}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {a.savePassword}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
  const { locale } = useLocale();
  const a = getAuthCopy(locale);
  const { changePassword, hasPasswordLogin, email } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!hasPasswordLogin) {
    return (
      <p className="rounded-xl border border-[var(--border-light)] bg-[var(--background-main)] px-4 py-3 text-sm leading-relaxed text-[var(--text-body)]">
        {a.googleAccountNotice} ({email})
      </p>
    );
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 6) {
      setError(a.passwordTooShort);
      return;
    }
    if (password !== confirmPassword) {
      setError(a.passwordsDoNotMatch);
      return;
    }
    if (password === currentPassword) {
      setError(a.newPasswordMustDiffer);
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setInfo(a.passwordChanged);
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <PasswordField
        id="currentPassword"
        label={a.currentPassword}
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        autoComplete="current-password"
        minLength={6}
        required
      />
      <PasswordField
        id="newPassword"
        label={a.newPassword}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <PasswordField
        id="confirmNewPassword"
        label={a.repeatNewPassword}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {info && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--brand-primary-hover)] disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          a.changePassword
        )}
      </button>
    </form>
  );
}
