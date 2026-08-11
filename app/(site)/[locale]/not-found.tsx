import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkButton from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { buildNavItems } from "@/components/ui/nav-links";
import { getDictionary } from "@/lib/i18n/dictionary";
import { getRequestLocale } from "@/lib/i18n/request-locale";
import { localizedHref } from "@/lib/i18n/href";

/**
 * 404-Seite der öffentlichen Website (Header/Footer kommen aus dem Layout).
 *
 * Greift bei jedem `notFound()` unterhalb von /[locale] — also bei unbekannten
 * URLs (siehe `[...rest]/page.tsx`) und bei nicht vorhandenen Detailseiten,
 * z. B. einem gelöschten Event unter /de/events/alter-slug.
 *
 * `not-found.tsx` bekommt vom Framework keine `params`, deshalb kommt die
 * Sprache aus dem Request-Header, den der Proxy setzt.
 */
export default async function NichtGefunden() {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);
  const t = dict.nichtGefunden;
  const links = buildNavItems(locale, dict.nav);

  return (
    <>
      <PageHero kicker={t.kicker} titel={t.titel} text={t.text}>
        <LinkButton href={localizedHref(locale, "/")}>{t.zurStartseite}</LinkButton>
        <LinkButton href={localizedHref(locale, "/anfahrt")} variante="ghost">
          {dict.nav.anfahrt}
        </LinkButton>
      </PageHero>

      <Section>
        <SectionHeading titel={t.linksTitel} text={t.linksText} />
        <Reveal className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-wald/15 bg-creme-dark/30 px-5 py-4 text-lg text-wald-dark transition-colors hover:border-akzent hover:bg-creme-dark/60"
            >
              {link.label}
              <span aria-hidden="true" className="ml-2 text-akzent-dark">
                →
              </span>
            </Link>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
