import { headers } from "next/headers";
import { defaultLocale, isLocale, LOCALE_HEADER, type Locale } from "./config";

/**
 * Liest die Sprache aus dem vom Proxy gesetzten Request-Header.
 *
 * Für Server-Komponenten, die keine Route-`params` bekommen — insbesondere
 * `not-found.tsx`. Fehlt der Header (z. B. bei Anfragen, die der Proxy nicht
 * durchläuft), wird auf Deutsch zurückgefallen.
 */
export async function getRequestLocale(): Promise<Locale> {
  const wert = (await headers()).get(LOCALE_HEADER);
  return wert && isLocale(wert) ? wert : defaultLocale;
}
