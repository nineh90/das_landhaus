import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import Oeffnungszeiten from "@/components/ui/Oeffnungszeiten";
import MapsEmbed from "@/components/ui/MapsEmbed";
import KontaktCTA from "@/components/ui/KontaktCTA";
import { getKontakt } from "@/lib/content";

export const metadata: Metadata = {
  title: "Anfahrt & Kontakt",
  description:
    "So findest du das Landhaus Tecklenburg-Leeden — Adresse, Anfahrt, Öffnungszeiten und Kontakt. Gut erreichbar aus Osnabrück, Münster und Bielefeld.",
};

export default async function AnfahrtSeite() {
  const { telefon, email, adresse } = await getKontakt();

  return (
    <>
      <PageHero
        titel="Anfahrt & Kontakt"
        text="Im Ferienpark Capfun Tecklenburg-Leeden, eingebettet in die Natur — gut erreichbar aus dem Umland. Wir freuen uns auf deinen Besuch."
      />

      <Section containerClassName="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl text-wald-dark">Kontakt</h2>
          <ul className="mt-4 space-y-2 text-tinte/80">
            {adresse && (
              <li>
                <span className="font-semibold text-wald-dark">Adresse:</span> {adresse}
              </li>
            )}
            {telefon && (
              <li>
                <span className="font-semibold text-wald-dark">Telefon:</span>{" "}
                <a href={`tel:${telefon.replace(/\s/g, "")}`} className="hover:text-akzent-dark">
                  {telefon}
                </a>
              </li>
            )}
            {email && (
              <li>
                <span className="font-semibold text-wald-dark">E-Mail:</span>{" "}
                <a href={`mailto:${email}`} className="hover:text-akzent-dark">
                  {email}
                </a>
              </li>
            )}
          </ul>

          <h2 className="mt-10 font-display text-2xl text-wald-dark">Anfahrt</h2>
          <p className="mt-4 leading-relaxed text-tinte/80">
            Das Landhaus liegt im Ferienpark Capfun in Tecklenburg-Leeden, gut erreichbar aus dem
            gesamten Umland — von Osnabrück, Münster und Bielefeld jeweils in rund einer Stunde.
            Parkplätze sind direkt vor Ort vorhanden.
          </p>
          <a
            href="https://maps.app.goo.gl/Cno5bSai4361xfQM6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-akzent-dark hover:underline"
          >
            In Google Maps öffnen &amp; Route planen →
          </a>
        </div>

        <MapsEmbed className="h-80 lg:h-full" />
      </Section>

      <Section className="bg-creme-dark/40">
        <h2 className="mb-8 text-center font-display text-2xl text-wald-dark">Öffnungszeiten</h2>
        <Oeffnungszeiten />
      </Section>

      <Section>
        <KontaktCTA />
      </Section>
    </>
  );
}
