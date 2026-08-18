import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Gericht } from "@/types";
import {
  getGerichteNachKategorie,
  getKontakt,
  type KategorieBlock,
  type Kontakt,
} from "@/lib/content";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { ALLERGENE, ZUSATZSTOFFE, gerichtKennzeichnung } from "@/lib/schemas";
import { formatPreis } from "@/lib/utils";
import { activeSocialChannels, socialHandle } from "@/lib/social";
import { SITE_URL } from "@/lib/site";
import DruckOptionen from "@/components/admin/DruckOptionen";

/**
 * Druckbare Speisekarte — dieselbe Datenquelle wie die öffentliche Website.
 *
 * Der Sinn der Seite: Preise und Kennzeichnung werden an genau EINER Stelle
 * gepflegt (Admin → Speisekarte). Die Website ist damit sofort aktuell, und über
 * diese Seite entsteht ohne Zwischenschritt die gedruckte Karte — „Drucken → als
 * PDF speichern" im Browser genügt. Kein Export, kein zweiter Datenstand.
 *
 * Die Seite liegt bewusst im Admin-Bereich: sie ist damit durch die bestehende
 * Anmeldung geschützt und für Suchmaschinen gesperrt (robots: noindex im
 * Admin-Layout).
 */

export const metadata: Metadata = { title: "Speisekarte drucken" };

/** Immer frisch aus der Datenbank — eine gedruckte Karte darf nie aus dem Cache kommen. */
export const dynamic = "force-dynamic";

const BEREICH_TITEL: Record<string, (d: Dictionary) => string> = {
  restaurant: (d) => d.nav.restaurant,
  imbiss: (d) => d.nav.imbiss,
};

/* --------------------------- Karten-Bausteine --------------------------- */

/**
 * Eine Gericht-Zeile: Name (+ Kennzeichnungs-Kürzel), Führungslinie, Preis.
 *
 * Als `<tr>` — siehe DruckKarte: die Tabellenstruktur ist es, die dem Browser
 * erlaubt, Gerichte nie mitten durchzuschneiden.
 */
function DruckZeile({
  gericht,
  mitBeschreibung,
  mitPreis,
}: {
  gericht: Gericht;
  mitBeschreibung: boolean;
  mitPreis: boolean;
}) {
  const kennzeichnung = gerichtKennzeichnung(gericht);
  const kuerzel = kennzeichnung.alle.map((k) => k.kuerzel).join(",");

  return (
    <tr className="druck-zeile">
      <td>
      <div className="druck-zeile-kopf">
        <span className="druck-name">
          {gericht.name}
          {kuerzel && (
            <sup
              className="druck-kuerzel"
              title={kennzeichnung.alle.map((k) => k.label).join(", ")}
            >
              {kuerzel}
            </sup>
          )}
        </span>
        <span className="druck-linie" aria-hidden="true" />
        {mitPreis && <span className="druck-preis">{formatPreis(gericht.preis)}</span>}
      </div>
      {mitBeschreibung && gericht.beschreibung && (
        <p className="druck-beschreibung">{gericht.beschreibung}</p>
      )}
      </td>
    </tr>
  );
}

/**
 * Legende — erklärt nur die Kürzel, die auf der Karte tatsächlich vorkommen.
 *
 * Sitzt im <tfoot> der Karte und erscheint dadurch auf JEDER gedruckten Seite:
 * die Kennzeichnung muss beim Gericht lesbar sein — eine Legende nur auf der
 * letzten Seite nützt niemandem auf Seite 2. Der Browser wiederholt einen
 * Tabellenfuß von selbst und reserviert den Platz dafür, anders als ein per
 * `position: fixed` angeheftetes Element (das den Text überdeckt und in
 * Chromium ausgerechnet auf Seite 1 fehlt).
 */
function DruckLegende({
  karte,
  labels,
}: {
  karte: KategorieBlock[];
  labels: Dictionary["speisekarteHinweise"];
}) {
  const gerichte = karte.flatMap((block) => block.gerichte);
  const allergene = ALLERGENE.filter((a) => gerichte.some((g) => g.allergene.includes(a.code)));
  const zusatzstoffe = ZUSATZSTOFFE.filter((z) =>
    gerichte.some((g) => g.zusatzstoffe.includes(z.code)),
  );

  return (
    <div className="druck-legende">
      {(allergene.length > 0 || zusatzstoffe.length > 0) && (
        <>

          <p className="druck-legende-titel">{labels.titel}</p>
          {allergene.length > 0 && (
            <p>
              <strong>{labels.allergene}:</strong>{" "}
              {allergene.map((a) => `${a.kuerzel} ${a.label}`).join(" · ")}
            </p>
          )}
          {zusatzstoffe.length > 0 && (
            <p>
              <strong>{labels.zusatzstoffe}:</strong>{" "}
              {zusatzstoffe.map((z) => `${z.kuerzel} ${z.label}`).join(" · ")}
            </p>
          )}
        </>
      )}
      <p className="druck-legende-hinweis">{labels.hinweis}</p>
    </div>
  );
}

