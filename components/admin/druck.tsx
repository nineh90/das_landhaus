import Image from "next/image";
import type { Kontakt } from "@/lib/content";
import { activeSocialChannels, socialHandle } from "@/lib/social";
import { SITE_URL } from "@/lib/site";

/**
 * Gemeinsamer Rahmen aller Druck-Erzeugnisse (Speisekarte, Flyer).
 *
 * Kopf und Abschlussblock sind bewusst NICHT einstellbar: Alles, was das Haus
 * gedruckt verlässt, soll denselben Kopf (Emblem, Schriftzug) und denselben
 * Abbinder (Domain, Kontakt, Kanäle) tragen. Ein Beiblatt zur Karte darf nicht
 * wie von einem anderen Betrieb aussehen.
 *
 * Darum liegen Bausteine UND Basis-CSS hier an einer Stelle: eine Änderung am
 * Kopf wirkt automatisch auf Karte und Flyer. Die jeweilige Seite ergänzt nur
 * ihr eigenes Innenleben (Kategorien bzw. Aktionsblöcke).
 */

/**
 * Laufkopf: Emblem, Schriftzug, Zeile darunter.
 *
 * In der Speisekarte steckt er im `<thead>` der Rahmentabelle und wiederholt
 * sich dadurch auf jeder Seite — deshalb ist er knapp gehalten: was sich
 * wiederholt, geht dem Inhalt jedes Mal aufs Neue verloren.
 */
export function DruckKopf({
  titel,
  unterzeile,
}: {
  titel: string;
  unterzeile?: string | null;
}) {
  return (
    <div className="druck-kopf">
      {/* Bewusst das runde Emblem statt des Voll-Logos: dieses trägt den
          Schriftzug „Restaurant" fest im Bild und wäre auf der Imbiss-Karte oder
          einem Kotten-Flyer schlicht falsch. Das Emblem passt zu jedem Anlass. */}
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
      {unterzeile && <p className="druck-unterzeile">{unterzeile}</p>}
    </div>
  );
}

/**
 * Kontakt- und Social-Zeile am Fuß.
 *
 * Auf Papier führt kein Klick weiter — darum stehen hier Domain und Handles im
 * Klartext, nicht die verlinkten URLs. Gezeigt wird nur, was auch wirklich
 * gepflegt ist (Kontaktdaten aus den Einstellungen, Kanäle aus lib/social.ts);
 * fehlt etwas, fällt die Angabe ersatzlos weg.
 */
export function DruckFuss({ kontakt }: { kontakt: Kontakt }) {
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
 * Telefon und WhatsApp für den Druck aufbereiten.
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
 * Basis-CSS für jede Druckseite: Bühne, Papierfläche, Kopf, Abschlussblock und
 * die `@page`-Regel.
 *
 * Bewusst als String, den die jeweilige Seite in ein lokales `<style>` schreibt
 * (nicht in globals.css): `@page` gilt dann nur dort und kann nirgends sonst
 * hineinwirken. Die Seite hängt ihr eigenes CSS einfach hinten an.
 *
 * `--satzbreite` steuert die gemeinsame Satzbreite von Kopf, Inhalt und Abbinder
 * — je Seite gesetzt (die zweispaltige Karte nutzt die volle Breite, ein
 * einspaltiges Blatt einen schmaleren Satzspiegel).
 */
export const druckRahmenCss = `
.druck-buehne { display: flex; flex-direction: column; gap: 2rem; }

/* Das Papier: am Bildschirm ein weißes Blatt auf der Creme-Fläche, im Druck die
   Seite selbst (siehe @media print unten). */
.druck-flaeche {
  background: #fff;
  color: #2b2620;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
  max-width: 210mm;
  margin-inline: auto;
  width: 100%;
}

/* Laufkopf — Emblem, Schriftzug und Anlass gestapelt und zentriert,
   abgeschlossen von einer feinen Linie zum Inhalt. */
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
.druck-unterzeile {
  font-size: 0.8rem;
  font-style: italic;
  color: #2b2620b3;
  margin-top: 0.3rem;
}

/* Abschlussblock am Ende der letzten Seite. Bewusst als abgesetzte Fläche und
   nicht als weitere Kleinzeile: hier ist Platz, und ein Druckstück soll mit
   Kontakt und Kanälen enden statt mit Leerraum. Enthält ausschließlich gepflegte
   Daten (keine festen Texte) — damit bleibt der Block auch auf der englischen
   und niederländischen Karte richtig. */
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

/* Gemeinsamer Satzspiegel für Kopf und Abbinder (die Seite setzt --satzbreite
   und nimmt ihre Inhalts-Container in dieselbe Regel auf). */
.druck-kopf,
.druck-fuss {
  max-width: var(--satzbreite, 100%);
  margin-inline: auto;
}

@media print {
  @page { size: A4; margin: 14mm 12mm; }

  /* Kein creme Seitenhintergrund im Druck.
     Der Adminbereich setzt die creme Grundfarbe auf body (globals.css), und
     Chrome druckt sie mit, sobald "Hintergrundgrafiken" aktiviert sind — genau
     das empfiehlt der Hinweis über der Druckansicht, damit Logo und
     Überschriften ihre Farbe behalten. Auf der letzten Seite endet das weiße
     Blatt mit dem Inhalt; darunter erschien dadurch eine leere creme Fläche bis
     zum Seitenrand, die wie ein vergessener Kasten unter dem Kontaktblock
     aussah. Mit "important", weil die Regel aus globals.css dieselbe
     Spezifität hat — und sie gilt nur hier, im Druck dieser Seite. */
  html, body { background: #fff !important; }

  .druck-buehne { display: block; gap: 0; }
  /* Im Druck übernimmt der @page-Rand — Blattoptik und Innenabstände entfallen. */
  .druck-flaeche {
    max-width: none;
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  }
  /* Der Laufkopf kann sich wiederholen — im Druck darf er knapper ausfallen. */
  .druck-kopf { margin-bottom: 0.8rem; }

  /* Farben von Kopf und Abbinder auch im Druck erhalten. */
  .druck-marke, .druck-titel, .druck-fuss, .druck-fuss-web, .druck-emblem {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
`;
