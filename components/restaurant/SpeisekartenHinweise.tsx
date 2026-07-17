import type { Gericht } from "@/types";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { ALLERGENE, ZUSATZSTOFFE } from "@/lib/schemas";

/**
 * Legende + rechtlicher Auffang-Hinweis unter der Speisekarte.
 *
 * Datengetrieben: Es werden nur die Kürzel erklärt, die auf mindestens einem
 * Gericht der Karte tatsächlich gesetzt sind. Solange nichts erfasst ist, rendert
 * die Komponente `null` — es erscheint also nichts. Sobald der Betreiber im Admin
 * Allergene/Zusatzstoffe pflegt, taucht die Legende automatisch auf.
 *
 * Der Hinweis (mündliche Auskunft beim Personal) ist die rechtlich anerkannte
 * Ergänzung und deckt Gerichte ab, die (noch) keine Angaben tragen.
 */
export default function SpeisekartenHinweise({
  karte,
  labels,
}: {
  karte: { kategorie: string; gerichte: Gericht[] }[];
  labels: Dictionary["speisekarteHinweise"];
}) {
  const alleGerichte = karte.flatMap((block) => block.gerichte);
  const genutzteAllergene = ALLERGENE.filter((a) =>
    alleGerichte.some((g) => g.allergene.includes(a.code)),
  );
  const genutzteZusatzstoffe = ZUSATZSTOFFE.filter((z) =>
    alleGerichte.some((g) => g.zusatzstoffe.includes(z.code)),
  );

  // Keine Angaben gepflegt → nichts anzeigen.
  if (genutzteAllergene.length === 0 && genutzteZusatzstoffe.length === 0) return null;

  return (
    <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-creme-dark/70 bg-creme/40 p-5">
      <p className="font-display text-base text-wald-dark">{labels.titel}</p>

      {genutzteAllergene.length > 0 && (
        <p className="mt-2 text-sm text-tinte/70">
          <span className="font-semibold text-wald-dark">{labels.allergene}: </span>
          {genutzteAllergene.map((a) => `${a.kuerzel} ${a.label}`).join(" · ")}
        </p>
      )}

      {genutzteZusatzstoffe.length > 0 && (
        <p className="mt-1 text-sm text-tinte/70">
          <span className="font-semibold text-wald-dark">{labels.zusatzstoffe}: </span>
          {genutzteZusatzstoffe.map((z) => `${z.kuerzel} ${z.label}`).join(" · ")}
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-tinte/55">{labels.hinweis}</p>
    </div>
  );
}
