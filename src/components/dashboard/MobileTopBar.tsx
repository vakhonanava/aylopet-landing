"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Dog, LayoutDashboard, LogOut, Plus, Settings } from "lucide-react";
import { AylopetLogo } from "@/components/brand/AylopetLogo";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDashboard } from "@/components/dashboard/DashboardStore";

export function MobileTopBar() {
  const { pets, ready, account } = useDashboard();
  const { signOut, firstName, displayName, email } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name = firstName || account?.name || displayName;

  // The desktop Sidebar (settings, sign-out) is hidden below lg, so this menu
  // is the only way to reach them on a phone.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[var(--brand-primary)]";

  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border-light)] bg-white/80 backdrop-blur-md lg:hidden print:hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <AylopetLogo size="sm" />
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/onboarding"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white"
            aria-label="ახალი ძაღლი"
          >
            <Plus className="h-4 w-4" />
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="ანგარიშის მენიუ"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)]/[0.08] text-sm font-semibold text-[var(--brand-primary)]"
            >
              {(name || "?").charAt(0).toUpperCase()}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-11 w-60 rounded-2xl border border-[var(--border-light)] bg-white p-2 shadow-[0_20px_45px_rgba(13,46,39,0.12)]"
              >
                <div className="border-b border-[var(--border-light)] px-3 pb-2.5 pt-1.5">
                  <p className="truncate text-sm font-semibold text-[var(--brand-primary)]">
                    {name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {account?.email ?? email}
                  </p>
                </div>
                <div className="mt-1 flex flex-col">
                  <Link
                    role="menuitem"
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className={itemClass}
                  >
                    <LayoutDashboard className="h-[18px] w-[18px]" />
                    მთავარი
                  </Link>
                  <Link
                    role="menuitem"
                    href="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    className={itemClass}
                  >
                    <Settings className="h-[18px] w-[18px]" />
                    პარამეტრები
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      void signOut().then(() => router.push("/"));
                    }}
                    className={itemClass}
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                    გასვლა
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-3">
        {ready &&
          pets.map((pet) => (
          <Link
            key={pet.id}
            href={`/dashboard/pets/${pet.id}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-light)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--brand-primary)]"
          >
            <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
              {pet.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pet.avatarUrl}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Dog className="h-3.5 w-3.5" />
              )}
            </span>
            {pet.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
