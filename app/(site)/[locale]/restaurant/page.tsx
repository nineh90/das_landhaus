import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkButton from "@/components/ui/Button";
import SpeisekartenAkkordeon from "@/components/restaurant/SpeisekartenAkkordeon";
import KontaktCTA from "@/components/ui/KontaktCTA";
import Oeffnungszeiten from "@/components/ui/Oeffnungszeiten";
import Reveal from "@/components/ui/Reveal";
import { getGerichteNachKategorie } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Restaurant",
  description:
    "Saisonale, gehobene Küche in gemütlicher Landhaus-Atmosphäre — die Speisekarte unseres Restaurants in Tecklenburg-Leeden.",
};

export default async function RestaurantSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [karte, dict] = await Promise.all([
    getGerichteNachKategorie("restaurant"),
    getDictionary(locale),
  ]);
  const t = dict.restaurant;

  return (
    <>
      <PageHero titel={t.hero.titel} text={t.hero.text} bild="/images/galerie/restaurant-speisesaal.jpeg">
        <LinkButton href="#reservieren" variante="primary">
          {t.hero.ctaReservieren}
        </LinkButton>
        <LinkButton href="#speisekarte" variante="ghost">
          {t.hero.ctaSpeisekarte}
        </LinkButton>
      </PageHero>

      {/* Willkommen / Atmosphäre: Stimmungstext neben einem Foto */}
      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-akzent">
              {t.willkommen.kicker}
            </p>
            <h2 className="mt-2 font-display text-3xl text-wald-dark sm:text-4xl">
              {t.willkommen.titel}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-tinte/80">{t.willkommen.text}</p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/galerie/restaurant-theke.jpeg"
              alt={t.willkommen.bildAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Vertrauens-Bausteine */}
      <Section className="bg-creme-dark/40">
        <SectionHeading kicker={t.highlights.kicker} titel={t.highlights.titel} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {t.highlights.items.map((h, i) => (
            <Reveal key={h.titel} delay={i * 120} className="flex">
              <div className="flex w-full flex-col rounded-2xl bg-creme p-6 shadow-sm ring-1 ring-creme-dark">
                <h3 className="font-display text-xl text-wald-dark">{h.titel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinte/75">{h.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="speisekarte" className="scroll-mt-24">
        <SectionHeading kicker={t.speisekarte.kicker} titel={t.speisekarte.titel} />
        <div className="mx-auto mt-10 max-w-3xl">
          <SpeisekartenAkkordeon karte={karte} />
        </div>
      </Section>

      {/* Praktische Info: Öffnungszeiten (nur Restaurant) */}
      <Section className="bg-creme-dark/40">
        <SectionHeading kicker={t.oeffnung.kicker} titel={t.oeffnung.titel} />
        <div className="mt-10">
          <Oeffnungszeiten locale={locale} nur={["restaurant"]} />
        </div>
      </Section>

      <Section id="reservieren" className="scroll-mt-24">
        <KontaktCTA locale={locale} />
      </Section>

      <Section id="geschlossene-gesellschaft" className="scroll-mt-24 bg-creme-dark/40">
        <SectionHeading kicker={t.gesellschaft.kicker} titel={t.gesellschaft.titel} text={t.gesellschaft.text} />
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {t.gesellschaft.anlaesse.map((anlass) => (
            <span
              key={anlass}
              className="rounded-full bg-creme px-4 py-2 text-sm font-medium text-wald-dark ring-1 ring-creme-dark"
            >
              {anlass}
            </span>
          ))}
        </div>
        <div className="mt-12">
          <KontaktCTA locale={locale} titel={t.gesellschaft.ctaTitel} text={t.gesellschaft.ctaText} />
        </div>
      </Section>
    </>
  );
}
