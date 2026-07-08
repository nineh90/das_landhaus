import Link from "next/link";
import Container from "./Container";
import MobileNav from "./MobileNav";
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
        <Link href={localizedHref(locale, "/")} className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold text-wald-dark">Das Landhaus</span>
          <span className="text-xs uppercase tracking-widest text-erde">Tecklenburg-Leeden</span>
        </Link>

        {/* Desktop-Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {items.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-tinte/80 transition-colors hover:text-akzent-dark"
              >
                {link.label}
              </Link>
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
