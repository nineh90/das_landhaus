import { prisma } from "@/lib/db";
import { defaultLocale, isLocale, zielLocales, type Locale, type ZielLocale } from "./config";

/**
 * Übersetzungen redaktioneller Inhalte (Prisma-Modell `Uebersetzung`).
 *
 * Deutsch ist die Pflegesprache und steht am Datensatz selbst — hier liegen nur
 * die Abweichungen für EN/NL. Fehlt ein Wert, gilt Deutsch. Alles Lesen läuft
 * über `ladeUebersetzungen` + `uebersetze`, alles Schreiben über
 * `speichereUebersetzungen`; die Fassade lib/content.ts ist der einzige Ort, an
 * dem öffentliche Inhalte damit zusammengeführt werden.
 */

/** Modelle, deren Inhalte übersetzbar sind (= `modell`-Spalte). */
export const UEBERSETZBARE_MODELLE = [
  "gericht",
  "kategorie",
  "event",
  "bild",
  "einstellung",
] as const;
export type UebersetzModell = (typeof UEBERSETZBARE_MODELLE)[number];

/** Nachschlagewerk einer Sprache: `${datensatzId}::${feld}` → Wert. */
export type UebersetzungsMap = Map<string, string>;

const schluessel = (datensatzId: string, feld: string) => `${datensatzId}::${feld}`;

/**
 * Alle Übersetzungen eines Modells für eine Sprache laden — ein Query je Seite,
 * nicht je Datensatz. Für Deutsch (oder unbekannte Sprachen) bleibt die Map leer,
 * es wird gar nicht erst in die Datenbank gegangen.
 */
export async function ladeUebersetzungen(
  modell: UebersetzModell,
  locale: Locale,
): Promise<UebersetzungsMap> {
  if (locale === defaultLocale) return new Map();

  const zeilen = await prisma.uebersetzung.findMany({
    where: { modell, locale },
    select: { datensatzId: true, feld: true, wert: true },
  });

  const map: UebersetzungsMap = new Map();
  for (const z of zeilen) {
    if (z.wert.trim()) map.set(schluessel(z.datensatzId, z.feld), z.wert);
  }
  return map;
}

/**
 * Einen Wert übersetzen — mit Rückfall auf den deutschen Originalwert.
 * `null` bleibt `null` (z. B. eine nicht gepflegte Beschreibung).
 */
export function uebersetze<T extends string | null>(
  map: UebersetzungsMap,
  datensatzId: string,
  feld: string,
  standard: T,
): T {
  return (map.get(schluessel(datensatzId, feld)) as T) ?? standard;
}

/** Übersetzungen eines einzelnen Datensatzes fürs Admin-Formular: locale → feld → wert. */
export async function ladeUebersetzungenFuerDatensatz(
  modell: UebersetzModell,
  datensatzId: string,
): Promise<Record<ZielLocale, Record<string, string>>> {
  const zeilen = await prisma.uebersetzung.findMany({
    where: { modell, datensatzId },
    select: { locale: true, feld: true, wert: true },
  });

  const ergebnis = Object.fromEntries(zielLocales.map((l) => [l, {}])) as Record<
    ZielLocale,
    Record<string, string>
  >;
  for (const z of zeilen) {
    if (isLocale(z.locale) && z.locale !== defaultLocale) {
      ergebnis[z.locale as ZielLocale][z.feld] = z.wert;
    }
  }
  return ergebnis;
}

/**
 * Wie oben, aber für alle Datensätze eines Modells auf einmal:
 * datensatzId → locale → feld → wert. Für Admin-Übersichten (z. B. die
 * Kategorien der Speisekarte), damit dort nicht je Eintrag ein Query läuft.
 */
export async function ladeUebersetzungenJeDatensatz(
  modell: UebersetzModell,
): Promise<Record<string, Partial<Record<ZielLocale, Record<string, string>>>>> {
  const zeilen = await prisma.uebersetzung.findMany({
    where: { modell },
    select: { datensatzId: true, locale: true, feld: true, wert: true },
  });

  const ergebnis: Record<string, Partial<Record<ZielLocale, Record<string, string>>>> = {};
  for (const z of zeilen) {
    if (!isLocale(z.locale) || z.locale === defaultLocale) continue;
    const locale = z.locale as ZielLocale;
    ergebnis[z.datensatzId] ??= {};
    ergebnis[z.datensatzId][locale] ??= {};
    ergebnis[z.datensatzId][locale]![z.feld] = z.wert;
  }
  return ergebnis;
}

/**
 * Übersetzungen eines Datensatzes speichern. Leere Felder werden gelöscht statt
 * als Leerstring abgelegt — dadurch greift wieder der Rückfall auf Deutsch.
 * Nicht übergebene Sprachen/Felder bleiben unangetastet.
 */
export async function speichereUebersetzungen(
  modell: UebersetzModell,
  datensatzId: string,
  daten: Partial<Record<ZielLocale, Record<string, string | null | undefined>>>,
): Promise<void> {
  const aktionen = [];

  for (const locale of zielLocales) {
    const felder = daten[locale];
    if (!felder) continue;

    for (const [feld, roh] of Object.entries(felder)) {
      const wert = (roh ?? "").trim();
      const wo = { modell_datensatzId_locale_feld: { modell, datensatzId, locale, feld } };

      aktionen.push(
        wert
          ? prisma.uebersetzung.upsert({
              where: wo,
              update: { wert },
              create: { modell, datensatzId, locale, feld, wert },
            })
          : prisma.uebersetzung.deleteMany({ where: { modell, datensatzId, locale, feld } }),
      );
    }
  }

  if (aktionen.length) await prisma.$transaction(aktionen);
}

/** Übersetzungen eines gelöschten Datensatzes mit entfernen (keine Waisen). */
export async function loescheUebersetzungen(
  modell: UebersetzModell,
  datensatzId: string,
): Promise<void> {
  await prisma.uebersetzung.deleteMany({ where: { modell, datensatzId } });
}

/**
 * Schlüssel einer Übersetzung umziehen — nötig bei Kategorien, deren
 * `datensatzId` der deutsche Name ist: Wird die Kategorie umbenannt, müssen die
 * Übersetzungen mitwandern. Bestehende Übersetzungen des Zielnamens gewinnen
 * (beim Verschmelzen zweier Kategorien).
 */
export async function verschiebeUebersetzungen(
  modell: UebersetzModell,
  alt: string,
  neu: string,
): Promise<void> {
  if (alt === neu) return;

  const vorhanden = await prisma.uebersetzung.findMany({
    where: { modell, datensatzId: neu },
    select: { locale: true, feld: true },
  });
  const belegt = new Set(vorhanden.map((v) => `${v.locale}::${v.feld}`));

  const umziehende = await prisma.uebersetzung.findMany({
    where: { modell, datensatzId: alt },
  });

  await prisma.$transaction([
    ...umziehende
      .filter((u) => !belegt.has(`${u.locale}::${u.feld}`))
      .map((u) => prisma.uebersetzung.update({ where: { id: u.id }, data: { datensatzId: neu } })),
    prisma.uebersetzung.deleteMany({ where: { modell, datensatzId: alt } }),
  ]);
}
