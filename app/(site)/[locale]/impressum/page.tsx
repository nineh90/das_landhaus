import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getKontakt } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Impressum & Datenschutz",
  description: "Impressum und Datenschutzerklärung des Landhaus Tecklenburg-Leeden.",
  robots: { index: false },
};

/**
 * Impressum + Datenschutz.
 *
 * Kontaktdaten kommen aus den Einstellungen (DB) — dieselbe Quelle wie Footer und
 * Anfahrt, damit hier nie eine andere Nummer steht als auf dem Rest der Seite.
 * Fehlende Werte werden ausgeblendet statt als Platzhalter gezeigt.
 *
 * OFFEN (von Ali): Rechtsform + ggf. Handelsregister, USt-IdNr. nach § 27a UStG,
 * zuständige Erlaubnisbehörde nach § 2 GastG. Siehe `hinweisText` im Wörterbuch.
 * EN/NL fallen bewusst auf Deutsch zurück — Rechtstexte werden nicht spekulativ übersetzt.
 */
export default async function ImpressumSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [t, { telefon, email }] = await Promise.all([
    getDictionary(locale).then((d) => d.impressum),
    getKontakt(),
  ]);

  return (
    <>
      <PageHero titel={t.hero} />

      <Section>
        <div className="prose mx-auto max-w-3xl text-tinte/85">
          <div className="mb-8 rounded-xl border border-akzent/40 bg-akzent/10 p-4 text-sm text-tinte/80">
            <strong>{t.hinweisLabel}</strong> {t.hinweisText}
          </div>

          <h2 className="font-display text-2xl text-wald-dark">{t.impressumTitel}</h2>
          <p className="mt-3 leading-relaxed">
            {t.angabenGemaess}
            <br />
            <br />
            Das Landhaus Tecklenburg-Leeden
            <br />
            {t.inhaberPlatzhalter}
            <br />
            Grafenstraße 31
            <br />
            49545 Tecklenburg-Leeden
          </p>
          <p className="mt-4 leading-relaxed">
            <strong>{t.kontaktLabel}</strong>
            {telefon && (
              <>
                <br />
                {t.telefonLabel}{" "}
                <a href={`tel:${telefon.replace(/\s/g, "")}`} className="hover:text-akzent-dark">
                  {telefon}
                </a>
              </>
            )}
            {email && (
              <>
                <br />
                {t.emailLabel}{" "}
                <a href={`mailto:${email}`} className="hover:text-akzent-dark">
                  {email}
                </a>
              </>
            )}
          </p>
          <p className="mt-4 leading-relaxed">
            <strong>{t.verantwortlichLabel}</strong> {t.verantwortlichPlatzhalter}
          </p>
          <p className="mt-4 leading-relaxed">
            <strong>{t.umsetzungLabel}</strong> {t.umsetzungText}
          </p>

          <h2 className="mt-10 font-display text-2xl text-wald-dark">{t.datenschutzTitel}</h2>
          <p className="mt-3 leading-relaxed">{t.datenschutzIntro}</p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">{t.hostingTitel}</h3>
          <p className="mt-2 leading-relaxed">{t.hostingText}</p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">{t.schriftenTitel}</h3>
          <p className="mt-2 leading-relaxed">
            {t.schriftenTextVor}
            <code>next/font</code>
            {t.schriftenTextNach}
          </p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">{t.mapsTitel}</h3>
          <p className="mt-2 leading-relaxed">{t.mapsText}</p>
          <p className="mt-2 leading-relaxed">{t.mapsWiderrufText}</p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">{t.cookiesTitel}</h3>
          <p className="mt-2 leading-relaxed">{t.cookiesText}</p>

          <h3 className="mt-6 font-display text-xl text-wald-dark">{t.rechteTitel}</h3>
          <p className="mt-2 leading-relaxed">{t.rechteText}</p>
        </div>
      </Section>
    </>
  );
}
