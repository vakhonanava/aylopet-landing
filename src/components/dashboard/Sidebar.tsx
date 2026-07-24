"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dog,
  LayoutDashboard,
  LogOut,
  PawPrint,
  Plus,
  Settings,
} from "lucide-react";
import { AylopetLogo } from "@/components/brand/AylopetLogo";
import { useAuth } from "@/components/auth/AuthProvider";
import { useDashboard } from "@/components/dashboard/DashboardStore";

const navItems = [
  { label: "მთავარი", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "შინაური ცხოველები", href: "/dashboard", icon: PawPrint },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { pets, account } = useDashboard();
  const { signOut, displayName, email } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border-light)] bg-white px-4 py-6 lg:flex">
      <AylopetLogo href="/" className="px-3" />

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[var(--brand-primary)]"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <div className="flex items-center justify-between px-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            ჩემი ძაღლები
          </span>
          <Link
            href="/dashboard/onboarding"
            className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-[var(--brand-primary)]"
            aria-label="ახალი ძაღლის დამატება"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {pets.map((pet) => {
            const active = pathname === `/dashboard/pets/${pet.id}`;
            return (
              <Link
                key={pet.id}
                href={`/dashboard/pets/${pet.id}`}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--brand-primary)]/[0.06] font-medium text-[var(--brand-primary)]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[var(--brand-primary)]"
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                  {pet.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pet.avatarUrl}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Dog className="h-4 w-4" />
                  )}
                </span>
                {pet.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--border-light)] pt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)]/[0.08] text-sm font-semibold text-[var(--brand-primary)]">
            {(account?.name ?? displayName).charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--brand-primary)]">
              {account?.name ?? displayName}
            </p>
            <p className="truncate text-xs text-slate-400">
              {account?.email ?? email}
            </p>
          </div>
        </div>
        <div className="mt-1 flex flex-col gap-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-[var(--brand-primary)]"
          >
            <Settings className="h-[18px] w-[18px]" />
            პარამეტრები
          </Link>
          <button
            type="button"
            onClick={() => {
              void signOut().then(() => router.push("/"));
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-[var(--brand-primary)]"
          >
            <LogOut className="h-[18px] w-[18px]" />
            გასვლა
          </button>
        </div>
      </div>
    </aside>
  );
}
