"use client";

import type { User } from "@supabase/supabase-js";
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
  getAuthDisplayName,
  getAuthEmail,
  mapAuthError,
} from "@/lib/auth/display";
import {
  establishSessionAfterSignUp,
  isEmailVerified,
} from "@/lib/auth/session";
import { createClient } from "@/utils/supabase/client";

interface AuthResult {
  error: string | null;
}

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  displayName: string;
  email: string;
  emailVerified: boolean;
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (
    name: string,
    email: string,
    password: string,
  ) => Promise<AuthResult>;
  signInWithGoogle: (nextPath?: string) => Promise<AuthResult>;
  sendVerificationEmail: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  /** Legacy waitlist hook — no-op now that auth is server-backed. */
  register: (_profile: { name: string; email: string }) => void;
  /** @deprecated Use signInWithPassword */
  login: (_profile: { name: string; email: string }) => void;
  /** @deprecated Use signOut */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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
      setUser(data.user);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "Supabase არ არის კონფიგურირებული." };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) return { error: mapAuthError(error.message) };
      return { error: null };
    },
    [],
  );

  const signUpWithPassword = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "Supabase არ არის კონფიგურირებული." };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          const signInResult = await signInWithPassword(email, password);
          return signInResult;
        }
        return { error: mapAuthError(error.message) };
      }

      if (!data.session) {
        const sessionResult = await establishSessionAfterSignUp(
          supabase,
          email,
          password,
        );
        if (sessionResult.error) {
          return { error: sessionResult.error };
        }
      }

      return { error: null };
    },
    [signInWithPassword],
  );

  const sendVerificationEmail = useCallback(async (): Promise<AuthResult> => {
    const supabase = getBrowserClient();
    if (!supabase) {
      return { error: "Supabase არ არის კონფიგურირებული." };
    }

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser?.email) {
      return { error: "ელ. ფოსტა ვერ მოიძებნა." };
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

    if (error) return { error: mapAuthError(error.message) };
    return { error: null };
  }, []);

  const signInWithGoogle = useCallback(
    async (nextPath = "/dashboard"): Promise<AuthResult> => {
      const supabase = getBrowserClient();
      if (!supabase) {
        return { error: "Supabase არ არის კონფიგურირებული." };
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) return { error: mapAuthError(error.message) };
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
      email: getAuthEmail(user),
      emailVerified: isEmailVerified(user),
      signInWithPassword,
      signUpWithPassword,
      signInWithGoogle,
      sendVerificationEmail,
      signOut,
      register: () => {},
      login: () => {},
      logout: () => {
        void signOut();
      },
    }),
    [user, ready, signInWithPassword, signUpWithPassword, signInWithGoogle, sendVerificationEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
