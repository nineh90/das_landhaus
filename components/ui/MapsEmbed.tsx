import MapsConsent from "@/components/ui/MapsConsent";
import { getEinstellung } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/href";
import { MAPS_LINK } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";

/**
 * Google-Maps-Einbettung mit vorgeschalteter Einwilligung (Zwei-Klick-Lösung).
 *
 * Diese Server-Komponente holt nur Embed-URL und Texte; das eigentliche Rendern
 * übernimmt `MapsConsent` (Client), weil die Einwilligung im Browser gespeichert wird.
 * Ohne Klick wird kein iframe erzeugt — es geht also nichts an Google raus.
 */
export default async function MapsEmbed({ locale, className }: { locale: Locale; className?: string }) {
  const [src, dict] = await Promise.all([getEinstellung("maps_embed"), getDictionary(locale)]);
  const iframeSrc =
    src ??
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1625.9947903717984!2d7.886603639175678!3d52.22948419299665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e82bbf9b2def%3A0x604c30189dfabc6d!2sRestaurant%20%22Das%20Landhaus%22!5e1!3m2!1sde!2sde!4v1783080201436!5m2!1sde!2sde";

  return (
    <MapsConsent
      src={iframeSrc}
      iframeTitel={dict.maps.titel}
      texte={dict.maps.consent}
      datenschutzHref={localizedHref(locale, "/impressum")}
      externHref={MAPS_LINK}
      className={className}
    />
  );
}
