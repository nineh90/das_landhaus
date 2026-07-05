"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { navLinks } from "./nav-links";

/**
 * Mobile Navigation: Hamburger-Button öffnet ein Overlay-Menü.
 * Einzige Interaktivität → bewusst als Client Component isoliert.
 */
export default function MobileNav() {
  const [offen, setOffen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={offen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={offen}
        onClick={() => setOffen((v) => !v)}
        className="inline-flex items-center justify-center rounded-md p-2 text-wald-dark hover:bg-creme-dark"
      >
        {/* Einfaches Icon ohne externe Dependency */}
        <span className="sr-only">Menü</span>
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOffen(false)}
                className="border-b border-creme-dark/60 py-3 text-lg font-semibold text-wald-dark last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <div className="py-4">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
