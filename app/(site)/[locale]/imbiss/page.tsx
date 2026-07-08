import type { Metadata } from "next";
import type { Bild } from "@/types";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SpeisekartenAkkordeon from "@/components/restaurant/SpeisekartenAkkordeon";
import Lightbox from "@/components/galerie/Lightbox";
import Oeffnungszeiten from "@/components/ui/Oeffnungszeiten";
import { getGerichteNachKategorie, getEinstellung, getBilder } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Imbiss",
  description:
    "Schnell, frisch und unkompliziert: Pommes, Currywurst, Burger & Co. an unserem Imbiss in Tecklenburg-Leeden.",
};

export default async function ImbissSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [karte, oeffnung, imbissBilder, dict] = await Promise.all([
    getGerichteNachKategorie("imbiss"),
    getEinstellung("oeffnungszeiten_imbiss"),
    getBilder("imbiss"),
    getDictionary(locale),
  ]);
  const t = dict.imbiss;

  // Platzhalter, bis eigene Imbiss-Fotos vorliegen. Sobald echte Fotos in
  // lib/data/bilder.ts (bereich "imbiss") eingetragen sind, greift automatisch
  // jene Galerie und dieser Fallback entfällt.
  const platzhalter: Bild[] = [
    {
      id: "imbiss-platzhalter",
      url: "/images/galerie/imbiss-theke.jpg",
      alt: t.platzhalterAlt,
      beschreibung: null,
      bereich: "imbiss",
    },
  ];
  const impressionen = imbissBilder.length > 0 ? imbissBilder : platzhalter;

  return (
    <>
      <PageHero titel={t.hero.titel} text={t.hero.text} bild="/images/galerie/imbiss-theke.jpg" />

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-tinte/80">{t.intro}</p>
          {oeffnung && (
            <p className="mt-4 rounded-xl bg-creme-dark/60 p-4 text-sm text-tinte/75">
              <span className="font-semibold text-wald-dark">{t.oeffnungLabel}</span> {oeffnung}
            </p>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <SpeisekartenAkkordeon karte={karte} name="imbiss-karte" />
        </div>
      </Section>

      <Section className="bg-creme-dark/40">
        <Oeffnungszeiten locale={locale} />
      </Section>

      <Section>
        <SectionHeading kicker={t.impressionen.kicker} titel={t.impressionen.titel} />
        <div className="mt-12">
          <Lightbox
            gruppen={[{ label: "", bilder: impressionen }]}
            labels={dict.lightbox}
          />
        </div>
      </Section>
    </>
  );
}
