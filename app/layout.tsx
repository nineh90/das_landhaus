import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, Tangerine } from "next/font/google";
import "./globals.css";

// Display-Schrift: warm, leicht rustikal, modern — für Überschriften
const displayFont = Fraunces({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Body-Schrift: gut lesbar, auch auf kleinen Smartphone-Displays
const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Geschwungene Schreibschrift: für den Marken-Schriftzug „Das Landhaus"
// Tangerine — historische, kalligrafische Anmutung
const scriptFont = Tangerine({
  variable: "--font-script-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://das-landhaus-tecklenburg.de"),
  title: {
    default: "Das Landhaus Tecklenburg-Leeden — Restaurant, Imbiss & Der Kotten",
    template: "%s | Das Landhaus Tecklenburg-Leeden",
  },
  description:
    "Restaurant, Imbiss und die Event-Diele »Der Kotten« in Tecklenburg-Leeden — gehobene Küche, gemütliche Atmosphäre und Veranstaltungen mitten in der Natur. Auch für Gäste aus Osnabrück, Münster und Bielefeld.",
  openGraph: {
    title: "Das Landhaus Tecklenburg-Leeden",
    description:
      "Restaurant, Imbiss und die Event-Diele »Der Kotten« in Tecklenburg-Leeden — gute Küche, gute Stimmung, mitten in der Natur.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${displayFont.variable} ${bodyFont.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-creme text-tinte">
        {/* Ohne JavaScript keine Scroll-Animation → Inhalte sofort sichtbar */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {/* Header/Footer der öffentlichen Website liegen in app/(public)/layout.tsx,
            damit der Admin-Bereich (app/admin) sein eigenes Chrome nutzen kann. */}
        {children}
      </body>
    </html>
  );
}
