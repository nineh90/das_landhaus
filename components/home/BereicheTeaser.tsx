import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const bereiche = [
  {
    href: "/restaurant",
    titel: "Restaurant",
    text: "Gehobene, saisonale Küche in gemütlicher Landhaus-Atmosphäre — für externe Gäste und geschlossene Gesellschaften.",
    bild: "/images/galerie/restaurant-speisesaal.jpeg",
    alt: "Gemütlich eingedeckter Speisesaal im Restaurant des Landhauses",
  },
  {
    href: "/imbiss",
    titel: "Imbiss",
    text: "Schnell, frisch und unkompliziert — Pommes, Currywurst & Co. für zwischendurch.",
    bild: "/images/galerie/imbiss-theke.jpg",
    alt: "Theke des Imbiss im Landhaus mit frischen Snacks für zwischendurch",
  },
  {
    href: "/der-kotten",
    titel: "Der Kotten",
    text: "Unsere Event-Diele: DJ-Nächte, Karaoke und Mottoabende — und privat mietbar für eigene Feiern.",
    bild: "/images/galerie/kotten-aussen.jpeg",
    alt: "Der Kotten von außen — die Event-Diele des Landhauses in der Natur",
  },
];

/** Drei Karten, die zu den Bereichen Restaurant, Imbiss und Der Kotten führen. */
export default function BereicheTeaser() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {bereiche.map((b, i) => (
        <Reveal key={b.href} delay={i * 120} className="flex">
          <Link
            href={b.href}
            className="group relative flex min-h-[20rem] w-full flex-col justify-end overflow-hidden rounded-2xl p-6 text-creme shadow-sm ring-1 ring-creme-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={b.bild}
              alt={b.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wald-dark/90 via-wald-dark/30 to-transparent" />
            <h3 className="font-display text-2xl">{b.titel}</h3>
            <p className="mt-2 text-sm text-creme/90">{b.text}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-akzent group-hover:underline">
              Mehr erfahren
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
