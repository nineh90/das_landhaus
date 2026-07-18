/**
 * Social-Media-Kanäle des Landhauses — EINE zentrale Quelle.
 *
 * Pflege: einfach die passende `url` unten eintragen. Ein leerer String
 * bedeutet „noch nicht vorhanden" — der Kanal wird dann NICHT angezeigt
 * (weder Kopf- noch Fußzeile) und nicht in die strukturierten Daten
 * (JSON-LD `sameAs`) aufgenommen. Sobald eine URL steht, erscheint das Icon
 * automatisch überall.
 */

export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "youtube" | "whatsapp";

export type SocialChannel = {
  platform: SocialPlatform;
  /** Beschriftung für Screenreader / Tooltip. */
  label: string;
  /** Vollständige Profil-URL. Leer lassen, solange der Kanal nicht existiert. */
  url: string;
  /**
   * In JSON-LD `sameAs` aufnehmen (verknüpft die Website mit dem Profil für Google).
   * Für echte Profile `true`; für Aktions-Links wie den WhatsApp-Chat `false`.
   */
  sameAs: boolean;
};

/**
 * Reihenfolge = Anzeige-Reihenfolge. Zum Einpflegen nur die `url` ausfüllen.
 * Beispiele:
 *   Instagram → https://www.instagram.com/das.landhaus.leeden
 *   Facebook  → https://www.facebook.com/DasLandhausLeeden
 *   WhatsApp  → https://wa.me/49XXXXXXXXXX  (Ländervorwahl 49, ohne führende 0/+)
 */
export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/das_landhaus_capfun",
    sameAs: true,
  },
  {
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/share/1cY1zKsGU6/",
    sameAs: true,
  },
  {
    platform: "tiktok",
    label: "TikTok",
    url: "https://www.tiktok.com/@das.landhaus.capf",
    sameAs: true,
  },
  { platform: "youtube", label: "YouTube", url: "", sameAs: true },
  { platform: "whatsapp", label: "WhatsApp", url: "", sameAs: false },
];

/** Nur die Kanäle mit hinterlegter URL — Grundlage für Anzeige & JSON-LD. */
export const activeSocialChannels: SocialChannel[] = SOCIAL_CHANNELS.filter(
  (c) => c.url.trim() !== "",
);
