import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { fontVariables } from "@/lib/fonts";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

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

/** Baut je Sprache eine statische Variante der öffentlichen Seiten vor. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Root-Layout der öffentlichen Website. Setzt `<html lang={locale}>` und rahmt den Inhalt
 * mit Header + Footer. Der Admin-Bereich hat sein eigenes Root-Layout (app/(admin)) und
 * bleibt einsprachig Deutsch.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-creme text-tinte">
        {/* Ohne JavaScript keine Scroll-Animation → Inhalte sofort sichtbar */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        <Header locale={locale as Locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale as Locale} dict={dict} />
      </body>
    </html>
  );
}
