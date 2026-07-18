import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { fontVariables } from "@/lib/fonts";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import SocialCta from "@/components/ui/SocialCta";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";
import { SITE_URL, OG_IMAGE } from "@/lib/site";

/** Sharing-Vorschaubild (WhatsApp, Facebook, Instagram-DMs …) — 1200×630. */
const ogImages = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: "Das Landhaus Tecklenburg-Leeden — Restaurant, Imbiss & Der Kotten",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Das Landhaus Tecklenburg-Leeden — Restaurant, Imbiss & Der Kotten",
    template: "%s | Das Landhaus Tecklenburg-Leeden",
  },
  description:
    "Restaurant, Imbiss und die Event-Diele »Der Kotten« in Tecklenburg-Leeden — gehobene Küche, gemütliche Atmosphäre und Veranstaltungen mitten in der Natur. Auch für Gäste aus Osnabrück, Münster und Bielefeld.",
  openGraph: {
    siteName: "Das Landhaus Tecklenburg-Leeden",
    title: "Das Landhaus Tecklenburg-Leeden",
    description:
      "Restaurant, Imbiss und die Event-Diele »Der Kotten« in Tecklenburg-Leeden — gute Küche, gute Stimmung, mitten in der Natur.",
    url: "/",
    locale: "de_DE",
    type: "website",
    images: ogImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Das Landhaus Tecklenburg-Leeden",
    description:
      "Restaurant, Imbiss und die Event-Diele »Der Kotten« in Tecklenburg-Leeden — gute Küche, gute Stimmung, mitten in der Natur.",
    images: [OG_IMAGE],
  },
};

/**
 * Öffentliche Seiten immer zur Laufzeit serverseitig aus der DB rendern.
 * Ohne dies backt Next die Seiten statisch zur Build-Zeit — dann erscheinen im
 * Admin gepflegte Inhalte (Events, Speisekarte, Galerie …) erst beim nächsten
 * Deploy. Diese Angabe im Layout gilt für alle darunterliegenden Routen.
 */
export const dynamic = "force-dynamic";

/** Sprachen für die statische Vorerzeugung der Route-Parameter. */
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
        <SocialCta dict={dict} />
        <Footer locale={locale as Locale} dict={dict} />
      </body>
    </html>
  );
}
