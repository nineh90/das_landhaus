import type { Event } from "@/types";

/**
 * Echte, kommende Veranstaltungen (Stand Juli 2026).
 * Diese Liste ist die Seed-Quelle; im Betrieb werden Events über das Admin-Panel
 * gepflegt. Details zu Programm/Preisen folgen laut Betreiber noch.
 */
export const events: Event[] = [
  {
    id: "e-livemusik-dj-2026-07-11",
    slug: "livemusik-dj-abend",
    titel: "Live-Musik & DJ",
    beschreibung:
      "Sommerabend im Kotten: Live-Musik und unser DJ sorgen für Stimmung bis in die Nacht. Kommt vorbei, tanzt mit und lasst den Abend bei kühlen Getränken ausklingen — auch Gäste von außerhalb sind herzlich willkommen.",
    datum: "2026-07-11",
    uhrzeit: "20:00 Uhr",
    eintritt: "Eintritt frei",
    bild: "/images/kotten/event-livemusik-dj.jpg",
    veroeffentlicht: true,
  },
  {
    id: "e-amerikanischer-abend-2026-07-18",
    slug: "amerikanischer-abend",
    titel: "Amerikanischer Abend",
    beschreibung:
      "Passend zum großen Dino-Treffen am Campingplatz — dem jährlichen Treffen der amerikanischen Straßenkreuzer und Oldtimer — laden wir zum Amerikanischen Abend ein. US-Klassiker vom Grill, amerikanisches Flair und gute Musik. Genaue Infos zu Programm und Preisen folgen in Kürze.",
    datum: "2026-07-18",
    uhrzeit: "18:00 Uhr",
    eintritt: null,
    bild: "/images/kotten/event-amerikanischer-abend.jpg",
    veroeffentlicht: true,
  },
];
