import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Impressum & Datenschutz",
  description: "Impressum und Datenschutzerklärung des Landhaus Tecklenburg-Leeden.",
  robots: { index: false },
};

/**
 * Impressum + Datenschutz.
 * ACHTUNG: Platzhaltertext für die Demo. Vor dem Launch durch die echten,
 * rechtlich geprüften Angaben des Betreibers ersetzen (verantwortliche Person,
 * Anschrift, USt-IdNr., Aufsichtsbehörde etc.).
 */
export default function ImpressumSeite() {
  return (
    <>
      <PageHero titel="Impressum & Datenschutz" />

      <Section>
        <div className="prose mx-auto max-w-3xl text-tinte/85">
          <div className="mb-8 rounded-xl border border-akzent/40 bg-akzent/10 p-4 text-sm text-tinte/80">
            <strong>Hinweis (Demo):</strong> Dieser Text ist ein Platzhalter und ersetzt keine
            Rechtsberatung. Vor dem Launch werden hier die echten, geprüften Pflichtangaben des
            Betreibers eingesetzt.
          </div>

          <h2 className="font-display text-2xl text-wald-dark">Impressum</h2>
          <p className="mt-3 leading-relaxed">
            Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz):
            <br />
            <br />
            Das Landhaus Tecklenburg-Leeden
            <br />
            [Inhaber: Vor- und Nachname]
            <br />
            Grafenstraße 31
            <br />
            49545 Tecklenburg-Leeden
          </p>
          <p className="mt-4 leading-relaxed">
            <strong>Kontakt:</strong>
            <br />
            Telefon: [Telefonnummer]
            <br />
            E-Mail: [E-Mail-Adresse]
          </p>
          <p className="mt-4 leading-relaxed">
            <strong>Umsatzsteuer-ID:</strong> [falls vorhanden]
            <br />
            <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong> [Name]
          </p>

          <h2 className="mt-10 font-display text-2xl text-wald-dark">Datenschutzerklärung</h2>
          <p className="mt-3 leading-relaxed">
            Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Website verarbeitet
            personenbezogene Daten nur im technisch notwendigen Rahmen.
          </p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">Hosting</h3>
          <p className="mt-2 leading-relaxed">
            Diese Website wird bei einem externen Dienstleister gehostet. Beim Aufruf werden
            technisch notwendige Server-Logdaten (z. B. IP-Adresse, Zeitpunkt, abgerufene Seite)
            verarbeitet. [Anbieter konkret benennen, z. B. Vercel Inc.]
          </p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">Schriftarten</h3>
          <p className="mt-2 leading-relaxed">
            Die verwendeten Schriftarten werden lokal vom eigenen Server ausgeliefert
            (Self-Hosting via <code>next/font</code>). Es besteht dabei keine Verbindung zu
            Servern Dritter (z. B. Google Fonts).
          </p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">Google Maps</h3>
          <p className="mt-2 leading-relaxed">
            Zur Darstellung des Anfahrtswegs binden wir Kartenmaterial von Google Maps ein. Dabei
            kann eine Verbindung zu Servern von Google aufgebaut und deine IP-Adresse übertragen
            werden. <strong>Hinweis für die Produktion:</strong> Vor dem Launch wird die Karte mit
            einer Einwilligungs-/Klicklösung (Consent) versehen, sodass die Verbindung erst nach
            ausdrücklicher Zustimmung erfolgt.
          </p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">Deine Rechte</h3>
          <p className="mt-2 leading-relaxed">
            Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
            Verarbeitung deiner personenbezogenen Daten sowie ein Beschwerderecht bei der
            zuständigen Aufsichtsbehörde. Wende dich dazu an die oben genannten Kontaktdaten.
          </p>
        </div>
      </Section>
    </>
  );
}
