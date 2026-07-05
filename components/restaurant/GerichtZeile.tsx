import type { Gericht } from "@/types";
import { formatPreis } from "@/lib/utils";

/** Eine Zeile der Speisekarte: Name + Beschreibung links, Preis rechts. */
export default function GerichtZeile({ gericht }: { gericht: Gericht }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-creme-dark/70 py-3 last:border-0">
      <div>
        <h4 className="font-display text-lg text-wald-dark">{gericht.name}</h4>
        {gericht.beschreibung && (
          <p className="mt-0.5 text-sm text-tinte/70">{gericht.beschreibung}</p>
        )}
      </div>
      <span className="shrink-0 font-semibold text-erde-dark">{formatPreis(gericht.preis)}</span>
    </div>
  );
}
