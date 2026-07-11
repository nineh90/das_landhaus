import Link from "next/link";
import OeffnungszeitenListe from "@/components/ui/OeffnungszeitenListe";
import { getEinstellung } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Öffnungszeiten-Übersicht für alle drei Bereiche.
 * Werte kommen aus den Einstellungen (Key-Value) → in Stufe 2 über Admin pflegbar.
 * Die Bereichs-Titel werden aus dem Wörterbuch (nav) localisiert.
 */
type BereichKey = "restaurant" | "imbiss" | "kotten";

export default async function Oeffnungszeiten({
  locale,
  hell = false,
  nur,
}: {
  locale: Locale;
  hell?: boolean;
  /** Auf bestimmte Bereiche einschränken (z. B. nur "restaurant"). Standard: alle drei. */
  nur?: BereichKey[];
}) {
  const [restaurant, imbiss, kotten, dict] = await Promise.all([
    getEinstellung("oeffnungszeiten_restaurant"),
    getEinstellung("oeffnungszeiten_imbiss"),
    getEinstellung("oeffnungszeiten_kotten"),
    getDictionary(locale),
  ]);

  const alle = [
    { key: "restaurant" as const, titel: dict.nav.restaurant, zeiten: restaurant },
    { key: "imbiss" as const, titel: dict.nav.imbiss, zeiten: imbiss },
    { key: "kotten" as const, titel: dict.nav.derKotten, zeiten: kotten },
  ];

  const bereiche = alle
    .filter((b) => (nur ? nur.includes(b.key) : true))
    .filter((b) => b.zeiten);

  // Layout an die Anzahl anpassen: ein einzelner Bereich zentriert, sonst Raster.
  const layout =
    bereiche.length === 1
      ? "mx-auto max-w-md"
      : cn("grid gap-6", bereiche.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3");

  return (
    <div className={layout}>
      {bereiche.map((b) => (
        <div
          key={b.key}
          className={cn(
            "rounded-2xl p-6",
            hell ? "bg-creme/10" : "bg-creme-dark/60",
          )}
        >
          <h3 className={cn("font-display text-xl", hell ? "text-creme" : "text-wald-dark")}>
            {b.titel}
          </h3>
          <OeffnungszeitenListe text={b.zeiten!} hell={hell} className="mt-2" />
          {/* Kotten öffnet nur zu Veranstaltungen → zu den Events; zusätzlich Miet-Teaser */}
          {b.key === "kotten" && (
            <div className="mt-3 flex flex-col gap-1.5">
              <Link
                href={localizedHref(locale, "/events")}
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                  hell ? "text-creme hover:text-akzent" : "text-akzent-dark hover:text-akzent",
                )}
              >
                {dict.common.kommendeEvents}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href={localizedHref(locale, "/der-kotten")}
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-semibold transition-colors",
                  hell ? "text-creme hover:text-akzent" : "text-akzent-dark hover:text-akzent",
                )}
              >
                {dict.common.kottenMieten}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
