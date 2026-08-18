import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEinstellung, getKommendeEvents, getKontakt } from "@/lib/content";
import { flyerById } from "@/lib/admin-data";
import { formatDatumKurz } from "@/lib/utils";
import { DruckFuss, DruckKopf, druckRahmenCss } from "@/components/admin/druck";
import DruckLeiste from "@/components/admin/DruckLeiste";
import DruckSeitenende from "@/components/admin/DruckSeitenende";

/**
 * Flyer als A4-Blatt — Vorschau und Druck in einem.
 *
 * Am Bildschirm liegt genau das weiße Blatt vor einem, das der Drucker ausgibt;
 * „Drucken → als PDF speichern" genügt. Kein Export, kein zweiter Datenstand.
 *
 * Kopf und Abschlussblock kommen aus components/admin/druck.tsx — derselben
 * Quelle wie bei der Speisekarte. Ein Beiblatt zur Karte sieht dadurch nicht nur
 * ähnlich aus, sondern ist automatisch identisch, auch nach künftigen Änderungen.
 *
 * Die Seite liegt im Admin-Bereich: geschützt durch die bestehende Anmeldung und
 * über das Admin-Layout auf noindex.
 */

export const metadata: Metadata = { title: "Flyer drucken" };

/** Immer frisch aus der Datenbank — ein Druckstück darf nie aus dem Cache kommen. */
export const dynamic = "force-dynamic";

const datumFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/**
 * Fließtext in Absätze zerlegen: eine Leerzeile trennt, einzelne Zeilenumbrüche
 * innerhalb eines Absatzes bleiben Fließtext (so wie man es in ein Textfeld
 * tippt).
 */
