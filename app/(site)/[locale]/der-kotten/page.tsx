import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import EventGrid from "@/components/events/EventGrid";
import Lightbox from "@/components/galerie/Lightbox";
import LinkButton from "@/components/ui/Button";
import KontaktCTA from "@/components/ui/KontaktCTA";
import Reveal from "@/components/ui/Reveal";
import { getKommendeEvents, getBilder } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Der Kotten — Event-Diele",
  description:
    "DJ-Nächte, Karaoke und Mottoabende im Kotten, der Event-Diele des Landhaus Tecklenburg-Leeden. An Schließtagen auch privat buchbar für Geburtstage, Firmenfeiern und Co.",
};

export default async function KottenSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [events, bilder, dict] = await Promise.all([
    getKommendeEvents(6),
    getBilder("kotten"),
    getDictionary(locale),
  ]);
  const t = dict.derKotten;

  return (
    <>
      <PageHero titel={t.hero.titel} text={t.hero.text} bild="/images/galerie/kotten-aussen.jpeg">
        <LinkButton href="#mieten" variante="primary">
          {t.hero.ctaMieten}
        </LinkButton>
        <LinkButton href={localizedHref(locale, "/events")} variante="ghost">
          {t.hero.ctaEvents}
        </LinkButton>
      </PageHero>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="text-lg leading-relaxed text-tinte/80">
            <p>{t.intro.p1}</p>
            <p className="mt-4">{t.intro.p2}</p>
            <p className="mt-4">{t.intro.p3}</p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/galerie/kotten-aussen.jpeg"
              alt={t.intro.bildAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-creme-dark/40">
        <SectionHeading kicker={t.formate.kicker} titel={t.formate.titel} text={t.formate.text} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {t.formate.items.map((f, i) => (
            <Reveal key={f.titel} delay={i * 120} className="flex">
              <div className="flex w-full flex-col rounded-2xl bg-creme p-6 shadow-sm ring-1 ring-creme-dark">
                <h3 className="font-display text-xl text-wald-dark">{f.titel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinte/75">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Hervorgehobene vierte Karte: Kotten privat mieten */}
        <Reveal delay={t.formate.items.length * 120} className="mx-auto mt-6 block max-w-4xl">
          <div className="flex flex-col gap-5 rounded-2xl bg-akzent p-6 text-creme shadow-md ring-1 ring-akzent-dark/40 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-creme/85">
                {t.mietenKarte.eyebrow}
              </p>
              <h3 className="mt-2 font-display text-2xl text-creme">{t.mietenKarte.titel}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-creme/90">
                {t.mietenKarte.textVorPersonen}
                {/* TODO: tatsächliche Personenzahl eintragen */}
                <span className="font-semibold">{t.mietenKarte.personen}</span>.
              </p>
            </div>
            <Link
              href="#mieten"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-creme px-6 py-3 text-base font-semibold text-wald-dark shadow-sm transition-colors hover:bg-creme-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-creme focus-visible:ring-offset-2 focus-visible:ring-offset-akzent"
            >
              {t.mietenKarte.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading kicker={t.termine.kicker} titel={t.termine.titel} />
        <div className="mt-12">
          <EventGrid events={events} locale={locale} />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href={localizedHref(locale, "/events")} variante="secondary">
            {dict.common.alleVeranstaltungen}
          </LinkButton>
        </div>
      </Section>

      <Section id="mieten" className="scroll-mt-24 bg-creme-dark/40">
        <SectionHeading kicker={t.mieten.kicker} titel={t.mieten.titel} text={t.mieten.text} />
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {t.mieten.anlaesse.map((anlass) => (
            <span
              key={anlass}
              className="rounded-full bg-creme px-4 py-2 text-sm font-medium text-wald-dark ring-1 ring-creme-dark"
            >
              {anlass}
            </span>
          ))}
        </div>
        <div className="mt-12">
          <KontaktCTA locale={locale} titel={t.mieten.ctaTitel} text={t.mieten.ctaText} />
        </div>
      </Section>

      {bilder.length > 0 && (
        <Section>
          <SectionHeading kicker={t.impressionen.kicker} titel={t.impressionen.titel} />
          <div className="mt-12">
            <Lightbox gruppen={[{ label: "", bilder }]} labels={dict.lightbox} />
          </div>
        </Section>
      )}
    </>
  );
}
