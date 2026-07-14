import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Oeffnungszeiten from "@/components/ui/Oeffnungszeiten";
import MapsEmbed from "@/components/ui/MapsEmbed";
import KontaktCTA from "@/components/ui/KontaktCTA";
import { getKontakt } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Anfahrt & Kontakt",
  description:
    "So findest du das Landhaus Tecklenburg-Leeden — Adresse, Anfahrt, Öffnungszeiten und Kontakt. Gut erreichbar aus Osnabrück, Münster und Bielefeld.",
};

export default async function AnfahrtSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [{ telefon, whatsapp, email, adresse }, dict] = await Promise.all([getKontakt(), getDictionary(locale)]);
  const t = dict.anfahrt;

  return (
    <>
      <PageHero titel={t.hero.titel} text={t.hero.text} />

      <Section containerClassName="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-wald-dark">{t.kontaktTitel}</h2>
          <ul className="mt-4 space-y-2 text-tinte/80">
            {adresse && (
              <li>
                <span className="font-semibold text-wald-dark">{t.adresse}:</span> {adresse}
              </li>
            )}
            {telefon && (
              <li>
                <span className="font-semibold text-wald-dark">{t.telefon}:</span>{" "}
                <a href={`tel:${telefon.replace(/\s/g, "")}`} className="hover:text-akzent-dark">
                  {telefon}
                </a>
              </li>
            )}
            {whatsapp && (
              <li>
                <span className="font-semibold text-wald-dark">{t.whatsapp}:</span>{" "}
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-akzent-dark"
                >
                  {dict.kontakt.whatsapp}
                </a>
              </li>
            )}
            {email && (
              <li>
                <span className="font-semibold text-wald-dark">{t.email}:</span>{" "}
                <a href={`mailto:${email}`} className="hover:text-akzent-dark">
                  {email}
                </a>
              </li>
            )}
          </ul>

          <h2 className="mt-10 font-display text-2xl text-wald-dark">{t.anfahrtTitel}</h2>
          <p className="mt-4 leading-relaxed text-tinte/80">{t.anfahrtText}</p>
          <a
            href="https://maps.app.goo.gl/Cno5bSai4361xfQM6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-akzent-dark hover:underline"
          >
            {t.mapsLink}
          </a>
        </div>

        <MapsEmbed locale={locale} className="h-80 lg:h-full" />
      </Section>

      <Section className="bg-creme-dark/40">
        <h2 className="mb-8 text-center font-display text-2xl text-wald-dark">{t.oeffnungszeitenTitel}</h2>
        <Oeffnungszeiten locale={locale} />
      </Section>

      <Section>
        <KontaktCTA locale={locale} />
      </Section>
    </>
  );
}
