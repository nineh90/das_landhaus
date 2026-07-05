import { cn } from "@/lib/utils";

/**
 * Sprach-Umschalter (DE / EN / NL).
 *
 * VORSCHAU-STAND: Deutsch ist aktiv, Englisch und Niederländisch sind bereits
 * sichtbar, aber noch nicht funktional („bald verfügbar"). Die eigentliche
 * Mehrsprachigkeit wird später verdrahtet (siehe i18n-Plan) — dann werden aus
 * den deaktivierten Buttons echte Locale-Links.
 */
const SPRACHEN = [
  { code: "DE", label: "Deutsch", aktiv: true },
  { code: "EN", label: "English", aktiv: false },
  { code: "NL", label: "Nederlands", aktiv: false },
] as const;

export default function LanguageSwitcher({ className }: { className?: string }) {
  return (
    <div
      role="group"
      aria-label="Sprache wählen"
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

      {SPRACHEN.map((s) =>
        s.aktiv ? (
          <span
            key={s.code}
            aria-current="true"
            title={s.label}
            className="rounded-full bg-akzent px-2.5 py-1 text-xs font-bold text-creme"
          >
            {s.code}
          </span>
        ) : (
          <button
            key={s.code}
            type="button"
            aria-disabled="true"
            title={`${s.label} — bald verfügbar`}
            className="cursor-not-allowed rounded-full px-2.5 py-1 text-xs font-semibold text-tinte/40 transition-colors hover:text-tinte/60"
          >
            {s.code}
          </button>
        ),
      )}
    </div>
  );
}
