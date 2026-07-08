"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { locales, localeNames, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Sprach-Umschalter (DE / EN / NL).
 *
 * Wechselt die Sprache und erhält dabei den aktuellen Pfad: aus `/en/restaurant` wird
 * `/nl/restaurant`. Die aktive Sprache ist hervorgehoben, die übrigen sind echte Links.
 */
export default function LanguageSwitcher({
  current,
  label,
  className,
}: {
  current: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();

  // Pfad ohne führendes Locale-Segment: /en/restaurant → /restaurant, /de → ""
  const segments = pathname.split("/");
  const rest = segments.length > 1 && isLocale(segments[1]) ? "/" + segments.slice(2).join("/") : pathname;
  const restPath = rest === "/" ? "" : rest.replace(/\/$/, "");

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-creme-dark bg-creme/70 p-0.5",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-1.5 h-4 w-4 shrink-0 text-tinte/50"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
      </svg>

      {locales.map((loc) =>
        loc === current ? (
          <span
            key={loc}
            aria-current="true"
            title={localeNames[loc]}
            className="rounded-full bg-akzent px-2.5 py-1 text-xs font-bold text-creme"
          >
            {loc.toUpperCase()}
          </span>
        ) : (
          <Link
            key={loc}
            href={`/${loc}${restPath}`}
            hrefLang={loc}
            title={localeNames[loc]}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-tinte/60 transition-colors hover:bg-creme-dark hover:text-tinte"
          >
            {loc.toUpperCase()}
          </Link>
        ),
      )}
    </div>
  );
}
