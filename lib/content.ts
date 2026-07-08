/**
 * Datenzugriffs-Fassade — das Herzstück der Modularität.
 *
 * Alle Seiten und Komponenten holen Inhalte AUSSCHLIESSLICH über diese Funktionen.
 * Stufe 2: Die Rümpfe lesen jetzt aus der Datenbank (Prisma). Die Signaturen
 * (inkl. `async`/Promise) sind identisch zu Build 1 geblieben, daher musste kein
 * Aufrufer angefasst werden.
 *
 * Die Prisma-Modelle führen technische Felder (erstelltAm/aktualisiertAm) und
 * generische String-Spalten (`bereich`). Die kleinen `zu*`-Mapper unten bilden
 * jede Zeile auf den schlanken, serialisierbaren Domänentyp aus types/index.ts
 * ab (u. a. `datum` als ISO-String, `bereich` als String-Union).
 */
import type { Bereich, Bild, BildBereich, Event, Gericht } from "@/types";
import { prisma } from "@/lib/db";
import type {
  Bild as PrismaBild,
  Event as PrismaEvent,
  Gericht as PrismaGericht,
} from "@prisma/client";

/* ------------------------------- Mapper ----------------------------- */

function zuGericht(g: PrismaGericht): Gericht {
  return {
    id: g.id,
    name: g.name,
    beschreibung: g.beschreibung,
    preis: g.preis,
    kategorie: g.kategorie,
    bereich: g.bereich as Bereich,
    verfuegbar: g.verfuegbar,
    bild: g.bild,
    reihenfolge: g.reihenfolge,
  };
}

function zuEvent(e: PrismaEvent): Event {
  return {
    id: e.id,
    slug: e.slug,
    titel: e.titel,
    beschreibung: e.beschreibung,
    datum: e.datum.toISOString().slice(0, 10),
    uhrzeit: e.uhrzeit,
    eintritt: e.eintritt,
    bild: e.bild,
    veroeffentlicht: e.veroeffentlicht,
  };
}

function zuBild(b: PrismaBild): Bild {
  return {
    id: b.id,
    url: b.url,
    alt: b.alt,
    beschreibung: b.beschreibung,
    bereich: b.bereich as BildBereich,
  };
}

/* ----------------------------- Gerichte ----------------------------- */

/** Verfügbare Gerichte eines Bereichs, nach Reihenfolge sortiert. */
export async function getGerichte(bereich: Bereich): Promise<Gericht[]> {
  const rows = await prisma.gericht.findMany({
    where: { bereich, verfuegbar: true },
    orderBy: { reihenfolge: "asc" },
  });
  return rows.map(zuGericht);
}

/**
 * Gerichte eines Bereichs nach Kategorie gruppiert, für die Speisekarten-Darstellung.
 * Die Kategorie-Reihenfolge ist fachlich sinnvoll vorgegeben.
 */
export const KATEGORIE_REIHENFOLGE = [
  // Restaurant (echte Karte)
  "Antipasti",
  "Schnitzel",
  "Burger",
  "Fleischgerichte",
  "Kindergerichte",
  "Dessert",
  "Biere",
  "Weine & Sekt",
  "Aperitivo",
  "Alkoholfreie Getränke",
  "Warme Getränke",
  // Imbiss (Platzhalter)
  "Vorspeise",
  "Hauptgang",
  "Snack",
  "Getränk",
];

/**
 * Sortiert Kategorienamen anhand einer Wunsch-Reihenfolge. Kategorien, die dort
 * nicht vorkommen (z. B. frisch angelegte), landen stabil am Ende in ihrer
 * ursprünglichen Reihenfolge. Ohne Angabe gilt die fachliche Standard-Ordnung.
 * Auch im Admin genutzt.
 */
export function sortiereKategorien(
  kategorien: string[],
  reihenfolge: string[] = KATEGORIE_REIHENFOLGE,
): string[] {
  return [...kategorien].sort((a, b) => {
    const ia = reihenfolge.indexOf(a);
    const ib = reihenfolge.indexOf(b);
    return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
  });
}

/**
 * Vom Admin per Drag & Drop gepflegte Kategorie-Reihenfolge eines Bereichs,
 * abgelegt als JSON-Array in der Einstellung `kategorie_reihenfolge_<bereich>`.
 * Ohne gespeicherten (oder bei ungültigem) Wert gilt die Standard-Reihenfolge.
 */
