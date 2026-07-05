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

export const metadata: Metadata = {
  title: "Der Kotten — Event-Diele",
  description:
    "DJ-Nächte, Karaoke und Mottoabende im Kotten, der Event-Diele des Landhaus Tecklenburg-Leeden. An Schließtagen auch privat buchbar für Geburtstage, Firmenfeiern und Co.",
};

/** Wiederkehrende öffentliche Formate im Kotten. */
const formate = [
  {
    titel: "DJ-Nächte",
    text: "Wenn die Anlage aufdreht, wird die Diele zur Tanzfläche — von Charts bis Party-Klassiker.",
  },
  {
    titel: "Karaoke",
    text: "Mikro schnappen, mutig sein: Karaoke-Abende, bei denen jeder zum Star wird.",
  },
  {
    titel: "Mottoabende",
    text: "Von Schlager bis Oktoberfest — themenstarke Abende mit passender Musik und Deko.",
  },
];

export default async function KottenSeite() {
  const [events, bilder] = await Promise.all([
    getKommendeEvents(6),
    getBilder("kotten"),
  ]);

  return (
    <>
      <PageHero
        titel="Der Kotten"
        text="Unsere Event-Diele mit Bühne im Außenbereich: DJ-Nächte, Karaoke, Live-Musik und Mottoabende — und an ruhigen Tagen der perfekte Ort für deine eigene Feier."
        bild="/images/galerie/kotten-aussen.jpeg"
      >
        <LinkButton href="#mieten" variante="primary">
          Kotten reservieren
        </LinkButton>
        <LinkButton href="/events" variante="ghost">
          Kommende Events
        </LinkButton>
      </PageHero>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="text-lg leading-relaxed text-tinte/80">
            <p>
              Der Kotten ist das gesellige Herz des Landhauses — unsere Event-Diele mitten in der
              Natur. Hier legen DJs auf, wird bei Karaoke mitgesungen und zu Mottoabenden gefeiert.
              Gäste aus der ganzen Region kommen zusammen, um zu tanzen, zu lachen und einen
              unvergesslichen Abend zu erleben.
            </p>
            <p className="mt-4">
              Bei gutem Wetter zieht die Musik nach draußen: Auf unserer Bühne im Außenbereich
              wird gespielt und gefeiert — Live-Musik unter freiem Himmel, mitten in der Natur.
            </p>
            <p className="mt-4">
              Und wenn kein öffentliches Event ansteht, kannst du den Kotten für deine eigene Feier
              mieten — von der Geburtstagsparty bis zur Firmenfeier.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/galerie/kotten-aussen.jpeg"
              alt="Der Kotten von außen — die Event-Diele des Landhauses"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-creme-dark/40">
        <SectionHeading
          kicker="Was los ist"
          titel="Abende im Kotten"
          text="Regelmäßig, laut und gesellig — und an ruhigen Tagen ganz für deine eigene Feier."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {formate.map((f, i) => (
            <Reveal key={f.titel} delay={i * 120} className="flex">
              <div className="flex w-full flex-col rounded-2xl bg-creme p-6 shadow-sm ring-1 ring-creme-dark">
                <h3 className="font-display text-xl text-wald-dark">{f.titel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tinte/75">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Hervorgehobene vierte Karte: Kotten privat mieten */}
        <Reveal delay={formate.length * 120} className="mx-auto mt-6 block max-w-4xl">
          <div className="flex flex-col gap-5 rounded-2xl bg-akzent p-6 text-creme shadow-md ring-1 ring-akzent-dark/40 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-creme/85">
                Privat feiern
              </p>
              <h3 className="mt-2 font-display text-2xl text-creme">Den Kotten mieten</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-creme/90">
                An geschlossenen Tagen gehört der Kotten ganz dir — ob Geburtstag, Firmen- oder
                Familienfeier. Platz für bis zu{" "}
                {/* TODO: tatsächliche Personenzahl eintragen */}
                <span className="font-semibold">XX Personen</span>.
              </p>
            </div>
            <Link
              href="#mieten"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-creme px-6 py-3 text-base font-semibold text-wald-dark shadow-sm transition-colors hover:bg-creme-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-creme focus-visible:ring-offset-2 focus-visible:ring-offset-akzent"
            >
              Feier anfragen
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Reveal>
      </Section>

      <Section>
        <SectionHeading kicker="Termine" titel="Nächste Veranstaltungen" />
        <div className="mt-12">
          <EventGrid events={events} />
        </div>
        <div className="mt-10 text-center">
          <LinkButton href="/events" variante="secondary">
            Alle Veranstaltungen
          </LinkButton>
        </div>
      </Section>

      <Section id="mieten" className="scroll-mt-24 bg-creme-dark/40">
        <SectionHeading
          kicker="Privat feiern"
          titel="Den Kotten mieten"
          text="An geschlossenen Tagen wird der Kotten ganz zu deinem Raum. Ob runder Geburtstag, Firmenfeier, Vereins- oder Familienfest — wir schaffen den passenden Rahmen für geschlossene Gesellschaften."
        />
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {["Geburtstage", "Firmenfeiern", "Vereinsfeiern", "Familienfeste", "Jubiläen"].map(
            (anlass) => (
              <span
                key={anlass}
                className="rounded-full bg-creme px-4 py-2 text-sm font-medium text-wald-dark ring-1 ring-creme-dark"
              >
                {anlass}
              </span>
            ),
          )}
        </div>
        <div className="mt-12">
          <KontaktCTA
            titel="Feier anfragen"
            text="Erzähl uns von deinem Anlass — wir melden uns mit Verfügbarkeit und Möglichkeiten. Am schnellsten telefonisch oder per WhatsApp."
          />
        </div>
      </Section>

      {bilder.length > 0 && (
        <Section>
          <SectionHeading kicker="Impressionen" titel="Stimmung im Kotten" />
          <div className="mt-12">
            <Lightbox gruppen={[{ label: "", bilder }]} />
          </div>
        </Section>
      )}
    </>
  );
}
