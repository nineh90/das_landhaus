/**
 * Allgemeine Hilfsfunktionen.
 */

/**
 * Fügt mehrere CSS-Klassen zusammen und filtert leere/falsy Werte heraus.
 * Schlanke Alternative zu clsx — bewusst ohne zusätzliche Dependency.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Wandelt einen Titel in einen URL-tauglichen Slug um.
 * Wird in Stufe 2 ggf. durch ein echtes DB-Feld ersetzt — die Aufrufer ändern sich nicht.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formatiert einen Preis als deutschen Euro-Betrag, z. B. 12.5 → "12,50 €".
 */
export function formatPreis(preis: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(preis);
}

/**
 * Formatiert ein ISO-Datum für die Anzeige, z. B. "2026-07-12" → "Sonntag, 12. Juli 2026".
 */
export function formatDatum(isoDatum: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDatum));
}

/**
 * Kurzes Datumsformat für Event-Karten, z. B. "12. Juli 2026".
 */
export function formatDatumKurz(isoDatum: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDatum));
}
