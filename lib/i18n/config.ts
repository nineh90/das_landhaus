/**
 * i18n-Grundkonfiguration für die öffentliche Website (DE / EN / NL).
 *
 * Bewusst ohne zusätzliche Library (siehe CLAUDE.md „keine unnötigen Dependencies"):
 * offizielles Next.js-App-Router-Muster aus Locale-Segment + Middleware + JSON-Wörterbüchern.
 * Der Admin-Bereich bleibt einsprachig Deutsch und ist hiervon nicht betroffen.
 */

/** Unterstützte Sprachen. Reihenfolge = Anzeige-Reihenfolge im Sprachumschalter. */
export const locales = ["de", "en", "nl"] as const;

export type Locale = (typeof locales)[number];

/**
 * Standard-/Fallback-Sprache. Fehlt eine Übersetzung, wird hierauf zurückgefallen.
 * `satisfies` (statt `: Locale`) erhält den Literaltyp `"de"` — nötig, damit
 * `Exclude<Locale, typeof defaultLocale>` in dictionary.ts korrekt `"en" | "nl"` ergibt.
 */
export const defaultLocale = "de" satisfies Locale;

/** Menschlich lesbare Namen der Sprachen (für den Umschalter). */
export const localeNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  nl: "Nederlands",
};

/**
 * BCP-47-Tags für die Intl-Formatierung (Preise, Datum).
 * Getrennt von den kurzen Locale-Codes gehalten, damit die URLs schlank bleiben (`/en` statt `/en-GB`).
 */
export const localeToIntl: Record<Locale, string> = {
  de: "de-DE",
  en: "en-GB",
  nl: "nl-NL",
};

/**
 * Request-Header, in dem der Proxy die erkannte Sprache durchreicht.
 * Nötig für Server-Komponenten ohne `params` — allen voran die 404-Seite
 * (`not-found.tsx` bekommt vom Framework keine Route-Parameter).
 */
export const LOCALE_HEADER = "x-locale";

/** Type-Guard: prüft, ob ein unbekannter String eine unterstützte Locale ist. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
