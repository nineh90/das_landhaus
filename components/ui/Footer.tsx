import Link from "next/link";
import Container from "./Container";
import { navLinks } from "./nav-links";
import { getKontakt, getEinstellung } from "@/lib/content";

/** Fußzeile mit Kontakt, Öffnungszeiten Restaurant, Navigation und Rechtslinks. */
export default async function Footer() {
  const { telefon, email, adresse } = await getKontakt();
  const oeffnungRestaurant = await getEinstellung("oeffnungszeiten_restaurant");

  return (
    <footer className="bg-wald-dark text-creme/85">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-semibold text-creme">Das Landhaus</p>
          <p className="text-sm uppercase tracking-widest text-creme/60">Tecklenburg-Leeden</p>
          <p className="mt-4 text-sm leading-relaxed">
            Restaurant, Imbiss & Der Kotten mitten in der Natur — am Campingplatz in Tecklenburg-Leeden.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-creme">Kontakt</h3>
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
          <h3 className="font-display text-lg text-creme">Öffnungszeiten Restaurant</h3>
          {oeffnungRestaurant && (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{oeffnungRestaurant}</p>
          )}
        </div>

        <div>
          <h3 className="font-display text-lg text-creme">Seiten</h3>
          <ul className="mt-3 space-y-1 text-sm">
            {navLinks.map((link) => (
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
            <Link href="/impressum" className="hover:text-akzent">
              Impressum & Datenschutz
            </Link>
            <span className="hidden text-creme/30 sm:inline">·</span>
            <a
              href="https://nils-digital.de"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-akzent"
            >
              Realisiert von Nils-Digital
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
