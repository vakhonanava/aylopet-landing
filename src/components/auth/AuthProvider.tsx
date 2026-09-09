"use client";

import type { User } from "@supabase/supabase-js";
import type { AuthErrorCode } from "@/lib/content/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatAuthError,
  getAuthDisplayName,
  getAuthEmail,
  getAuthFirstName,
} from "@/lib/auth/display";
import {
  establishSessionAfterSignUp,
  isEmailVerified,
} from "@/lib/auth/session";
import { generateReferralCode } from "@/lib/referral/codes";
import { createClient } from "@/utils/supabase/client";

export interface AuthResult {
  /** Stable code · the form resolves it to a localized message. */
  error: AuthErrorCode | null;
  needsEmailConfirmation?: boolean;
}

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  displayName: string;
  /** First name only, for greetings. */
  firstName: string;
  email: string;
  emailVerified: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    referralCode?: string,
  ) => Promise<AuthResult>;
  signInWithGoogle: (nextPath?: string) => Promise<AuthResult>;
  sendVerificationEmail: () => Promise<AuthResult>;
  requestPasswordReset: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<AuthResult>;
  hasPasswordLogin: boolean;
  signOut: () => Promise<void>;
  /** Legacy waitlist hook — no-op now that auth is server-backed. */
  register: (_profile: { name: string; email: string }) => void;
  /** @deprecated Use signInWithPassword */
  login: (_profile: { name: string; email: string }) => void;
  /** @deprecated Use signOut */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function userHasPasswordLogin(user: User | null): boolean {
  if (!user) return false;
  return (
    user.identities?.some((identity) => identity.provider === "email") ?? false
  );
}

/**
 * Supabase re-emits SIGNED_IN / TOKEN_REFRESHED on tab focus and on every token
 * refresh, each time with a freshly built user object. Consumers that key an
 * effect off `user` (the dashboard store, most visibly) would then re-run their
 * whole fetch for a session that never actually changed. Compare the fields
 * anything downstream reacts to and reuse the previous object otherwise, so the
 * identity only changes when the account really does.
 */
function sameUser(a: User | null, b: User | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.email === b.email &&
    a.email_confirmed_at === b.email_confirmed_at &&
    a.updated_at === b.updated_at &&
    a.identities?.length === b.identities?.length
  );
}

function getBrowserClient() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) {
      queueMicrotask(() => setReady(true));
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser((prev) => (sameUser(prev, data.user) ? prev : data.user));
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const next = session?.user ?? null;
      setUser((prev) => (sameUser(prev, next) ? prev : next));
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "supabase_not_configured" };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) return { error: formatAuthError(error) };
      return { error: null };
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      referralCode?: string,
    ): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "supabase_not_configured" };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            // full_name is kept in sync so anything still reading it (older
            // rows, Supabase dashboards, email templates) keeps working.
            full_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
            referral_code: generateReferralCode(),
            ...(referralCode ? { referred_by_code: referralCode } : {}),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        return { error: formatAuthError(error) };
      }

      if (data.session) {
        return { error: null };
      }

      // With "Confirm email" enabled, Supabase does not error on a duplicate
      // address — to avoid leaking which emails exist it returns a placeholder
      // user carrying an empty `identities` array. Treating that as a fresh
      // signup showed "check your email for the link" to someone who already
      // has an account, so detect it and report the duplicate instead.
      if (data.user && (data.user.identities?.length ?? 0) === 0) {
        return { error: "already_registered" };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { error: null, needsEmailConfirmation: true };
      }

      const sessionResult = await establishSessionAfterSignUp(
        supabase,
        email,
        password,
      );
      if (sessionResult.error) {
        if (sessionResult.error === "email_not_confirmed") {
          return { error: null, needsEmailConfirmation: true };
        }
        return { error: sessionResult.error };
      }

      return { error: null };
    },
    [],
  );

  const sendVerificationEmail = useCallback(async (): Promise<AuthResult> => {
    const supabase = getBrowserClient();
    if (!supabase) {
      return { error: "supabase_not_configured" };
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser?.email) {
      return { error: "email_not_found" };
    }

    if (isEmailVerified(currentUser)) {
      return { error: null };
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: currentUser.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) return { error: formatAuthError(error) };
    return { error: null };
  }, []);

  const requestPasswordReset = useCallback(
    async (email: string): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "supabase_not_configured" };
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/reset-password")}`;
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo },
      );

      if (error) return { error: formatAuthError(error) };
      return { error: null };
    },
    [],
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "supabase_not_configured" };
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: formatAuthError(error) };
      return { error: null };
    },
    [],
  );

  const changePassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
    ): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "supabase_not_configured" };
      }

      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser?.email) {
        return { error: "account_not_created" };
      }

      if (!userHasPasswordLogin(currentUser)) {
        return { error: "google_account_no_password" };
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });

      if (verifyError) {
        return { error: "current_password_wrong" };
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: formatAuthError(error) };
      return { error: null };
    },
    [],
  );

  const signInWithGoogle = useCallback(
    async (nextPath = "/dashboard"): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "supabase_not_configured" };
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) return { error: formatAuthError(error) };
      return { error: null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    const supabase = getBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      displayName: getAuthDisplayName(user),
      firstName: getAuthFirstName(user),
      email: getAuthEmail(user),
      emailVerified: isEmailVerified(user),
      hasPasswordLogin: userHasPasswordLogin(user),
      signInWithPassword,
      signUpWithPassword,
      signInWithGoogle,
      sendVerificationEmail,
      requestPasswordReset,
      updatePassword,
      changePassword,
      signOut,
      register: () => {},
      login: () => {},
      logout: () => {
        void signOut();
      },
    }),
    [user, ready, signInWithPassword, signUpWithPassword, signInWithGoogle, sendVerificationEmail, requestPasswordReset, updatePassword, changePassword, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