/**
 * Kontakt- und Social-Zeile am Fuß der Karte.
 *
 * Auf Papier führt kein Klick weiter — darum stehen hier Domain und Handles im
 * Klartext, nicht die verlinkten URLs. Gezeigt wird nur, was auch wirklich
 * gepflegt ist (Kontaktdaten aus den Einstellungen, Kanäle aus lib/social.ts);
 * fehlt etwas, fällt die Angabe ersatzlos weg.
 */
function DruckFuss({ kontakt }: { kontakt: Kontakt }) {
  const domain = SITE_URL.replace(/^https?:\/\/(www\.)?/, "");

  // WhatsApp gehört zu den Kontaktdaten, nicht zu den Profilen: die Einstellung
  // `whatsapp` ist die gepflegte Quelle (siehe unten). Der gleichnamige Kanal in
  // lib/social.ts ist ein wa.me-Aktionslink — auf Papier wertlos, und sein
  // "Handle" wäre die nackte Ziffernfolge.
  const kanaele = activeSocialChannels
    .filter((c) => c.platform !== "whatsapp")
    .map((c) => {
      const handle = socialHandle(c);
      return handle ? `${c.label} ${handle}` : c.label;
    });

  const zeile = [
    kontakt.adresse,
    ...telefonZeilen(kontakt),
    kontakt.email,
  ].filter(Boolean) as string[];

  return (
    <div className="druck-fuss">
      <p className="druck-fuss-web">{domain}</p>
      {zeile.map((eintrag) => (
        <p key={eintrag} className="druck-fuss-zeile">
          {eintrag}
        </p>
      ))}
      {kanaele.length > 0 && <p className="druck-fuss-social">{kanaele.join("   ·   ")}</p>}
    </div>
  );
}

/**
 * Telefon und WhatsApp für die gedruckte Karte aufbereiten.
 *
 * Beide sind heute leer und sollen erscheinen, sobald sie in den Einstellungen
 * gepflegt sind — ohne Code-Änderung. `telefon` ist bereits lesbar erfasst,
 * `whatsapp` dagegen als reine Ziffernfolge für den wa.me-Link (z. B.
 * "4954820000000"); auf Papier führt kein Link irgendwohin, also braucht es dort
 * eine lesbare Nummer.
 *
 * Ist es dieselbe Nummer — der Normalfall in der Gastronomie —, steht sie einmal
 * mit beiden Labels statt zweimal untereinander.
 */
function telefonZeilen({ telefon, whatsapp }: Kontakt): string[] {
  const ziffern = (wert: string) => wert.replace(/\D/g, "");
  // Landesvorwahl und führende Null lassen dieselbe Nummer unterschiedlich
  // aussehen ("05482 …" vs. "495482 …") — der Vergleich der letzten Stellen
  // erkennt sie trotzdem als eine.
  const gleich =
    !!telefon &&
    !!whatsapp &&
    ziffern(telefon).slice(-8) === ziffern(whatsapp).slice(-8) &&
    ziffern(whatsapp).length >= 8;

  if (gleich) return [`Tel. / WhatsApp ${telefon}`];

  return [
    telefon ? `Tel. ${telefon}` : "",
    // Ohne bekannte Vorwahlgrenzen ist "+" plus Ziffernfolge die einzige
    // Darstellung, die garantiert richtig bleibt.
    whatsapp ? `WhatsApp +${ziffern(whatsapp)}` : "",
  ].filter(Boolean);
}

/**
 * Eine komplette Karte (ein Bereich) — beginnt beim Druck auf einer neuen Seite.
 *
 * Die äußere Tabelle ist kein Layout-Selbstzweck: nur so lässt sich die Legende
 * als <tfoot> auf jeder Seite wiederholen (siehe DruckLegende). Der eigentliche
 * Karteninhalt steckt in einer einzigen Zelle und fließt darin ganz normal —
 * inklusive der CSS-Spalten der Kompakt-Ansicht.
 */