function absaetze(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((a) => a.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

/**
 * Öffnungszeiten der drei Bereiche aus den Einstellungen. Bereiche ohne
 * gepflegte Zeiten fallen ersatzlos weg — auf Papier darf nichts Leeres stehen.
 */
async function oeffnungszeiten(): Promise<{ label: string; zeilen: string[] }[]> {
  const bereiche = [
    { label: "Restaurant", key: "oeffnungszeiten_restaurant" },
    { label: "Imbiss", key: "oeffnungszeiten_imbiss" },
    { label: "Der Kotten", key: "oeffnungszeiten_kotten" },
  ];

  const werte = await Promise.all(bereiche.map((b) => getEinstellung(b.key)));

  return bereiche
    .map((b, i) => ({
      label: b.label,
      zeilen: (werte[i] ?? "")
        .split("\n")
        .map((z) => z.trim())
        .filter(Boolean),
    }))
    .filter((b) => b.zeilen.length > 0);
}

/** „gültig vom 01.09. bis 30.09.2026" — nur mit tatsächlich gesetzten Daten. */
function gueltigkeitsHinweis(von: Date | null, bis: Date | null): string | null {
  if (von && bis) return `Aktionen gültig vom ${datumFormat.format(von)} bis ${datumFormat.format(bis)}`;
  if (bis) return `Aktionen gültig bis ${datumFormat.format(bis)}`;
  if (von) return `Aktionen gültig ab ${datumFormat.format(von)}`;
  return null;
}

export default async function FlyerDruckSeite({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flyer = await flyerById(id);
  if (!flyer) notFound();

  const [kontakt, events, zeiten] = await Promise.all([
    getKontakt(),
    // Nur laden, was das Blatt auch zeigt.
    flyer.mitEvents ? getKommendeEvents(4) : Promise.resolve([]),
    flyer.mitOeffnungszeiten ? oeffnungszeiten() : Promise.resolve([]),
  ]);

  const textAbsaetze = flyer.vorwort ? absaetze(flyer.vorwort) : [];
  // Der Gültigkeitszeitraum bezieht sich auf die Aktionen: ohne Aktionsblock hat
  // er auf dem Blatt nichts zu suchen (der Zeitraum bleibt aber als Merkhilfe in
  // der Verwaltungsliste sichtbar).
  const hinweis =
    flyer.aktionen.length > 0
      ? gueltigkeitsHinweis(flyer.gueltigVon, flyer.gueltigBis)
      : null;

  return (
    <>
      <div className="print:hidden">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-tinte">Flyer drucken</h1>
            <p className="mt-1 max-w-2xl text-sm text-tinte/60">
              Unten liegt das A4-Blatt, wie es aus dem Drucker kommt. Inhalte ändern über{" "}
              <Link href={`/admin/flyer/${flyer.id}`} className="font-semibold underline">
                Bearbeiten
              </Link>
              ; Öffnungszeiten und Events zieht das Blatt automatisch aus den bestehenden Daten.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/flyer/${flyer.id}`}
              className="rounded-full border border-tinte/20 px-4 py-2 text-sm font-semibold text-tinte hover:bg-tinte/5"
            >
              Bearbeiten
            </Link>
            <Link
              href="/admin/flyer"
              className="rounded-full border border-tinte/20 px-4 py-2 text-sm font-semibold text-tinte hover:bg-tinte/5"
            >
              Zurück
            </Link>
          </div>
        </div>

        <DruckLeiste>
          <p className="text-sm text-tinte/60">
            Ein Flyer ist auf <strong className="font-semibold">eine Seite</strong> ausgelegt.
            Reicht der Platz nicht, zeigt die Vorschau unten einen Umbruch — dann Text kürzen oder
            eine Aktion weglassen.
          </p>
        </DruckLeiste>
      </div>

      <div className="druck-buehne">
        <div className="druck-flaeche druck-blatt">
          <DruckKopf titel={flyer.ueberschrift} unterzeile={flyer.unterzeile} />

          {textAbsaetze.length > 0 && (
            <div className="druck-text">
              {textAbsaetze.map((absatz, i) => (
                <p key={i}>{absatz}</p>
              ))}
            </div>
          )}

          {flyer.grussformel && <p className="druck-gruss">{flyer.grussformel}</p>}

          {flyer.bild && (
            <div className="druck-bild">
              {/* Breite/Höhe nur als Seitenverhältnis — die Darstellung bestimmt
                  das CSS. `alt` bleibt leer: das Bild ist Stimmung, keine
                  Information, und auf Papier liest es niemand vor. */}
              <Image src={flyer.bild} alt="" width={1600} height={1000} priority />
            </div>
          )}

          {flyer.aktionen.length > 0 && (
            <div className="druck-aktionen">
              {flyer.aktionen.map((a) => (
                <div key={a.id} className="druck-aktion">
                  {a.bild && (
                    <div className="druck-aktion-bild">
                      <Image src={a.bild} alt="" width={800} height={600} />
                    </div>
                  )}
                  <div className="druck-aktion-text">
                    <p className="druck-aktion-titel">{a.titel}</p>
                    {a.hinweis && <p className="druck-aktion-hinweis">{a.hinweis}</p>}
                    {a.text && <p className="druck-aktion-satz">{a.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {hinweis && <p className="druck-gueltig">{hinweis}</p>}

          {events.length > 0 && (
            <div className="druck-liste">
              <p className="druck-liste-titel">Die nächsten Veranstaltungen</p>
              {events.map((e) => (
                <p key={e.id} className="druck-liste-zeile">
                  <strong>{formatDatumKurz(e.datum)}</strong> · {e.titel} · {e.uhrzeit}
                  {e.eintritt && ` · ${e.eintritt}`}
                </p>
              ))}
            </div>
          )}

          {zeiten.length > 0 && (
            <div className="druck-liste">
              <p className="druck-liste-titel">Öffnungszeiten</p>
              <div className="druck-zeiten">
                {zeiten.map((b) => (
                  <div key={b.label}>
                    <p className="druck-zeiten-bereich">{b.label}</p>
                    {b.zeilen.map((z) => (
                      <p key={z} className="druck-liste-zeile">
                        {z}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <DruckFuss kontakt={kontakt} />

          {/* Zeigt sich nur, wenn der Inhalt über eine A4-Seite hinausgeht —
              das soll man sehen, bevor 200 Beiblätter aus dem Drucker kommen. */}
          <DruckSeitenende />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: druckRahmenCss + flyerCss }} />
    </>
  );
}

/* --------------------------------- CSS --------------------------------- */

/**
 * Nur das Innenleben des Blattes — Bühne, Papierfläche, Kopf, Abbinder und
 * `@page` kommen aus `druckRahmenCss` (components/admin/druck.tsx).
 *
 * Anders als die Speisekarte braucht der Flyer keine Rahmentabelle: er ist auf
 * eine Seite ausgelegt, es gibt also keinen Seitenumbruch, dessen Kopf und Fuß
 * sich wiederholen müssten.
 */
const flyerCss = `
.druck-blatt {
  /* Ein schmalerer Satzspiegel als die Blattbreite: Fließtext über 178 mm wäre
     kaum lesbar. Kopf, Text, Aktionen und Abbinder teilen ihn (siehe
     druckRahmenCss). */
  --satzbreite: 155mm;
  padding: 14mm 16mm;
  /* Das Blatt ist so hoch wie sein Inhalt — keine erzwungene A4-Höhe: eine leere
     Restfläche unter dem Kontaktblock sieht nach Fehler aus, obwohl der Flyer
     fertig ist. Ob der Inhalt über eine Seite läuft, meldet stattdessen die
     Marke unten (DruckSeitenende), und nur dann. */
  position: relative;
}

/* Seitenende-Marke: 269 mm nutzbare Höhe (A4 minus 2 × 14 mm Druckrand),
   gemessen ab dem Beginn des Satzspiegels. Der Anker selbst ist ohne Höhe und
   verändert das Blatt nicht. */
.druck-seitenende-anker { height: 0; }
.druck-seitenende {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(14mm + 269mm);
  border-top: 1px dashed #c8825e;
  text-align: right;
}
.druck-seitenende span {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b06a41;
}

.druck-text,
.druck-gruss,
.druck-bild,
.druck-aktionen,
.druck-gueltig,
.druck-liste {
  max-width: var(--satzbreite, 100%);
  margin-inline: auto;
}

/* Vorwort: etwas größer und luftiger als die Karte — hier wird gelesen, nicht
   gescannt. */
.druck-text { font-size: 0.9rem; line-height: 1.55; color: #2b2620e6; }
.druck-text p + p { margin-top: 0.6rem; }

.druck-gruss {
  font-family: var(--font-script);
  font-size: 1.9rem;
  line-height: 1.1;
  color: #2f4a3c;
  text-align: right;
  margin-top: 1rem;
}

.druck-bild { margin-top: 1.2rem; }
.druck-bild img {
  width: 100%;
  height: auto;
  max-height: 85mm;
  object-fit: cover;
  border-radius: 0.75rem;
  display: block;
}

/* Aktionsblöcke: je Aktion eine ruhige Fläche, Bild links neben dem Text. Eine
   Spalte, weil auf einem Beiblatt selten mehr als drei Aktionen stehen — und
   Aktionen gelesen, nicht verglichen werden. */
.druck-aktionen { margin-top: 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; }
.druck-aktion {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  padding: 0.7rem 0.9rem;
  border: 1px solid #e6dac8;
  border-radius: 0.75rem;
  background: #faf6ef;
  break-inside: avoid;
}
.druck-aktion-bild { flex: 0 0 26mm; }
.druck-aktion-bild img {
  width: 26mm;
  height: 20mm;
  object-fit: cover;
  border-radius: 0.5rem;
  display: block;
}
.druck-aktion-text { min-width: 0; }
.druck-aktion-titel {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #1f3328;
}
.druck-aktion-hinweis {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2f4a3c;
  margin-top: 0.15rem;
}
.druck-aktion-satz {
  font-size: 0.82rem;
  line-height: 1.4;
  color: #2b2620b3;
  margin-top: 0.2rem;
}

.druck-gueltig {
  margin-top: 0.6rem;
  font-size: 0.7rem;
  font-style: italic;
  color: #2b262099;
  text-align: right;
}

/* Events und Öffnungszeiten: schlichte Listen mit feiner Trennlinie darüber —
   sie ergänzen den Text, sie tragen ihn nicht. */
.druck-liste {
  margin-top: 1.1rem;
  padding-top: 0.6rem;
  border-top: 1px solid #e6dac8;
  break-inside: avoid;
}
.druck-liste-titel {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #1f3328;
  margin-bottom: 0.35rem;
}
.druck-liste-zeile { font-size: 0.82rem; line-height: 1.5; color: #2b2620cc; }
.druck-zeiten { display: flex; flex-wrap: wrap; gap: 0.4rem 2.5rem; }
.druck-zeiten-bereich {
  font-size: 0.78rem;
  font-weight: 700;
  color: #1f3328;
}

@media print {
  /* Im Druck übernimmt der @page-Rand — der Blatt-Innenabstand entfällt. */
  .druck-blatt { padding: 0; }
  .druck-seitenende { display: none; }

  /* Farben von Aktionsflächen und Überschriften auch im Druck erhalten. */
  .druck-aktion, .druck-aktion-titel, .druck-aktion-hinweis, .druck-gruss,
  .druck-liste-titel, .druck-zeiten-bereich {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
`;
