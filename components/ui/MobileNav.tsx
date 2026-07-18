"use client";

import { useState } from "react";
import NavLink from "./NavLink";
import LanguageSwitcher from "./LanguageSwitcher";
import SocialLinks from "./SocialLinks";
import type { NavItem } from "./nav-links";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * Mobile Navigation: Hamburger-Button öffnet ein Overlay-Menü.
 * Einzige Interaktivität → bewusst als Client Component isoliert. Navigations-Einträge,
 * Sprache und Beschriftungen kommen als Props vom Server (kein Client-i18n-Runtime nötig).
 */
export default function MobileNav({
  locale,
  items,
  switcherLabel,
  menuLabels,
}: {
  locale: Locale;
  items: NavItem[];
  switcherLabel: string;
  menuLabels: Dictionary["common"];
}) {
  const [offen, setOffen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={offen ? menuLabels.menuClose : menuLabels.menuOpen}
        aria-expanded={offen}
        onClick={() => setOffen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 text-wald-dark hover:bg-creme-dark"
      >
        {/* Einfaches Icon ohne externe Dependency */}
        <span className="sr-only">{menuLabels.menu}</span>
        {offen ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {offen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-creme-dark bg-creme shadow-lg">
          <nav className="flex flex-col px-4 py-2">
            {items.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={() => setOffen(false)}
                className="border-b border-creme-dark/60 py-3 text-lg font-semibold transition-colors last:border-0"
                inactiveClassName="text-wald-dark"
                activeClassName="text-akzent-dark"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex items-center justify-between py-4">
              <LanguageSwitcher current={locale} label={switcherLabel} />
              <SocialLinks tone="onLight" />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
