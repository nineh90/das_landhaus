import Link from "next/link";
import Container from "./Container";
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
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-creme">Das Landhaus</p>
          <p className="text-sm uppercase tracking-widest text-creme/60">Tecklenburg-Leeden</p>
          <p className="mt-4 text-sm leading-relaxed">{f.beschreibung}</p>
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
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{oeffnungRestaurant}</p>
          )}
        </div>

        <div>
          <h3 className="font-display text-lg text-creme">{f.seiten}</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {items.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-akzent">
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
