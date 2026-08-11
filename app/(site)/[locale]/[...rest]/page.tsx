import { notFound } from "next/navigation";

/**
 * Auffangroute für unbekannte URLs unterhalb einer Sprache (z. B. /de/gibt-es-nicht).
 *
 * Hintergrund: Ein `not-found.tsx` in einem Segment greift nur, wenn dort
 * tatsächlich `notFound()` geworfen wird. Bei URLs, die auf gar keine Route
 * passen, würde Next sonst seine eingebaute, ungestaltete 404-Seite ohne
 * Header/Footer zeigen. Diese Catch-all-Route fängt solche Adressen ab und löst
 * bewusst `notFound()` aus — Ergebnis: echter HTTP-Status 404 plus die eigene
 * 404-Seite in der richtigen Sprache.
 *
 * Konkrete Routen (z. B. /de/events) haben Vorrang, diese Datei stört sie nicht.
 */
export default function UnbekannteSeite() {
  notFound();
}