function DruckKarte({
  titel,
  kontakt,
  karte,
  labels,
  spalten,
  mitBeschreibung,
  mitPreis,
}: {
  titel: string;
  kontakt: Kontakt;
  karte: KategorieBlock[];
  labels: Dictionary["speisekarteHinweise"];
  spalten: number;
  mitBeschreibung: boolean;
  mitPreis: boolean;
}) {
  return (
    <table
      className="druck-karte"
      /* Eine Satzbreite für Kopf, Inhalt, Legende und Abbinder — so rahmen alle
         vier denselben Satzspiegel. Einspaltig schmaler als die Seite (sonst
         stünden Name und Preis unlesbar weit auseinander), zweispaltig volle
         Breite, weil die Spalten schon für Nähe sorgen. */
      style={{ "--satzbreite": spalten === 2 ? "100%" : "148mm" } as React.CSSProperties}
    >
      {/* Kopf im <thead> und Legende im <tfoot>: beides wiederholt der Browser
          beim Seitenumbruch von selbst. Dadurch trägt JEDE Seite des PDFs
          denselben Rahmen — Logo oben, Kennzeichnung unten — und dazwischen
          steht nur der Inhalt der jeweiligen Seite. Weil der Kopf auf jeder
          Seite erscheint, ist er bewusst schlank gehalten; die Adresse steht
          dafür unten bei den übrigen Kontaktdaten. */}
      <thead>
        <tr>
          <th scope="col">
            <div className="druck-kopf">
              {/* Bewusst das runde Emblem statt des Voll-Logos: dieses trägt den
                  Schriftzug „Restaurant" fest im Bild und wäre auf der
                  Imbiss-Karte schlicht falsch. Das Emblem passt zu jedem Bereich. */}
              <Image
                src="/images/logo/emblem.png"
                alt=""
                width={320}
                height={320}
                className="druck-emblem"
                priority
              />
              <p className="druck-marke">Das Landhaus</p>
              <h1 className="druck-titel">{titel}</h1>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
      {karte.length === 0 ? (
        <p className="druck-leer">
          Für diesen Bereich sind keine sichtbaren Gerichte hinterlegt.
        </p>
      ) : (
        <div className={spalten === 2 ? "druck-spalten druck-spalten-2" : "druck-spalten"}>
          {karte.map((block) => (
            /* Bewusst eine Tabelle statt <section>+<ul>: nur so verhält sich der
               Seitenumbruch im PDF vernünftig. Der Browser hält die Kategorie
               per `break-inside: avoid` zusammen, solange sie auf eine Seite
               passt — und wiederholt bei längeren Kategorien den `<thead>`, also
               die Überschrift, automatisch oben auf der Folgeseite. Ein Gericht
               wird durch `break-inside: avoid` auf der Zeile nie zerschnitten. */
            <table key={block.kategorie} className="druck-block">
              <thead>
                <tr>
                  <th scope="col" className="druck-kategorie">
                    {block.label}
                  </th>
                </tr>
              </thead>
              <tbody>
                {block.gerichte.map((g) => (
                  <DruckZeile
                    key={g.id}
                    gericht={g}
                    mitBeschreibung={mitBeschreibung}
                    mitPreis={mitPreis}
                  />
                ))}
              </tbody>
            </table>
          ))}
        </div>
      )}

      <DruckFuss kontakt={kontakt} />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <DruckLegende karte={karte} labels={labels} />
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

/* -------------------------------- Seite -------------------------------- */

export default async function SpeisekarteDruckSeite({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const einzel = (key: string) => (Array.isArray(sp[key]) ? sp[key][0] : sp[key]);

  const bereichWahl = einzel("bereich") ?? "restaurant";
  const bereiche = (
    bereichWahl === "beide" ? ["restaurant", "imbiss"] : [bereichWahl]
  ).filter((b): b is "restaurant" | "imbiss" => b === "restaurant" || b === "imbiss");

  const spracheRoh = einzel("sprache") ?? "de";
  const sprache: Locale = isLocale(spracheRoh) ? spracheRoh : "de";

  const spalten = einzel("spalten") === "2" ? 2 : 1;
  // Beide standardmäßig an — die Karte soll ohne Konfiguration vollständig sein.
  const mitBeschreibung = einzel("beschreibungen") !== "0";
  const mitPreis = einzel("preise") !== "0";

  const [dict, kontakt, karten] = await Promise.all([
    getDictionary(sprache),
    getKontakt(),
    Promise.all(bereiche.map((b) => getGerichteNachKategorie(b, sprache))),
  ]);

  return (
    <>
      <div className="print:hidden">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-tinte">Speisekarte drucken</h1>
            <p className="mt-1 max-w-2xl text-sm text-tinte/60">
              Zeigt exakt den Stand aus der Datenbank — also das, was auch auf der Website
              steht. Preise oder Kennzeichnung ändern sich nur über{" "}
              <Link href="/admin/speisekarte" className="font-semibold underline">
                Admin → Speisekarte
              </Link>
              ; diese Seite zieht automatisch nach.
            </p>
          </div>
          <Link
            href="/admin/speisekarte"
            className="rounded-full border border-tinte/20 px-4 py-2 text-sm font-semibold text-tinte hover:bg-tinte/5"
          >
            Zurück
          </Link>
        </div>

        <DruckOptionen
          bereich={bereichWahl}
          sprache={sprache}
          spalten={String(spalten)}
          beschreibungen={mitBeschreibung}
          preise={mitPreis}
        />
      </div>

      <div className="druck-buehne">
        {bereiche.map((bereich, i) => (
          <DruckKarte
            key={bereich}
            titel={BEREICH_TITEL[bereich](dict)}
            kontakt={kontakt}
            karte={karten[i]}
            labels={dict.speisekarteHinweise}
            spalten={spalten}
            mitBeschreibung={mitBeschreibung}
            mitPreis={mitPreis}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: druckCss }} />
    </>
  );
}

/* --------------------------------- CSS --------------------------------- */

/**
 * Bewusst als lokales <style> statt in globals.css: Die Regeln (allen voran
 * `@page`) gelten ausschließlich für diese Seite und können nirgends sonst
 * hineinwirken. `@page` lässt sich zudem nicht über Tailwind-Klassen ausdrücken.
 */
const druckCss = `
.druck-buehne { display: flex; flex-direction: column; gap: 2rem; }

.druck-karte {
  background: #fff;
  color: #2b2620;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  max-width: 210mm;
  margin-inline: auto;
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.druck-karte > thead { display: table-header-group; }
.druck-karte > thead > tr > th { padding: 14mm 16mm 0; font-weight: 400; }
.druck-karte > tbody > tr > td { padding: 0 16mm; }
.druck-karte > tfoot { display: table-footer-group; }
.druck-karte > tfoot > tr > td { padding: 0 16mm 14mm; }

/* Laufkopf — erscheint auf jeder Seite: Emblem, Schriftzug und Bereich
   gestapelt und zentriert, abgeschlossen von einer feinen Linie zum Inhalt.
   Die Maße sind bewusst knapp: was sich auf jeder Seite wiederholt, geht dem
   Inhalt jedes Mal aufs Neue verloren. */
.druck-kopf {
  text-align: center;
  padding-bottom: 0.6rem;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid #e6dac8;
}
/* Das Emblem bringt seinen cremefarbenen Grund im Bild mit — der runde
   Beschnitt lässt ihn auf weißem Papier nicht als Kasten auffallen. */
.druck-emblem {
  width: 16mm;
  height: 16mm;
  border-radius: 9999px;
  object-fit: cover;
  display: inline-block;
}
.druck-marke {
  font-family: var(--font-script);
  font-size: 2.3rem;
  line-height: 1;
  color: #2f4a3c;
  margin-top: 0.15rem;
}
.druck-titel {
  font-family: var(--font-display);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1f3328;
  margin-top: 0.2rem;
}

/* Zweispaltig über CSS-Spalten: Kategorien fließen weiter, brechen aber nie
   mitten in einem Gericht um. */
.druck-spalten-2 { column-count: 2; column-gap: 12mm; }

/* 'avoid' (nicht 'avoid-column') gilt für Seiten- UND Spaltenumbruch: kurze
   Kategorien wandern dadurch komplett auf die nächste Seite, statt am Fuß
   angerissen zu werden. Passt eine Kategorie nicht auf eine ganze Seite, bricht
   der Browser sie trotzdem — dann greift die thead-Wiederholung. */
.druck-block {
  break-inside: avoid;
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}
/* Der Grund für die Tabelle: einen Tabellenkopf wiederholt der Browser beim
   Seitenumbruch von selbst — die Kategorie steht auf der Folgeseite erneut da. */
.druck-block thead { display: table-header-group; }
.druck-block tbody { break-inside: auto; }

.druck-kategorie {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 400;
  text-align: left;
  color: #1f3328;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid #e6dac8;
  padding-bottom: 0.3rem;
  padding-top: 0.15rem;
  break-after: avoid;
}

.druck-zeile { break-inside: avoid; }
.druck-zeile > td { padding-top: 0.5rem; vertical-align: top; }
.druck-zeile-kopf { display: flex; align-items: baseline; gap: 0.35rem; }
.druck-name { font-weight: 600; font-size: 0.95rem; }
.druck-kuerzel { font-size: 0.62rem; font-weight: 400; color: #2b262099; margin-left: 0.15rem; }
/* Klassische Führungspunkte zwischen Name und Preis. */
.druck-linie {
  flex: 1 1 auto;
  border-bottom: 1px dotted #b9ab94;
  transform: translateY(-0.2rem);
  min-width: 1rem;
}
.druck-preis { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.druck-beschreibung {
  font-size: 0.8rem;
  line-height: 1.35;
  color: #2b2620b3;
  margin-top: 0.1rem;
  padding-right: 3rem;
}
/* Die Legende soll nicht direkt an der letzten Kategorie kleben. */
.druck-spalten { margin-bottom: 0.5rem; }

/* Gemeinsamer Satzspiegel (siehe --satzbreite an der Karte). */
.druck-kopf,
.druck-spalten,
.druck-legende,
.druck-fuss {
  max-width: var(--satzbreite, 100%);
  margin-inline: auto;
}

.druck-leer { font-size: 0.9rem; color: #2b262099; font-style: italic; }

.druck-legende {
  padding-top: 0.6rem;
  border-top: 1px solid #e6dac8;
  font-size: 0.68rem;
  line-height: 1.45;
  color: #2b2620b3;
}
.druck-legende-titel { font-weight: 700; color: #1f3328; margin-bottom: 0.15rem; }
.druck-legende-hinweis { margin-top: 0.4rem; font-style: italic; }

/* Abschlussblock am Ende der letzten Seite. Bewusst als abgesetzte Fläche und
   nicht als weitere Kleinzeile: hier ist Platz, und die Karte soll mit Kontakt
   und Kanälen enden statt mit Leerraum. Enthält ausschließlich gepflegte Daten
   (keine festen Texte) — damit bleibt der Block auch auf der englischen und
   niederländischen Karte richtig. */
.druck-fuss {
  margin-top: 1.6rem;
  padding: 1rem 1.25rem 1.1rem;
  border: 1px solid #e6dac8;
  border-radius: 0.75rem;
  background: #faf6ef;
  text-align: center;
  font-size: 0.78rem;
  line-height: 1.55;
  color: #2b2620cc;
  break-inside: avoid;
}
.druck-fuss-web {
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: 0.06em;
  color: #2f4a3c;
  margin-bottom: 0.35rem;
}
.druck-fuss-zeile { margin-top: 0.1rem; }
/* Kanäle vom Kontakt abgesetzt — zwei Informationsarten, eine Fläche. */
.druck-fuss-social {
  margin-top: 0.6rem;
  padding-top: 0.55rem;
  border-top: 1px solid #e6dac8;
  color: #2b262099;
}

@media print {
  @page { size: A4; margin: 14mm 12mm; }

  .druck-buehne { display: block; gap: 0; }
  .druck-karte {
    max-width: none;
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  /* Im Druck übernimmt der @page-Rand — die Bildschirm-Innenabstände entfallen. */
  .druck-karte > thead > tr > th { padding: 0; }
  .druck-karte > tbody > tr > td { padding: 0; }
  .druck-karte > tfoot > tr > td { padding: 0; }
  /* Der Laufkopf wiederholt sich — im Druck darf er knapper ausfallen. */
  .druck-kopf { margin-bottom: 0.8rem; }
  /* Jeder Bereich (Restaurant / Imbiss) startet auf einer eigenen Seite. */
  .druck-karte + .druck-karte { break-before: page; }

  /* Der Tabellenfuß wiederholt sich beim Seitenumbruch von selbst — im Druck
     darf er darum knapper ausfallen als am Bildschirm. */
  .druck-legende { font-size: 0.6rem; line-height: 1.35; }

  /* Farben der Überschriften auch im Druck erhalten. */
  .druck-legende-titel { display: inline; margin-right: 0.5em; }

  .druck-marke, .druck-titel, .druck-kategorie, .druck-legende-titel,
  .druck-fuss, .druck-fuss-web, .druck-emblem {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
`;
