import Image from "next/image";
import Container from "./Container";

/**
 * Schlanke Kopfzeile für Unterseiten: Titel + optionaler Einleitungstext,
 * mit stimmungsvollem Hintergrundbild (standardmäßig dasselbe wie der Hero
 * auf der Startseite). Über `bild` lässt sich pro Seite ein anderes Motiv setzen.
 */
export default function PageHero({
  titel,
  text,
  bild = "/images/hero/landhaus-hero.jpeg",
  children,
}: {
  titel: string;
  text?: string;
  bild?: string;
  /** Optionale Aktionen (z. B. CTA-Buttons), erscheinen unter dem Einleitungstext. */
  children?: React.ReactNode;
}) {
  return (
    <div className="relative isolate bg-wald-dark text-creme">
      {/* Hintergrundbild */}
      <Image
        src={bild}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Abdunklung für Lesbarkeit des Titels */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wald-dark/90 via-wald-dark/70 to-wald-dark/55" />

      <Container className="py-14 sm:py-20">
        <h1 className="font-script font-bold leading-[0.9] drop-shadow-md text-6xl sm:text-7xl lg:text-8xl">
          {titel}
        </h1>
        {text && <p className="mt-4 max-w-2xl text-lg text-creme/85">{text}</p>}
        {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
      </Container>
    </div>
  );
}
