import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import EventGrid from "@/components/events/EventGrid";
import { getEvents, getKommendeEvents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Veranstaltungen & Events",
  description:
    "Live-Musik, Themenabende und Feiern in der Event-Diele »Der Kotten« im Landhaus Tecklenburg-Leeden — alle kommenden Termine im Überblick.",
};

export default async function EventsSeite() {
  const [kommende, alle] = await Promise.all([getKommendeEvents(99), getEvents()]);
  const vergangene = alle.filter((e) => !kommende.some((k) => k.id === e.id)).reverse();

  return (
    <>
      <PageHero
        titel="Veranstaltungen"
        text="Live-Musik, Schlagernächte, Themenabende und mehr — hier findest du alle Termine im Landhaus."
      />

      <Section>
        <h2 className="mb-8 font-display text-2xl text-wald-dark">Kommende Termine</h2>
        <EventGrid events={kommende} />
      </Section>

      {vergangene.length > 0 && (
        <Section className="bg-creme-dark/40">
          <h2 className="mb-8 font-display text-2xl text-wald-dark">Bereits gewesen</h2>
          <EventGrid events={vergangene} leerText="" />
        </Section>
      )}
    </>
  );
}
