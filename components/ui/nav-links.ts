import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * Zentrale Navigations-Definition — von Header, MobileNav und Footer genutzt.
 * `href` ist der sprachneutrale Pfad, `key` verweist auf das Label im Wörterbuch (`nav`).
 */
export const navLinks = [
  { href: "/", key: "start" },
  { href: "/restaurant", key: "restaurant" },
  { href: "/imbiss", key: "imbiss" },
  { href: "/der-kotten", key: "derKotten" },
  { href: "/events", key: "events" },
  { href: "/galerie", key: "galerie" },
  { href: "/anfahrt", key: "anfahrt" },
] as const;

export type NavItem = { href: string; label: string };

/** Baut die Navigations-Einträge für eine Sprache: localisierter href + übersetztes Label. */
export function buildNavItems(locale: Locale, nav: Dictionary["nav"]): NavItem[] {
  return navLinks.map((link) => ({
    href: localizedHref(locale, link.href),
    label: nav[link.key],
  }));
}
