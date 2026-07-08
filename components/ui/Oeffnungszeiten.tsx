import { getEinstellung } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
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
          <p
            className={cn(
              "mt-2 whitespace-pre-line text-sm leading-relaxed",
              hell ? "text-creme/80" : "text-tinte/75",
            )}
          >
            {b.zeiten}
          </p>
        </div>
      ))}
    </div>
  );
}
