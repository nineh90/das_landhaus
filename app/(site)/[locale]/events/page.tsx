import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import EventGrid from "@/components/events/EventGrid";
import { getEvents, getKommendeEvents } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Veranstaltungen & Events",
  description:
    "Live-Musik, Themenabende und Feiern in der Event-Diele »Der Kotten« im Landhaus Tecklenburg-Leeden — alle kommenden Termine im Überblick.",
};

export default async function EventsSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [kommende, alle, dict] = await Promise.all([
    getKommendeEvents(99),
    getEvents(),
    getDictionary(locale),
  ]);
  const vergangene = alle.filter((e) => !kommende.some((k) => k.id === e.id)).reverse();
  const t = dict.eventsSeite;

  return (
    <>
      <PageHero titel={t.hero.titel} text={t.hero.text} />

      <Section>
        <h2 className="mb-8 font-display text-2xl text-wald-dark">{t.kommende}</h2>
        <EventGrid events={kommende} locale={locale} />
      </Section>

      {vergangene.length > 0 && (
        <Section className="bg-creme-dark/40">
          <h2 className="mb-8 font-display text-2xl text-wald-dark">{t.vergangene}</h2>
          <EventGrid events={vergangene} locale={locale} leerText="" />
        </Section>
      )}
    </>
  );
}
