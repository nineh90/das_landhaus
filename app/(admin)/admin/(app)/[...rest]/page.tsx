import { notFound } from "next/navigation";

/**
 * Auffangroute für unbekannte Adressen im Admin-Bereich (z. B. /admin/tippfehler).
 * Löst `notFound()` aus → HTTP 404 + `not-found.tsx` innerhalb des Admin-Layouts.
 * Konkrete Admin-Routen haben Vorrang.
 */
export default function UnbekannteAdminSeite() {
  notFound();
}
