"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PasswordField } from "@/components/auth/PasswordField";

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
        ან ელ. ფოსტით
        <span className="h-px flex-1 bg-[var(--border-light)]" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="email">
            ელ. ფოსტა
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
          label="პაროლი"
          labelExtra={
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-[var(--brand-primary)] hover:underline"
            >
              დაგავიწყდა პაროლი?
            </Link>
          }
          placeholder="შენი პაროლი"
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
              შესვლა
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
        "ანგარიში შეიქმნა. შეამოწმე ელ. ფოსტა (inbox და spam) დადასტურების ბმულისთვის, შემდეგ შედი.",
      );
      setLoading(false);
      return;
    }

    window.location.href = nextPath;
  };

  return (
    <>
      <GoogleSignInButton nextPath={nextPath} label="Google-ით რეგისტრაცია" />

      <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
        <span className="h-px flex-1 bg-[var(--border-light)]" />
        ან ელ. ფოსტით
        <span className="h-px flex-1 bg-[var(--border-light)]" />
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="name">
            სახელი
          </label>
          <input
            id="name"
            type="text"
            className={input}
            placeholder="შენი სახელი"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            minLength={2}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={label} htmlFor="email">
            ელ. ფოსტა
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
          label="პაროლი"
          placeholder="მინიმუმ 6 სიმბოლო"
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
              ანგარიშის შექმნა
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs leading-relaxed text-[var(--text-tertiary)]">
        რეგისტრაციით ეთანხმები{" "}
        <Link href="/terms" className="underline hover:text-[var(--brand-primary)]">
          წესებს
        </Link>{" "}
        და{" "}
        <Link href="/privacy" className="underline hover:text-[var(--brand-primary)]">
          კონფიდენციალურობას
        </Link>
        .
      </p>
    </>
  );
}

export function ForgotPasswordForm() {
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
      "თუ ეს ელ. ფოსტა არსებობს, აღდგენის ბმული გამოგიგზავნეთ. შეამოწმე inbox და spam.",
    );
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="email">
          ელ. ფოსტა
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
            აღდგენის ბმულის გაგზავნა
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.");
      return;
    }
    if (password !== confirmPassword) {
      setError("პაროლები არ ემთხვევა.");
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
        label="ახალი პაროლი"
        placeholder="მინიმუმ 6 სიმბოლო"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <PasswordField
        id="confirmPassword"
        label="გაიმეორე ახალი პაროლი"
        placeholder="გაიმეორე პაროლი"
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
            პაროლის შენახვა
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export function ChangePasswordForm() {
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
        შენი ანგარიში Google-ით შედის ({email}). პაროლის შეცვლა ამ ანგარიშისთვის არ
        არის საჭირო.
      </p>
    );
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 6) {
      setError("ახალი პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.");
      return;
    }
    if (password !== confirmPassword) {
      setError("ახალი პაროლები არ ემთხვევა.");
      return;
    }
    if (password === currentPassword) {
      setError("ახალი პაროლი უნდა განსხვავდებოდეს მიმდინარისგან.");
      return;
    }

    setLoading(true);
    const result = await changePassword(currentPassword, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setInfo("პაროლი წარმატებით შეიცვალა.");
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <PasswordField
        id="currentPassword"
        label="მიმდინარე პაროლი"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        autoComplete="current-password"
        minLength={6}
        required
      />
      <PasswordField
        id="newPassword"
        label="ახალი პაროლი"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <PasswordField
        id="confirmNewPassword"
        label="გაიმეორე ახალი პაროლი"
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
          "პაროლის შეცვლა"
        )}
      </button>
    </form>
  );
}
