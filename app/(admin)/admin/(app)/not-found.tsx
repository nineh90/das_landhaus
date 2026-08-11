import Link from "next/link";
import { AdminSeitenkopf, Karte, primaerBtn } from "@/components/admin/ui";

/**
 * 404-Seite des Admin-Bereichs — innerhalb der Admin-Navigation, damit ein
 * falscher Link (oder ein gelöschter Datensatz, siehe `notFound()` in den
 * Bearbeiten-Seiten) nicht in Next.js' nackter Standard-404 endet.
 */
export default function AdminNichtGefunden() {
  return (
    <>
      <AdminSeitenkopf
        titel="Seite nicht gefunden"
        beschreibung="Diese Adresse gibt es im Admin-Bereich nicht — oder der Eintrag wurde inzwischen gelöscht."
      />

      <Karte className="max-w-xl">
        <p className="text-tinte/70">
          Über die Navigation oben kommst du zurück zu Speisekarte, Events, Galerie und
          Einstellungen.
        </p>
        <Link href="/admin" className={`${primaerBtn} mt-6`}>
          Zur Übersicht
        </Link>
      </Karte>
    </>
  );
}
