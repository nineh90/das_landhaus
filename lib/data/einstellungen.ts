import type { Einstellung } from "@/types";

/**
 * PLATZHALTER-Einstellungen (Öffnungszeiten, Kontakt) als Key-Value-Paare —
 * exakt das spätere Einstellung-Schema. In Stufe 2 über das Admin-Panel pflegbar.
 *
 * Hinweis: Telefon/WhatsApp sind Beispielwerte und müssen vor dem Pitch durch
 * die echten Daten von Ali ersetzt werden.
 */
export const einstellungen: Einstellung[] = [
  { key: "telefon", value: "+49 5482 000000" },
  { key: "whatsapp", value: "4954820000000" }, // Format für wa.me-Link (ohne + und Leerzeichen)
  { key: "email", value: "info@das-landhaus-tecklenburg.de" },
  {
    key: "adresse",
    value: "Das Landhaus, Grafenstraße 31, 49545 Tecklenburg-Leeden",
  },
  {
    key: "oeffnungszeiten_restaurant",
    value:
      "Mi–Fr 17:00–22:00 Uhr\nSa 12:00–22:00 Uhr\nSo 12:00–21:00 Uhr\nMo & Di Ruhetag",
  },
  {
    key: "oeffnungszeiten_imbiss",
    value: "Täglich 11:30–20:00 Uhr (in der Saison)",
  },
  {
    key: "oeffnungszeiten_kotten",
    value: "Bei Veranstaltungen — siehe Termine",
  },
  // Google-Maps-Embed für den echten Standort: Restaurant „Das Landhaus", Tecklenburg-Leeden
  // (offizielle Embed-URL aus Google Maps → Teilen → Karte einbetten).
  {
    key: "maps_embed",
    value:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1625.9947903717984!2d7.886603639175678!3d52.22948419299665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b9e82bbf9b2def%3A0x604c30189dfabc6d!2sRestaurant%20%22Das%20Landhaus%22!5e1!3m2!1sde!2sde!4v1783080201436!5m2!1sde!2sde",
  },
];
