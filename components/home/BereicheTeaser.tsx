import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

/** Drei Karten, die zu den Bereichen Restaurant, Imbiss und Der Kotten führen. */
export default function BereicheTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const b = dict.home.bereiche;
  const bereiche = [
    { href: "/restaurant", ...b.restaurant, bild: "/images/galerie/restaurant-speisesaal.jpeg" },
    { href: "/imbiss", ...b.imbiss, bild: "/images/galerie/imbiss-theke.jpg" },
    { href: "/der-kotten", ...b.kotten, bild: "/images/galerie/kotten-aussen.jpeg" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {bereiche.map((bereich, i) => (
        <Reveal key={bereich.href} delay={i * 120} className="flex">
          <Link
            href={localizedHref(locale, bereich.href)}
            className="group relative flex min-h-[20rem] w-full flex-col justify-end overflow-hidden rounded-2xl p-6 text-creme shadow-sm ring-1 ring-creme-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={bereich.bild}
              alt={bereich.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wald-dark/90 via-wald-dark/30 to-transparent" />
            <h3 className="font-display text-2xl">{bereich.titel}</h3>
            <p className="mt-2 text-sm text-creme/90">{bereich.text}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-akzent group-hover:underline">
              {b.mehrErfahren}
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
