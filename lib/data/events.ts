import type { Event } from "@/types";

/**
 * PLATZHALTER-Events für die Demo.
 * In Stufe 2 durch DB-Einträge (Admin-Panel) ersetzt. `slug` wird dort entweder
 * zum echten Feld oder in lib/content.ts aus Titel/ID abgeleitet.
 *
 * Daten sind ISO-Strings. Mischung aus kommenden und vergangenen Terminen.
 */
export const events: Event[] = [
  {
    id: "e-1",
    slug: "schlager-nacht-juli",
    titel: "Große Schlager-Nacht",
    beschreibung:
      "Mitsingen, mittanzen, feiern: Die besten deutschen Schlager von gestern und heute. Unser DJ bringt den Kotten zum Beben — von Helene bis Wolfgang Petry.",
    datum: "2026-07-18",
    uhrzeit: "20:00 Uhr",
    eintritt: "8,00 €",
    bild: "/images/kotten/event-schlager.jpg",
    veroeffentlicht: true,
  },
  {
    id: "e-2",
    slug: "live-musik-sommerabend",
    titel: "Live-Musik: Sommerabend mit der Band „Waldklang“",
    beschreibung:
      "Handgemachte Musik unter freiem Himmel auf unserer Terrasse. Akustik-Coverband mit Rock- und Pop-Klassikern zum Mitsingen. Bei schlechtem Wetter drinnen im Kotten.",
    datum: "2026-08-02",
    uhrzeit: "19:30 Uhr",
    eintritt: "Eintritt frei",
    bild: "/images/kotten/event-livemusik.jpg",
    veroeffentlicht: true,
  },
  {
    id: "e-3",
    slug: "oktoberfest-tecklenburg",
    titel: "Tecklenburger Oktoberfest",
    beschreibung:
      "Zünftig feiern mit Blasmusik, Brezeln, Haxn und Maß. Tracht erwünscht! Reservierung empfohlen — die Tische sind schnell vergeben.",
    datum: "2026-09-26",
    uhrzeit: "18:00 Uhr",
    eintritt: "10,00 € inkl. erstem Getränk",
    bild: "/images/kotten/event-oktoberfest.jpg",
    veroeffentlicht: true,
  },
  {
    id: "e-4",
    slug: "tanz-in-den-mai",
    titel: "Tanz in den Mai",
    beschreibung:
      "Der Klassiker zum Saisonstart — Live-DJ, gute Laune und Cocktails bis spät in die Nacht.",
    datum: "2026-04-30",
    uhrzeit: "20:00 Uhr",
    eintritt: "6,00 €",
    bild: "/images/kotten/event-tanz-in-den-mai.jpg",
    veroeffentlicht: true,
  },
  {
    id: "e-5",
    slug: "weinabend-herbst",
    titel: "Weinabend: Herbstliche Tropfen",
    beschreibung:
      "Geführte Verkostung von sechs Weinen, passend begleitet von kleinen Gerichten unserer Küche. Begrenzte Plätze.",
    datum: "2026-10-17",
    uhrzeit: "19:00 Uhr",
    eintritt: "39,00 € inkl. Verkostung & Speisen",
    bild: "/images/restaurant/event-weinabend.jpg",
    veroeffentlicht: true,
  },
  {
    id: "e-6",
    slug: "interne-planung-2027",
    titel: "Interne Planung Saison 2027",
    beschreibung: "Noch nicht veröffentlicht — Beispiel für ein verstecktes Event im Admin.",
    datum: "2026-11-05",
    uhrzeit: "10:00 Uhr",
    eintritt: null,
    bild: null,
    veroeffentlicht: false,
  },
];
