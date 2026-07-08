import type { Bild } from "@/types";

/**
 * Galerie — ausschließlich echte Fotos des Landhauses (vom Betreiber bereitgestellt).
 * `url` zeigt auf lokale Dateien unter /public/images. In Stufe 2 zeigen diese
 * URLs auf das Bild-CDN (Vercel Blob / Cloudinary) — die Komponenten bleiben gleich.
 *
 * `alt`  → Barrierefreiheit (Screenreader), möglichst beschreibend.
 * `beschreibung` → kurze, sichtbare Bildunterschrift in Galerie/Lightbox.
 *
 * `bereich` bestimmt die Galerie-Gruppe (siehe GALERIE_GRUPPEN in lib/content.ts):
 * aussen/restaurant → "Das Landhaus", imbiss → "Imbiss", kotten → "Der Kotten",
 * essen → "Essen", events → "Events".
 *
 * Weitere Fotos werden laufend ergänzt: hier einfach neue Einträge hinzufügen
 * bzw. url/alt/beschreibung aktualisieren.
 */
export const bilder: Bild[] = [
  {
    id: "b-1",
    url: "/images/hero/landhaus-hero.jpeg",
    alt: "Das Landhaus und der Kotten am Ferienpark, umgeben von Natur",
    beschreibung: "Das Landhaus, eingebettet in die Natur",
    bereich: "aussen",
  },
  {
    id: "b-2",
    url: "/images/galerie/restaurant-speisesaal.jpeg",
    alt: "Rustikaler Speisesaal mit Fachwerk, Holztischen und schmiedeeisernen Leuchtern",
    beschreibung: "Rustikaler Speisesaal mit Fachwerk",
    bereich: "restaurant",
  },
  {
    id: "b-3",
    url: "/images/galerie/restaurant-theke.jpeg",
    alt: "Gemütliche Theke aus Holz mit Fachwerk-Balken",
    beschreibung: "Gemütliche Theke aus Holz",
    bereich: "restaurant",
  },
  {
    id: "b-4",
    url: "/images/galerie/kotten-aussen.jpeg",
    alt: "Der Kotten von außen — historisches Fachwerkhaus mit Bühne und Terrasse",
    beschreibung: "Der Kotten von außen",
    bereich: "kotten",
  },
  {
    id: "b-5",
    url: "/images/galerie/essen-burger.jpg",
    alt: "Hausgemachter Burger mit Sesambrötchen, Rindfleisch-Patty, Spiegelei, Tomate und Salat, dazu knusprige Pommes",
    beschreibung: "Landhaus-Burger mit knusprigen Pommes",
    bereich: "essen",
  },
  {
    id: "b-6",
    url: "/images/galerie/essen-medaillons.jpg",
    alt: "Schweinemedaillons in Champignon-Rahmsauce mit Kroketten, grünen Bohnen und frischem Beilagensalat",
    beschreibung: "Schweinemedaillons mit Kroketten und Beilagensalat",
    bereich: "essen",
  },
  {
    id: "b-7",
    url: "/images/galerie/essen-haehnchen-salat.jpg",
    alt: "Bunter Blattsalat mit gegrillten, marinierten Hähnchenstreifen, Gurke, Tomate, roten Zwiebeln und zweierlei Dressing",
    beschreibung: "Gegrillter Hähnchensalat mit frischem Gemüse",
    bereich: "essen",
  },
  {
    id: "b-8",
    url: "/images/galerie/imbiss-stand.jpg",
    alt: "Imbiss-Theke unter überdachter Terrasse mit Tageskarte, Zapfanlage und Blick in die Küche",
    beschreibung: "Unser Imbiss — frisch vom Grill, direkt am Platz",
    bereich: "imbiss",
  },
  {
    id: "b-9",
    url: "/images/galerie/imbiss-ausschank.jpg",
    alt: "Ausschank und Bestellfenster des Imbisses mit Getränkekarte und Blick in die Küche",
    beschreibung: "Ausschank und Bestellfenster am Imbiss",
    bereich: "imbiss",
  },
];
