import Link from "next/link";
import Container from "./Container";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "./LanguageSwitcher";
import { navLinks } from "./nav-links";

/** Kopfzeile mit Wortmarke, Desktop-Navigation und mobiler Navigation. */
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-creme-dark bg-creme/90 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold text-wald-dark">Das Landhaus</span>
          <span className="text-xs uppercase tracking-widest text-erde">Tecklenburg-Leeden</span>
        </Link>

        {/* Desktop-Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-tinte/80 transition-colors hover:text-akzent-dark"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
