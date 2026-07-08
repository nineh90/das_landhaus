import Link from "next/link";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/Button";
import Ornament from "@/components/ui/Ornament";
import HeroBackground from "@/components/home/HeroBackground";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionary";

/** Vollflächiger Hero mit stimmungsvollem Bild, Claim und Haupt-CTAs. */
export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
      {/* Hintergrundbild mit Ken-Burns-Zoom + Scroll-Parallax */}
      <HeroBackground />

      {/* Warmer Sonnenlicht-Schimmer über dem Foto (atmet dezent → „lebendig") */}
      <div className="hero-warmth absolute inset-0 -z-10" aria-hidden="true" />
      {/* Abdunklung von unten für Lesbarkeit des Textes */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-wald-dark/90 via-wald-dark/45 to-wald-dark/35" />
      {/* Zusätzliche Abdunklung von links, damit der Claim sicher steht */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-wald-dark/60 via-wald-dark/15 to-transparent" />

      <Container className="py-24 text-center text-creme lg:text-left">
        <p
          className="fade-in-up text-base font-semibold uppercase tracking-[0.2em] text-creme drop-shadow-sm sm:text-lg"
          style={{ animationDelay: "80ms" }}
        >
          {h.eyebrow}
        </p>
        <div
          className="fade-in-up mx-auto mt-6 w-fit max-w-full lg:mx-0"
          style={{ animationDelay: "200ms" }}
        >
          <h1>
            <span className="block font-script font-bold leading-[0.85] text-creme drop-shadow-md text-7xl sm:text-8xl lg:text-[10rem]">
              Das Landhaus
            </span>
            <Ornament className="mt-4 text-creme/70 drop-shadow-sm" />
            <span className="mt-4 block font-display text-2xl font-medium text-creme drop-shadow-sm sm:text-3xl">
              {h.subtitle}
            </span>
          </h1>
        </div>
        <p
          className="fade-in-up mx-auto mt-6 max-w-xl text-lg text-creme drop-shadow-sm lg:mx-0"
          style={{ animationDelay: "340ms" }}
        >
          {h.text}
        </p>

        {/* Teaser: Kotten mieten — warmer Akzent-Chip, führt zur Kotten-Seite */}
        <Link
          href={localizedHref(locale, "/der-kotten")}
          className="fade-in-up mt-6 inline-flex items-center gap-2.5 rounded-full bg-creme px-5 py-2.5 text-sm font-semibold text-wald-dark shadow-md ring-1 ring-wald-dark/10 transition-colors hover:bg-creme-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-creme sm:text-base"
          style={{ animationDelay: "420ms" }}
        >
          <span
            aria-hidden="true"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-wald-dark text-xs font-bold leading-none text-creme"
          >
            !
          </span>
          {h.kottenChip}
        </Link>

        <div
          className="fade-in-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:items-start lg:justify-start"
          style={{ animationDelay: "560ms" }}
        >
          <LinkButton href={localizedHref(locale, "/restaurant")} variante="primary">
            {dict.common.speisekarteAnsehen}
          </LinkButton>
          <LinkButton href={localizedHref(locale, "/events")} variante="ghost">
            {dict.common.kommendeEvents}
          </LinkButton>
        </div>
      </Container>

      {/* Funktionsfähiger Scroll-Indikator: springt sanft zur ersten Sektion */}
      <a
        href="#entdecken"
        aria-label={dict.common.weiterZumInhalt}
        className="absolute inset-x-0 bottom-6 mx-auto flex w-12 justify-center rounded-full py-1 text-creme/80 transition-colors hover:text-creme focus:outline-none focus-visible:ring-2 focus-visible:ring-creme"
      >
        <svg
          className="scroll-nudge h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
