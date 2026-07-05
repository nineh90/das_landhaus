import { prisma } from "@/lib/db";
import { EINSTELLUNG_KEYS } from "@/lib/schemas";

/**
 * Lesezugriffe für den Admin-Bereich.
 *
 * Im Unterschied zur öffentlichen Fassade (lib/content.ts) liefern diese
 * Funktionen ALLE Datensätze — auch nicht verfügbare Gerichte und
 * unveröffentlichte Events. Rückgabe sind die rohen Prisma-Zeilen; die
 * Aufbereitung fürs Formular (z. B. Datum → yyyy-mm-dd) passiert in der Seite.
 */

/* ----------------------------- Gerichte ----------------------------- */

export function alleGerichte() {
  return prisma.gericht.findMany({
    orderBy: [{ bereich: "asc" }, { kategorie: "asc" }, { reihenfolge: "asc" }],
  });
}

export function gerichtById(id: string) {
  return prisma.gericht.findUnique({ where: { id } });
}

/** Alle vorhandenen Kategorienamen (distinct) — als Vorschläge fürs Formular. */
export async function alleKategorien(): Promise<string[]> {
  const rows = await prisma.gericht.findMany({
    distinct: ["kategorie"],
    select: { kategorie: true },
    orderBy: { kategorie: "asc" },
  });
  return rows.map((r) => r.kategorie);
}

/* ------------------------------ Events ------------------------------ */

export function alleEvents() {
  return prisma.event.findMany({ orderBy: { datum: "desc" } });
}

export function eventById(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

/* ------------------------------ Bilder ------------------------------ */

export function alleBilder() {
  return prisma.bild.findMany({ orderBy: [{ reihenfolge: "asc" }, { erstelltAm: "asc" }] });
}

export function bildById(id: string) {
  return prisma.bild.findUnique({ where: { id } });
}

/* --------------------------- Einstellungen -------------------------- */

/** Alle Einstellungen als key→value-Map (fehlende Keys werden zu ""). */
export async function einstellungenMap(): Promise<Record<string, string>> {
  const rows = await prisma.einstellung.findMany();
  const map: Record<string, string> = {};
  for (const key of EINSTELLUNG_KEYS) map[key] = "";
  for (const r of rows) map[r.key] = r.value;
  return map;
}
