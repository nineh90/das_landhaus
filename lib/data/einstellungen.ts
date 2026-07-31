import type { Einstellung } from "@/types";

/**
 * PLATZHALTER-Einstellungen (Öffnungszeiten, Kontakt) als Key-Value-Paare —
 * exakt das spätere Einstellung-Schema. In Stufe 2 über das Admin-Panel pflegbar.
 *
 * Telefon/WhatsApp stehen bewusst LEER: Ali hat die echten Nummern noch nicht
 * geliefert, und eine erfundene Nummer ist schlechter als gar keine (sie landet
 * sonst auch im JSON-LD und damit bei Google). Alle Ausgabestellen — Footer,
 * Anfahrt, KontaktCTA, JSON-LD — blenden leere Werte automatisch aus. Sobald die
 * Nummern da sind: hier eintragen bzw. im Admin unter Einstellungen pflegen.
 */
export const einstellungen: Einstellung[] = [
  { key: "telefon", value: "" },
  { key: "whatsapp", value: "" }, // Format für wa.me-Link (ohne + und Leerzeichen)
  { key: "email", value: "info@das-landhaus-capfun.de" },
  {
    key: "adresse",
    value: "Das Landhaus, Grafenstraße 31, 49545 Tecklenburg-Leeden",
  },
  {
    key: "oeffnungszeiten_restaurant",
    value: "Di–Do 17:00–21:00 Uhr\nFr–So 17:00–22:00 Uhr\nMo Ruhetag",
  },
  {
    key: "oeffnungszeiten_imbiss",
    value: "Täglich 12:00–17:00 Uhr (in der Saison)",
  },
  {
    key: "oeffnungszeiten_kotten",
    value: "Bei Veranstaltungen — siehe Events",
  },
  // Google-Maps-Embed für den echten Standort: Restaurant „Das Landhaus", Tecklenburg-Leeden
  // (offizielle Embed-URL aus Google Maps → Teilen → Karte einbetten).
  {
    key: "maps_embed",
    value:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1625.9947903717984!2d7.886603639175678!3d52.22948419299665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e82bbf9b2def%3A0x604c30189dfabc6d!2sRestaurant%20%22Das%20Landhaus%22!5e1!3m2!1sde!2sde!4v1783080201436!5m2!1sde!2sde",
  },
];
