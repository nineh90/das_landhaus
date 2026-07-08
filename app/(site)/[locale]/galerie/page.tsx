import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Lightbox from "@/components/galerie/Lightbox";
import { getGalerieGruppen } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Eindrücke vom Landhaus Tecklenburg-Leeden — Restaurant, Der Kotten, Imbiss und die Natur ringsherum.",
};

export default async function GalerieSeite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  const [gruppen, dict] = await Promise.all([getGalerieGruppen(), getDictionary(locale)]);
  const hatBilder = gruppen.some((g) => g.bilder.length > 0);
  const t = dict.galerie;

  return (
    <>
      <PageHero titel={t.hero.titel} text={t.hero.text} />

      <Section>
        {hatBilder ? (
          <Lightbox gruppen={gruppen} labels={dict.lightbox} />
        ) : (
          <p className="text-center text-tinte/70">{t.leer}</p>
        )}
      </Section>
    </>
  );
}