export async function getKategorieReihenfolge(bereich: Bereich): Promise<string[]> {
  const eintrag = await prisma.einstellung.findUnique({
    where: { key: `kategorie_reihenfolge_${bereich}` },
  });
  if (eintrag?.value) {
    try {
      const arr: unknown = JSON.parse(eintrag.value);
      if (Array.isArray(arr)) return arr.filter((x): x is string => typeof x === "string");
    } catch {
      // Ungültiger JSON-Wert → Standard-Reihenfolge.
    }
  }
  return KATEGORIE_REIHENFOLGE;
}

export async function getGerichteNachKategorie(
  bereich: Bereich,
): Promise<{ kategorie: string; gerichte: Gericht[] }[]> {
  const liste = await getGerichte(bereich);
  const reihenfolge = await getKategorieReihenfolge(bereich);
  const kategorien = sortiereKategorien(
    Array.from(new Set(liste.map((g) => g.kategorie))),
    reihenfolge,
  );

  return kategorien.map((kategorie) => ({
    kategorie,
    gerichte: liste.filter((g) => g.kategorie === kategorie),
  }));
}

/* ------------------------------ Events ------------------------------ */

/** Alle veröffentlichten Events, chronologisch aufsteigend. */
export async function getEvents(): Promise<Event[]> {
  const rows = await prisma.event.findMany({
    where: { veroeffentlicht: true },
    orderBy: { datum: "asc" },
  });
  return rows.map(zuEvent);
}

/**
 * Kommende veröffentlichte Events (ab heute), aufsteigend, begrenzt.
 * `heute` ist als Parameter injizierbar, um die Funktion testbar/deterministisch
 * zu halten; ohne Angabe wird das aktuelle Datum verwendet.
 */
export async function getKommendeEvents(limit = 3, heute?: string): Promise<Event[]> {
  const stichtag = heute ?? new Date().toISOString().slice(0, 10);
  const alle = await getEvents();
  return alle.filter((e) => e.datum >= stichtag).slice(0, limit);
}

/** Ein einzelnes veröffentlichtes Event anhand seines Slugs (oder null). */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const event = await prisma.event.findFirst({
    where: { slug, veroeffentlicht: true },
  });
  return event ? zuEvent(event) : null;
}

/* ------------------------------ Bilder ------------------------------ */

/** Galeriebilder, optional auf einen Bereich gefiltert. */
export async function getBilder(bereich?: BildBereich): Promise<Bild[]> {
  const rows = await prisma.bild.findMany({
    where: bereich ? { bereich } : undefined,
    orderBy: { reihenfolge: "asc" },
  });
  return rows.map(zuBild);
}

/**
 * Galerie-Gruppen für die Darstellung. Mehrere `bereich`-Werte werden zu einer
 * sichtbaren Gruppe zusammengefasst; leere Gruppen (ohne Bilder) fallen raus.
 * Reihenfolge der Gruppen ist vorgegeben, Bilder folgen ihrer `reihenfolge`.
 */
export interface GalerieGruppe {
  label: string;
  bilder: Bild[];
}

const GALERIE_GRUPPEN: { label: string; bereiche: BildBereich[] }[] = [
  { label: "Das Landhaus", bereiche: ["aussen", "restaurant"] },
  { label: "Imbiss", bereiche: ["imbiss"] },
  { label: "Der Kotten", bereiche: ["kotten"] },
  { label: "Essen", bereiche: ["essen"] },
  { label: "Events", bereiche: ["events"] },
];

export async function getGalerieGruppen(): Promise<GalerieGruppe[]> {
  const alle = await getBilder();
  return GALERIE_GRUPPEN.map(({ label, bereiche }) => ({
    label,
    bilder: alle.filter((b) => bereiche.includes(b.bereich)),
  })).filter((gruppe) => gruppe.bilder.length > 0);
}

/* --------------------------- Einstellungen -------------------------- */

/** Einzelnen Einstellungswert lesen (oder null). */
export async function getEinstellung(key: string): Promise<string | null> {
  const eintrag = await prisma.einstellung.findUnique({ where: { key } });
  return eintrag?.value ?? null;
}

export interface Kontakt {
  telefon: string | null;
  whatsapp: string | null;
  email: string | null;
  adresse: string | null;
}

/** Gebündelte Kontaktdaten für Footer, CTAs und Anfahrt. */
export async function getKontakt(): Promise<Kontakt> {
  return {
    telefon: await getEinstellung("telefon"),
    whatsapp: await getEinstellung("whatsapp"),
    email: await getEinstellung("email"),
    adresse: await getEinstellung("adresse"),
  };
}
