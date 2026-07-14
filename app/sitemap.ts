import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";
import { getEvents } from "@/lib/content";

/**
 * Dynamische Sitemap für Suchmaschinen.
 *
 * Enthält alle öffentlichen Seiten — je Sprache (DE/EN/NL) mit korrekten
 * hreflang-Alternates, damit Google die Sprachvarianten als zusammengehörig
 * erkennt. Die primäre `url` je Eintrag ist die deutsche (Standard-)Variante,
 * die Alternates verweisen auf alle Sprachen inkl. `x-default`.
 *
 * Event-Detailseiten kommen live aus der DB. Ist die DB nicht erreichbar,
 * wird die Sitemap trotzdem mit den statischen Routen ausgeliefert.
 */

type Frequenz = MetadataRoute.Sitemap[number]["changeFrequency"];

/** Öffentliche Routen ohne Locale-Präfix, mit SEO-Gewichtung. `""` = Startseite. */
const STATISCHE_ROUTEN: { pfad: string; prioritaet: number; frequenz: Frequenz }[] = [
  { pfad: "", prioritaet: 1.0, frequenz: "weekly" },
  { pfad: "/restaurant", prioritaet: 0.9, frequenz: "monthly" },
  { pfad: "/imbiss", prioritaet: 0.8, frequenz: "monthly" },
  { pfad: "/der-kotten", prioritaet: 0.8, frequenz: "monthly" },
  { pfad: "/events", prioritaet: 0.9, frequenz: "weekly" },
  { pfad: "/galerie", prioritaet: 0.6, frequenz: "monthly" },
  { pfad: "/anfahrt", prioritaet: 0.7, frequenz: "yearly" },
  { pfad: "/impressum", prioritaet: 0.2, frequenz: "yearly" },
];

const url = (locale: string, pfad: string) => `${SITE_URL}/${locale}${pfad}`;

/** hreflang-Alternates eines Pfads über alle Sprachen inkl. x-default (= Deutsch). */
function alternates(pfad: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = url(l, pfad);
  languages["x-default"] = url(defaultLocale, pfad);
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const eintraege: MetadataRoute.Sitemap = STATISCHE_ROUTEN.map(({ pfad, prioritaet, frequenz }) => ({
    url: url(defaultLocale, pfad),
    lastModified: new Date(),
    changeFrequency: frequenz,
    priority: prioritaet,
    alternates: alternates(pfad),
  }));

  try {
    const events = await getEvents();
    for (const e of events) {
      const pfad = `/events/${e.slug}`;
      eintraege.push({
        url: url(defaultLocale, pfad),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: alternates(pfad),
      });
    }
  } catch {
    // DB nicht erreichbar → nur statische Routen ausliefern (besser als 500).
  }

  return eintraege;
}
