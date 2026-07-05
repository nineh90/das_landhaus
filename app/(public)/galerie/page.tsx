import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Lightbox from "@/components/galerie/Lightbox";
import { getGalerieGruppen } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Eindrücke vom Landhaus Tecklenburg-Leeden — Restaurant, Der Kotten, Imbiss und die Natur ringsherum.",
};

export default async function GalerieSeite() {
  const gruppen = await getGalerieGruppen();
  const hatBilder = gruppen.some((g) => g.bilder.length > 0);

  return (
    <>
      <PageHero
        titel="Galerie"
        text="Ein paar Eindrücke vom Landhaus, dem Kotten und der Natur ringsherum."
      />

      <Section>
        {hatBilder ? (
          <Lightbox gruppen={gruppen} />
        ) : (
          <p className="text-center text-tinte/70">Bald gibt es hier Bilder zu sehen.</p>
        )}
      </Section>
    </>
  );
}
