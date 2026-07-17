import type { Gericht } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { formatPreis } from "@/lib/utils";
import { gerichtKennzeichnung } from "@/lib/schemas";

type KennzeichnungLabels = Pick<
  Dictionary["speisekarteHinweise"],
  "allergene" | "zusatzstoffe"
>;

/** Eine Zeile der Speisekarte: Name + Beschreibung links, Preis rechts. */
export default function GerichtZeile({
  gericht,
  labels,
}: {
  gericht: Gericht;
  labels: KennzeichnungLabels;
}) {
  const kennzeichnung = gerichtKennzeichnung(gericht);

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-creme-dark/70 py-3 last:border-0">
      <div>
        <h4 className="font-display text-lg text-wald-dark">{gericht.name}</h4>
        {gericht.beschreibung && (
          <p className="mt-0.5 text-sm text-tinte/70">{gericht.beschreibung}</p>
        )}

        {/* Kennzeichnung als eigene, dezente Zeile direkt am Gericht — nur wenn
            gepflegt. Kürzel erklärt die Legende unter der Karte; Klartext liegt
            zusätzlich im title-Attribut. */}
        {kennzeichnung.alle.length > 0 && (
          <p className="mt-1 text-xs text-tinte/55">
            {kennzeichnung.allergene.length > 0 && (
              <span title={kennzeichnung.allergene.map((c) => c.label).join(", ")}>
                <span className="font-semibold text-tinte/70">{labels.allergene}:</span>{" "}
                {kennzeichnung.allergene.map((c) => c.kuerzel).join(", ")}
              </span>
            )}
            {kennzeichnung.allergene.length > 0 && kennzeichnung.zusatzstoffe.length > 0 && (
              <span className="px-1.5 text-tinte/30">·</span>
            )}
            {kennzeichnung.zusatzstoffe.length > 0 && (
              <span title={kennzeichnung.zusatzstoffe.map((c) => c.label).join(", ")}>
                <span className="font-semibold text-tinte/70">{labels.zusatzstoffe}:</span>{" "}
                {kennzeichnung.zusatzstoffe.map((c) => c.kuerzel).join(", ")}
              </span>
            )}
          </p>
        )}
      </div>
      <span className="shrink-0 font-semibold text-erde-dark">{formatPreis(gericht.preis)}</span>
    </div>
  );
}
