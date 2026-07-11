import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import MobileNav from "./MobileNav";
import NavLink from "./NavLink";
import LanguageSwitcher from "./LanguageSwitcher";
import { buildNavItems } from "./nav-links";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

/** Kopfzeile mit Wortmarke, Desktop-Navigation und mobiler Navigation. */
export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = buildNavItems(locale, dict.nav);

  return (
    <header className="sticky top-0 z-30 border-b border-creme-dark bg-creme/90 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between">
        <Link href={localizedHref(locale, "/")} className="flex items-center gap-2.5">
          {/* Rundes Haus-Emblem aus dem Logo — kompakt genug für die Kopfzeile */}
          <Image
            src="/images/logo/emblem.png"
            alt="Das Landhaus – Wappen"
            width={80}
            height={80}
            priority
            className="h-10 w-10 shrink-0 rounded-full ring-1 ring-wald-dark/10"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-wald-dark">Das Landhaus</span>
            <span className="text-xs uppercase tracking-widest text-erde">Tecklenburg-Leeden</span>
          </span>
        </Link>

        {/* Desktop-Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {items.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className="text-sm font-semibold transition-colors"
                inactiveClassName="text-tinte/80 hover:text-akzent-dark"
                activeClassName="text-akzent-dark"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <LanguageSwitcher current={locale} label={dict.languageSwitcher.label} />
        </div>

        <MobileNav
          locale={locale}
          items={items}
          switcherLabel={dict.languageSwitcher.label}
          menuLabels={dict.common}
        />
      </Container>
    </header>
  );
}
