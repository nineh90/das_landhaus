import deMessages from "@/messages/de.json";
import { defaultLocale, type Locale } from "./config";

/**
 * Wörterbuch für statische Seiten-/Marketing-Texte.
 *
 * Deutsch (`messages/de.json`) ist die **vollständige Quelle** und definiert zugleich
 * den Typ `Dictionary`. Englisch/Niederländisch dürfen **unvollständig** sein: Beim Laden
 * werden sie über die deutsche Basis gemischt (Deep-Merge), fehlende oder leere Werte
 * fallen automatisch auf Deutsch zurück. So bleibt die Seite immer vollständig, auch wenn
 * Übersetzungen noch nicht final sind.
 */
export type Dictionary = typeof deMessages;

const loaders: Record<Exclude<Locale, typeof defaultLocale>, () => Promise<unknown>> = {
  en: () => import("@/messages/en.json").then((m) => m.default),
  nl: () => import("@/messages/nl.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === defaultLocale) return deMessages;
  const override = await loaders[locale as Exclude<Locale, typeof defaultLocale>]();
  return deepMerge(deMessages, override);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Mischt `override` über `base`, ohne `base` zu verändern.
 * - Objekte werden rekursiv zusammengeführt.
 * - Primitive/Arrays: `override` gewinnt, ABER leere Werte (`undefined`, `null`, `""`)
 *   fallen auf `base` (Deutsch) zurück.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override === undefined || override === null || override === "" ? base : (override as T);
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    result[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
  }
  return result as T;
}
