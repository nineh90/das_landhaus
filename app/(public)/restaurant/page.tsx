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

export const metadata: Metadata = {
  title: "Restaurant",
  description:
    "Saisonale, gehobene Küche in gemütlicher Landhaus-Atmosphäre — die Speisekarte unseres Restaurants in Tecklenburg-Leeden.",
};

/** Kurze Vertrauens-Bausteine für den Highlights-Block. */
const highlights = [
  {
    titel: "Saisonal & regional",
    text: "Wir kochen mit dem, was die Jahreszeit hergibt — frische Produkte aus der Region, kurze Wege, ehrlicher Geschmack.",
  },
  {
    titel: "Hausgemacht",
    text: "Von der Vorspeise bis zum Dessert entsteht bei uns möglichst vieles selbst — mit Zeit und Liebe zum Detail.",
  },
  {
    titel: "Für alle offen",
    text: "Ob Gast aus dem Ferienpark oder Besuch aus der Region — bei uns bist du herzlich willkommen.",
  },
];

export default async function RestaurantSeite() {
  const karte = await getGerichteNachKategorie("restaurant");

  return (
    <>
      <PageHero
        titel="Unser Restaurant"
        text="Saisonale Küche, regionale Produkte und ein Platz zum Wohlfühlen — bei uns wird Essen zum Erlebnis."
        bild="/images/galerie/restaurant-speisesaal.jpeg"
      >
        <LinkButton href="#reservieren" variante="primary">
          Tisch reservieren
        </LinkButton>
        <LinkButton href="#speisekarte" variante="ghost">
          Speisekarte ansehen
        </LinkButton>
      </PageHero>

      {/* Willkommen / Atmosphäre: Stimmungstext neben einem Foto */}
      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-akzent">
              Willkommen
            </p>
            <h2 className="mt-2 font-display text-3xl text-wald-dark sm:text-4xl">
              Landhaus-Küche mit Charakter
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-tinte/80">
              Im Landhaus kochen wir mit Liebe zum Detail: frische, saisonale Zutaten, ehrliche
              Gerichte und eine warme Atmosphäre, in der man gern länger sitzen bleibt. Ob zum
              Familienessen, romantischen Abend oder mit Freunden — bei uns sind auch Gäste von
              außerhalb herzlich willkommen.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/galerie/restaurant-theke.jpeg"
              alt="Gastraum mit Theke im Restaurant des Landhauses"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {/* Vertrauens-Bausteine */}
      <Section className="bg-creme-dark/40">
        <SectionHeading kicker="Unsere Küche" titel="Das zeichnet uns aus" />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
          {highlights.map((h, i) => (
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
        <SectionHeading kicker="Speisekarte" titel="Was bei uns auf den Tisch kommt" />
        <div className="mx-auto mt-10 max-w-3xl">
          <SpeisekartenAkkordeon karte={karte} />
        </div>
      </Section>

      {/* Praktische Info: Öffnungszeiten (nur Restaurant) */}
      <Section className="bg-creme-dark/40">
        <SectionHeading kicker="Wann wir da sind" titel="Öffnungszeiten Restaurant" />
        <div className="mt-10">
          <Oeffnungszeiten nur={["restaurant"]} />
        </div>
      </Section>

      <Section id="reservieren" className="scroll-mt-24">
        <KontaktCTA />
      </Section>

      <Section id="geschlossene-gesellschaft" className="scroll-mt-24 bg-creme-dark/40">
        <SectionHeading
          kicker="Geschlossene Gesellschaft"
          titel="Das Restaurant mieten"
          text="An geschlossenen Tagen richten wir dir das ganze Restaurant privat aus — vom Familienfest über das Firmenessen bis zur Feier im kleinen Kreis. Sprich uns auf Menü, Personenzahl und Termin an."
        />
        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-3">
          {["Familienfeiern", "Firmenessen", "Geburtstage", "Jubiläen", "Trauerfeiern"].map(
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
            text="Erzähl uns von deinem Anlass — wir melden uns mit Menü-Ideen, Verfügbarkeit und Möglichkeiten. Am schnellsten telefonisch oder per WhatsApp."
          />
        </div>
      </Section>
    </>
  );
}
