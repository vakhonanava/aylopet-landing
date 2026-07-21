"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AylopetLogo } from "@/components/brand/AylopetLogo";
import { PulsingStatusDot } from "@/components/japandi/PulsingStatusDot";
import { getMainNav, getPlatformLinks } from "@/lib/i18n/nav";

export function SiteFooter() {
  const { dict } = useLocale();
  const mainNav = getMainNav(dict);
  const platformLinks = getPlatformLinks(dict);
  const f = dict.footer;

  return (
    <footer className="border-t border-[var(--border-light)] bg-[var(--background-main)] py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <AylopetLogo href="/" size="sm" />
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {BRAND.tagline} · {f.taglineSuffix}
          </p>
        </div>

        {mainNav.slice(0, 2).map((item) => (
          <div key={item.label}>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              {item.label}
            </h4>
            <ul className="mt-4 space-y-2">
              {item.children?.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)]"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            {f.resources}
          </h4>
          <ul className="mt-4 space-y-2">
            {mainNav.slice(2).flatMap((item) =>
              item.children
                ? item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)]"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))
                : item.href
                  ? [
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)]"
                        >
                          {item.label}
                          {item.statusDot && <PulsingStatusDot />}
                        </Link>
                      </li>,
                    ]
                  : [],
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            {f.platform}
          </h4>
          <ul className="mt-4 space-y-2">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--brand-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-[var(--border-light)] px-6 pt-8 sm:flex-row lg:px-8">
        <p className="text-sm text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} {BRAND.name}. {f.rights}
        </p>
        <nav aria-label={f.legal} className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/privacy"
            className="text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand-primary)]"
          >
            {f.privacy}
          </Link>
          <Link
            href="/terms"
            className="text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand-primary)]"
          >
            {f.terms}
          </Link>
          <Link
            href="/cookies"
            className="text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand-primary)]"
          >
            {f.cookies}
          </Link>
          <Link
            href="/accessibility"
            className="text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--brand-primary)]"
          >
            {f.accessibility}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
