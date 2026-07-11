import { cn } from "@/lib/utils";

/** Eine Öffnungszeiten-Zeile: entweder Tag→Zeit-Paar oder ein freier Hinweis. */
type Zeile = { tag: string; zeit: string } | { hinweis: string };

/**
 * Zerlegt einen Öffnungszeiten-Text (eine Angabe pro Zeile) in strukturierte
 * Zeilen: „Di–Do 17:00–21:00 Uhr" → Tag „Di–Do" + Zeit „17:00–21:00 Uhr".
 * Zeilen ohne Uhrzeit (z. B. „Mo Ruhetag", „Bei Veranstaltungen …") bleiben
 * als durchgehender Hinweis erhalten.
 */
function parseZeiten(text: string): Zeile[] {
  return text
    .split("\n")
    .map((z) => z.trim())
    .filter(Boolean)
    .map((zeile) => {
      const treffer = zeile.match(/^(.*?)\s+(\d.*)$/);
      return treffer && treffer[1]
        ? { tag: treffer[1].trim(), zeit: treffer[2].trim() }
        : { hinweis: zeile };
    });
}

/**
 * Stellt Öffnungszeiten als übersichtliche Liste dar: Tag links, Uhrzeit
 * rechtsbündig, feine Trennlinien zwischen den Zeilen. Wird auf der Startseite
 * (Öffnungszeiten-Sektion) und im Footer verwendet, damit die Darstellung
 * überall identisch ist.
 */
export default function OeffnungszeitenListe({
  text,
  hell = false,
  className,
}: {
  text: string;
  /** Helle Variante für dunklen Hintergrund (Footer, dunkle Sektion). */
  hell?: boolean;
  className?: string;
}) {
  const zeilen = parseZeiten(text);

  return (
    <dl className={cn("text-sm", className)}>
      {zeilen.map((zeile, i) =>
        "hinweis" in zeile ? (
          <p
            key={i}
            className={cn(
              "border-t py-2 leading-relaxed first:border-t-0",
              hell ? "border-creme/15 text-creme/80" : "border-tinte/10 text-tinte/75",
            )}
          >
            {zeile.hinweis}
          </p>
        ) : (
          <div
            key={i}
            className={cn(
              "flex items-baseline justify-between gap-4 border-t py-2 first:border-t-0",
              hell ? "border-creme/15" : "border-tinte/10",
            )}
          >
            <dt className={cn("font-medium", hell ? "text-creme" : "text-wald-dark")}>
              {zeile.tag}
            </dt>
            <dd
              className={cn(
                "text-right tabular-nums",
                hell ? "text-creme/80" : "text-tinte/75",
              )}
            >
              {zeile.zeit}
            </dd>
          </div>
        ),
      )}
    </dl>
  );
}
