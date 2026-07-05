/**
 * Zentrale Typdefinitionen.
 *
 * WICHTIG (Modularität): Diese Typen sind bewusst deckungsgleich zu den späteren
 * Prisma-Modellen aus CLAUDE.md. In Build 1 werden sie von statischen Daten erfüllt,
 * in Stufe 2 von Prisma. Optionale Felder nutzen `null` (nicht `undefined`),
 * um Prisma (`String?`) zu spiegeln. Datums-Werte sind ISO-Strings, damit Server
 * Components sie ohne Konvertierung serialisieren können.
 */

export type Bereich = "restaurant" | "imbiss";
export type BildBereich = "restaurant" | "kotten" | "imbiss" | "aussen" | "essen" | "events";

export interface Gericht {
  id: string;
  name: string;
  beschreibung: string | null;
  preis: number;
  kategorie: string; // z. B. "Vorspeise", "Hauptgang", "Dessert", "Getränk"
  bereich: Bereich;
  verfuegbar: boolean;
  bild: string | null;
  reihenfolge: number;
}

export interface Event {
  id: string;
  slug: string; // Build-1-Zusatz für /events/[slug]; in Stufe 2 DB-Feld oder abgeleitet
  titel: string;
  beschreibung: string | null;
  datum: string; // ISO-String, z. B. "2026-07-12"
  uhrzeit: string; // z. B. "20:00 Uhr"
  eintritt: string | null; // z. B. "8,00 €" oder "Eintritt frei"
  bild: string | null;
  veroeffentlicht: boolean;
}

export interface Bild {
  id: string;
  url: string;
  alt: string | null; // Barrierefreiheit: beschreibt das Bild für Screenreader
  beschreibung: string | null; // kurze, sichtbare Bildunterschrift in der Galerie/Lightbox
  bereich: BildBereich;
}

export interface Einstellung {
  key: string;
  value: string;
}
