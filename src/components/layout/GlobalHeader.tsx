"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AylopetLogo } from "@/components/brand/AylopetLogo";
import { PulsingStatusDot } from "@/components/japandi/PulsingStatusDot";
import { LanguageToggle } from "@/components/i18n/LanguageToggle";
import { CharityBanner } from "@/components/layout/CharityBanner";
import { NavDropdown } from "@/components/marketing/NavDropdown";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { getMainNav } from "@/lib/i18n/nav";
import {
  isNavActive,
  isNavGroupActive,
  scrollToWaitlist,
  type NavItem,
} from "@/lib/navigation";

const DASHBOARD_HREF = "/dashboard/pets/rex";

const linkBase =
  "cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]";

const ctaBase =
  "cursor-pointer rounded-full transition-[transform,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]";

function MobileNavGroup({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(
    item.children ? isNavGroupActive(pathname, item.children) : false,
  );

  if (!item.children) {
    return (
      <Link
        href={item.href!}
        onClick={onNavigate}
        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--text-body)] hover:bg-[var(--background-secondary)] ${linkBase}`}
      >
        {item.label}
        {item.statusDot && <PulsingStatusDot />}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--background-secondary)] ${linkBase}`}
      >
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="ml-2 space-y-0.5 border-l-2 border-[var(--border-light)] pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${linkBase} ${
                isNavActive(pathname, child.href)
                  ? "font-medium text-[var(--brand-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function GlobalHeader() {
  const pathname = usePathname();
  const { user, ready } = useAuth();
  const { dict } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navHidden = useHideOnScroll();
  const mainNav = getMainNav(dict);

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/portal"))
    return null;

  const loggedIn = ready && !!user;
  const t = dict.common;

  return (
    <div
      className={`sticky top-0 z-50 overflow-visible transition-transform duration-300 ease-out will-change-transform ${
        navHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <CharityBanner />

      <div className="relative overflow-visible border-b border-white/70 bg-white/70 shadow-[0_12px_40px_rgba(13,46,39,0.08)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/55">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
        />
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 overflow-visible px-3 lg:gap-2.5 lg:px-4 xl:gap-3">
          <AylopetLogo compact className="relative z-10 shrink-0" />

          <nav
            aria-label="Main"
            className="hidden flex-1 items-center justify-center gap-0 overflow-visible lg:flex"
          >
            {mainNav.map((item) =>
              item.children ? (
                <NavDropdown
                  key={item.label}
                  label={item.label}
                  items={item.children}
                  pathname={pathname}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-1 py-1.5 text-[11px] font-semibold leading-none tracking-tight transition-colors hover:bg-[var(--background-secondary)] hover:text-[var(--brand-primary)] xl:px-1.5 xl:py-2 xl:text-xs 2xl:px-2 2xl:text-sm ${linkBase} ${
                    isNavActive(pathname, item.href!)
                      ? "text-[var(--brand-primary)]"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                  {item.statusDot && <PulsingStatusDot />}
                </Link>
              ),
            )}
          </nav>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
            <LanguageToggle className="hidden sm:flex" />
            {loggedIn ? (
              <Link
                href={DASHBOARD_HREF}
                className={`group hidden items-center gap-1.5 bg-[var(--brand-primary)] py-1.5 pl-2.5 pr-1.5 text-xs font-medium text-white hover:bg-[var(--brand-primary-hover)] sm:flex xl:pl-3 xl:text-sm ${ctaBase}`}
              >
                <LayoutDashboard className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                <span className="hidden 2xl:inline">{t.myPanel}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[10px] font-semibold xl:h-7 xl:w-7 xl:text-xs">
                  {user!.name.charAt(0).toUpperCase()}
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`hidden whitespace-nowrap px-1.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:text-[var(--brand-primary)] sm:inline-flex xl:px-3 xl:py-2 xl:text-sm ${linkBase}`}
                >
                  {t.login}
                </Link>
                <button
                  type="button"
                  onClick={scrollToWaitlist}
                  className={`hidden items-center gap-1 whitespace-nowrap bg-[var(--terracotta)] px-2.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 sm:inline-flex xl:px-4 xl:py-2 xl:text-sm ${ctaBase}`}
                >
                  <Sparkles className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
                  <span className="hidden xl:inline">{t.joinWaitlistPromo}</span>
                  <span className="xl:hidden">{t.joinWaitlist}</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--brand-primary)] hover:bg-[var(--brand-accent-soft)] lg:hidden ${linkBase}`}
              aria-label={mobileOpen ? t.menuClose : t.menuOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <motion.div
          initial={false}
          animate={{ opacity: 1, height: "auto" }}
          className="border-b border-white/70 bg-white/80 px-4 py-4 shadow-[0_20px_45px_rgba(13,46,39,0.1)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/65 lg:hidden"
        >
          <nav className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <MobileNavGroup
                key={item.label}
                item={item}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </nav>
          <div className="my-3 h-px bg-[var(--border-light)]" />
          <LanguageToggle />
          <div className="mt-3 flex flex-col gap-2">
            {loggedIn ? (
              <Link
                href={DASHBOARD_HREF}
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-[var(--brand-primary)] px-5 py-3 text-center text-sm font-medium text-white"
              >
                {t.myPanel}
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-center text-sm font-medium"
                >
                  {t.login}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    scrollToWaitlist();
                  }}
                  className="rounded-full bg-[var(--terracotta)] px-5 py-3 text-sm font-semibold text-white"
                >
                  {t.joinWaitlistPromo}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
