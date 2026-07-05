import type { Metadata } from "next";
import type { Bild } from "@/types";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SpeisekartenAkkordeon from "@/components/restaurant/SpeisekartenAkkordeon";
import Lightbox from "@/components/galerie/Lightbox";
import Oeffnungszeiten from "@/components/ui/Oeffnungszeiten";
import { getGerichteNachKategorie, getEinstellung, getBilder } from "@/lib/content";

// Platzhalter, bis eigene Imbiss-Fotos vorliegen. Sobald echte Fotos in
// lib/data/bilder.ts (bereich "imbiss") eingetragen sind, greift automatisch
// jene Galerie und dieser Fallback entfällt — der Platzhalter taucht dadurch
// bewusst NICHT in der zentralen Galerie auf.
const IMBISS_PLATZHALTER: Bild[] = [
  {
    id: "imbiss-platzhalter",
    url: "/images/galerie/imbiss-theke.jpg",
    alt: "Imbiss (Platzhalterfoto — wird durch ein echtes Foto ersetzt)",
    beschreibung: null,
    bereich: "imbiss",
  },
];

export const metadata: Metadata = {
  title: "Imbiss",
  description:
    "Schnell, frisch und unkompliziert: Pommes, Currywurst, Burger & Co. an unserem Imbiss in Tecklenburg-Leeden.",
};

export default async function ImbissSeite() {
  const [karte, oeffnung, imbissBilder] = await Promise.all([
    getGerichteNachKategorie("imbiss"),
    getEinstellung("oeffnungszeiten_imbiss"),
    getBilder("imbiss"),
  ]);
  const impressionen = imbissBilder.length > 0 ? imbissBilder : IMBISS_PLATZHALTER;

  return (
    <>
      <PageHero
        titel="Unser Imbiss"
        text="Schnell, frisch und lecker — für den kleinen Hunger zwischendurch oder direkt zum Mitnehmen."
        bild="/images/galerie/imbiss-theke.jpg"
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-tinte/80">
            Keine Zeit für ein langes Menü? Unser Imbiss versorgt Campinggäste und Besucher mit
            Klassikern frisch vom Grill und aus der Fritteuse — unkompliziert und zu fairen Preisen.
          </p>
          {oeffnung && (
            <p className="mt-4 rounded-xl bg-creme-dark/60 p-4 text-sm text-tinte/75">
              <span className="font-semibold text-wald-dark">Öffnungszeiten Imbiss:</span> {oeffnung}
            </p>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <SpeisekartenAkkordeon karte={karte} name="imbiss-karte" />
        </div>
      </Section>

      <Section className="bg-creme-dark/40">
        <Oeffnungszeiten />
      </Section>

      <Section>
        <SectionHeading kicker="Impressionen" titel="Bei uns am Imbiss" />
        <div className="mt-12">
          <Lightbox gruppen={[{ label: "", bilder: impressionen }]} />
        </div>
      </Section>
    </>
  );
}
