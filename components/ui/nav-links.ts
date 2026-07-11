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

/**
 * Prüft, ob ein Nav-Link zum aktuellen Pfad gehört (für die Aktiv-Markierung).
 * Die Startseite (`/de`) matcht nur exakt; alle anderen Seiten auch auf ihren
 * Unterseiten (z. B. `/de/events` bleibt aktiv auf `/de/events/mein-event`).
 */
export function istAktiverPfad(pathname: string, href: string): boolean {
  const normalisieren = (p: string) => p.replace(/\/+$/, "") || "/";
  const aktuell = normalisieren(pathname);
  const ziel = normalisieren(href);
  // Nur das Locale-Segment (z. B. "/de") → Startseite: exakte Übereinstimmung.
  const istStartseite = ziel.split("/").filter(Boolean).length <= 1;
  return istStartseite ? aktuell === ziel : aktuell === ziel || aktuell.startsWith(`${ziel}/`);
}
