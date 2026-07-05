import type { Gericht } from "@/types";
import GerichtZeile from "./GerichtZeile";

/**
 * Speisekarte als aufklappbares Accordion, nach Kategorien gegliedert.
 *
 * Bewusst als natives <details>/<summary> umgesetzt (kein Client-JS, keine
 * State-Verwaltung): Der komplette Karten-Inhalt steht serverseitig im HTML –
 * gut für SEO ("… Speisekarte") und voll funktionsfähig auch ohne JavaScript.
 * Die erste Kategorie ist standardmäßig geöffnet, damit die Seite einlädt statt
 * mit Text zu erschlagen; alle weiteren öffnet der Gast bei Bedarf.
 *
 * Über das gemeinsame `name`-Attribut bilden alle Blöcke eine exklusive Gruppe:
 * Öffnet der Gast eine Kategorie, schließt der Browser die zuvor offene von
 * selbst — es ist also immer genau eine aktiv (nativ, ohne JavaScript).
 */
export default function SpeisekartenAkkordeon({
  karte,
  name = "speisekarte",
}: {
  karte: { kategorie: string; gerichte: Gericht[] }[];
  /** Gruppenname für den exklusiven Auf-/Zuklapp-Verbund (je Seite eindeutig). */
  name?: string;
}) {
  return (
    <div className="divide-y divide-creme-dark/70 overflow-hidden rounded-2xl border border-creme-dark/70 bg-creme/40">
      {karte.map((block, i) => (
        <details key={block.kategorie} name={name} open={i === 0} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-creme-dark/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-akzent [&::-webkit-details-marker]:hidden">
            <span className="flex items-baseline gap-3">
              <h3 className="font-display text-xl text-wald-dark sm:text-2xl">
                {block.kategorie}
              </h3>
              <span className="text-sm text-tinte/50">{block.gerichte.length}</span>
            </span>
            {/* Chevron dreht beim Öffnen (group-open). */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5 shrink-0 text-akzent-dark transition-transform duration-300 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="px-5 pb-4">
            {block.gerichte.map((g) => (
              <GerichtZeile key={g.id} gericht={g} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
