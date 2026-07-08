import type { Locale } from "./config";

/**
 * Baut einen locale-präfixierten Pfad.
 *   localizedHref("en", "/restaurant") → "/en/restaurant"
 *   localizedHref("de", "/")           → "/de"
 *
 * Alle öffentlichen Links laufen über diesen Helfer, damit ein Sprachwechsel den Pfad
 * erhält und keine Locale hartkodiert wird.
 */
export function localizedHref(locale: Locale, path: string): string {
  if (!path || path === "/") return `/${locale}`;
  const withSlash = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${withSlash}`;
}
