import Hero from "@/components/home/Hero";
import BereicheTeaser from "@/components/home/BereicheTeaser";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Oeffnungszeiten from "@/components/ui/Oeffnungszeiten";
import MapsEmbed from "@/components/ui/MapsEmbed";
import KontaktCTA from "@/components/ui/KontaktCTA";
import EventGrid from "@/components/events/EventGrid";
import LinkButton from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/ui/JsonLd";
import { getKommendeEvents } from "@/lib/content";
import { buildLocalBusinessJsonLd } from "@/lib/jsonld";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";

export default async function StartSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [events, dict, localBusiness] = await Promise.all([
    getKommendeEvents(3),
    getDictionary(locale),
    buildLocalBusinessJsonLd(),
  ]);
  const t = dict.home;

  return (
    <>
      <JsonLd data={localBusiness} />
      <Hero locale={locale} dict={dict} />

      {/* Die drei Bereiche */}
      <Section id="entdecken">
        <SectionHeading kicker={t.entdecken.kicker} titel={t.entdecken.titel} text={t.entdecken.text} />
        <div className="mt-12">
          <BereicheTeaser locale={locale} dict={dict} />
        </div>
      </Section>

      {/* Kommende Events */}
      <Section className="bg-creme-dark/40">
        <SectionHeading kicker={t.demnaechst.kicker} titel={t.demnaechst.titel} />
        <div className="mt-12">
          <EventGrid events={events} locale={locale} />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href={localizedHref(locale, "/events")} variante="secondary">
            {dict.common.alleVeranstaltungen}
          </LinkButton>
        </div>
      </Section>

      {/* Öffnungszeiten */}
      <Section>
        <SectionHeading kicker={t.oeffnungszeiten.kicker} titel={t.oeffnungszeiten.titel} />
        <Reveal className="mt-12">
          <Oeffnungszeiten locale={locale} />
        </Reveal>
      </Section>

      {/* Anfahrt / Karte */}
      <Section className="bg-wald" containerClassName="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            kicker={t.anfahrt.kicker}
            titel={t.anfahrt.titel}
            text={t.anfahrt.text}
            zentriert={false}
            hell
          />
          <div className="mt-8">
            <KontaktCTA locale={locale} hell />
          </div>
        </div>
        <Reveal delay={120}>
          <MapsEmbed locale={locale} className="h-80 lg:h-96" />
        </Reveal>
      </Section>
    </>
  );
}
