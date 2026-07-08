import { Fraunces, Source_Sans_3, Tangerine } from "next/font/google";

/**
 * Geteilte Schrift-Definitionen für beide Root-Layouts (öffentliche Website + Admin).
 * Ausgelagert, damit die Fonts nur an einer Stelle konfiguriert sind, seit es durch die
 * Mehrsprachigkeit zwei getrennte `<html>`-Roots gibt.
 */

// Display-Schrift: warm, leicht rustikal, modern — für Überschriften
export const displayFont = Fraunces({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Body-Schrift: gut lesbar, auch auf kleinen Smartphone-Displays
export const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Geschwungene Schreibschrift: für den Marken-Schriftzug „Das Landhaus"
export const scriptFont = Tangerine({
  variable: "--font-script-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/** Kombinierte CSS-Variablen-Klassen für das <html>-Element. */
export const fontVariables = `${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable}`;
