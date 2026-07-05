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
import { getKommendeEvents } from "@/lib/content";

export default async function StartSeite() {
  const events = await getKommendeEvents(3);

  return (
    <>
      <Hero />

      {/* Die drei Bereiche */}
      <Section id="entdecken">
        <SectionHeading
          kicker="Willkommen"
          titel="Drei Bereiche, das Landhaus"
          text="Ob feines Abendessen, schneller Snack oder ausgelassener Tanzabend — bei uns findet jeder seinen Platz."
        />
        <div className="mt-12">
          <BereicheTeaser />
        </div>
      </Section>

      {/* Kommende Events */}
      <Section className="bg-creme-dark/40">
        <SectionHeading kicker="Termine" titel="Demnächst bei uns" />
        <div className="mt-12">
          <EventGrid events={events} />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/events" variante="secondary">
            Alle Veranstaltungen
          </LinkButton>
        </div>
      </Section>

      {/* Öffnungszeiten */}
      <Section>
        <SectionHeading kicker="Wann wir da sind" titel="Öffnungszeiten" />
        <Reveal className="mt-12">
          <Oeffnungszeiten />
        </Reveal>
      </Section>

      {/* Anfahrt / Karte */}
      <Section className="bg-wald" containerClassName="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            kicker="So findest du uns"
            titel="Im Ferienpark Capfun Tecklenburg-Leeden"
            text="Eingebettet in die Natur, gut erreichbar aus Osnabrück, Münster und Bielefeld."
            zentriert={false}
            hell
          />
          <div className="mt-8">
            <KontaktCTA hell />
          </div>
        </div>
        <Reveal delay={120}>
          <MapsEmbed className="h-80 lg:h-96" />
        </Reveal>
      </Section>
    </>
  );
}
