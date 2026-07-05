import { getEinstellung } from "@/lib/content";

/**
 * Google-Maps-Einbettung per iframe (kein Client-JS).
 * DSGVO-Hinweis: In der Demo direkt eingebettet. Für die Produktion ist eine
 * Consent-/Klick-Lösung vorgesehen (siehe Impressum/Datenschutz).
 */
export default async function MapsEmbed({ className }: { className?: string }) {
  const src =
    (await getEinstellung("maps_embed")) ??
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1625.9947903717984!2d7.886603639175678!3d52.22948419299665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e82bbf9b2def%3A0x604c30189dfabc6d!2sRestaurant%20%22Das%20Landhaus%22!5e1!3m2!1sde!2sde!4v1783080201436!5m2!1sde!2sde";

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Karte: Das Landhaus Tecklenburg-Leeden"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full rounded-2xl border-0"
        style={{ minHeight: "320px" }}
      />
    </div>
  );
}
