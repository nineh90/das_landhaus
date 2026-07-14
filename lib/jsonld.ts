/**
 * Baut schema.org-JSON-LD-Objekte für die strukturierten Daten der Website.
 *
 * Alle Kontaktangaben kommen live aus der DB (in Produktion: Neon) über
 * `getKontakt()` — nichts ist hier hartkodiert. Öffnungszeiten sind bewusst
 * NICHT enthalten, da sie als Freitext gespeichert sind (nicht maschinenlesbar);
 * falsche `openingHoursSpecification` würde dem Ranking eher schaden.
 */
import type { Event } from "@/types";
import { getKontakt } from "@/lib/content";
import { SITE_URL, SITE_NAME, OG_IMAGE, SOCIAL_LINKS } from "@/lib/site";

type JsonLdObject = Record<string, unknown>;

/** Macht aus einem evtl. relativen Pfad eine absolute URL (für image/logo). */
function absolut(pfad: string): string {
  if (pfad.startsWith("http")) return pfad;
  return `${SITE_URL}${pfad.startsWith("/") ? "" : "/"}${pfad}`;
}

/**
 * LocalBusiness/Restaurant-Auszeichnung für die Startseite — Name, Adresse,
 * Telefon, E-Mail, Logo und (sobald gepflegt) `sameAs`-Verweise auf Social/Google.
 */
export async function buildLocalBusinessJsonLd(): Promise<JsonLdObject> {
  const { telefon, email, adresse } = await getKontakt();
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    url: SITE_URL,
    image: absolut(OG_IMAGE),
    logo: absolut(OG_IMAGE),
    ...(telefon ? { telephone: telefon } : {}),
    ...(email ? { email } : {}),
    ...(adresse ? { address: adresse } : {}),
    ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
  };
}

/** ISO-Startzeitpunkt aus Datum (YYYY-MM-DD) + Freitext-Uhrzeit ("20:00 Uhr"). */
function startDate(datum: string, uhrzeit: string): string {
  const m = uhrzeit.match(/(\d{1,2})[:.](\d{2})/);
  return m ? `${datum}T${m[1].padStart(2, "0")}:${m[2]}:00` : datum;
}

/** Offer aus Freitext-Eintritt ("8,00 €" / "Eintritt frei"). null, wenn nicht deutbar. */
function offer(eintritt: string | null, url: string): JsonLdObject | null {
  if (!eintritt) return null;
  const base = {
    "@type": "Offer",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url,
  };
  if (/(frei|free|kostenlos|gratis)/i.test(eintritt)) return { ...base, price: "0" };
  const m = eintritt.replace(",", ".").match(/(\d+(?:\.\d{1,2})?)/);
  return m ? { ...base, price: m[1] } : null;
}

/**
 * schema.org/Event für eine Event-Detailseite — macht das Event für Googles
 * Rich-Event-Ergebnisse (Datum/Ort direkt in der Suche) qualifiziert.
 */
export async function buildEventJsonLd(event: Event, locale: string): Promise<JsonLdObject> {
  const { adresse } = await getKontakt();
  const url = `${SITE_URL}/${locale}/events/${event.slug}`;

  const data: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.titel,
    startDate: startDate(event.datum, event.uhrzeit),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url,
    location: {
      "@type": "Place",
      name: `${SITE_NAME} – Der Kotten`,
      ...(adresse ? { address: adresse } : {}),
    },
    organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  if (event.beschreibung) data.description = event.beschreibung;
  if (event.bild) data.image = absolut(event.bild);
  const o = offer(event.eintritt, url);
  if (o) data.offers = o;

  return data;
}
