import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import OeffnungszeitenListe from "./OeffnungszeitenListe";
import SocialLinks from "./SocialLinks";
import { buildNavItems } from "./nav-links";
import { localizedHref } from "@/lib/i18n/href";
import { getKontakt, getEinstellung } from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

/** Fußzeile mit Kontakt, Öffnungszeiten Restaurant, Navigation und Rechtslinks. */
export default async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { telefon, email, adresse } = await getKontakt();
  const oeffnungRestaurant = await getEinstellung("oeffnungszeiten_restaurant");
  const items = buildNavItems(locale, dict.nav);
  const f = dict.footer;

  return (
    <footer className="bg-wald-dark text-creme/85">
      <Container className="grid items-center gap-10 py-14 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
        <div>
          {/* Logo auf cremefarbener Karte — ein helles Logo braucht auf dem dunklen Grund eine helle Fläche */}
          <div className="inline-block rounded-2xl bg-creme p-4 shadow-lg ring-1 ring-black/5">
            <Image
              src="/images/logo/logo-freigestellt.png"
              alt="Das Landhaus in Tecklenburg-Leeden – Restaurant, Imbiss und Der Kotten"
              width={260}
              height={260}
              className="h-auto w-40"
            />
          </div>
          {/* Bereiche wie in der Hero-Eyebrow */}
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-creme/70">
            Restaurant · Imbiss · Der Kotten
          </p>
          <p className="mt-3 text-sm leading-relaxed">{f.beschreibung}</p>
          <SocialLinks
            tone="onDark"
            heading={f.social}
            className="mt-5 flex flex-col items-center sm:items-start"
            headingClassName="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-creme/70"
          />
        </div>

        <div>
          <h3 className="font-display text-lg text-creme">{f.kontakt}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {adresse && <li>{adresse}</li>}
            {telefon && (
              <li>
                <a href={`tel:${telefon.replace(/\s/g, "")}`} className="hover:text-akzent">
                  {telefon}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="hover:text-akzent">
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-creme">{f.oeffnungszeitenRestaurant}</h3>
          {oeffnungRestaurant && (
            <OeffnungszeitenListe text={oeffnungRestaurant} hell className="mt-3" />
          )}
        </div>

        <div>
          <h3 className="font-display text-lg text-creme">{f.seiten}</h3>
          {/* Auf Desktop zweispaltig, damit die 7 Links nicht als schmale, gequetschte Spalte stehen */}
          <ul className="mt-3 space-y-2 text-sm lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-2 lg:space-y-0">
            {items.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block hover:text-akzent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-creme/15">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-creme/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Das Landhaus Tecklenburg-Leeden</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href={localizedHref(locale, "/impressum")} className="hover:text-akzent">
              {f.impressum}
            </Link>
            <span className="hidden text-creme/30 sm:inline">·</span>
            <a
              href="https://nils-digital.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-akzent"
            >
              {f.realisiertVon}
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
