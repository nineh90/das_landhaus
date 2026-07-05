/**
 * Gemeinsame, serverfähige UI-Bausteine & Style-Konstanten für den Admin-Bereich.
 * (Keine Hooks → kann in Server- wie Client-Komponenten genutzt werden.)
 */
import type { UseFormRegisterReturn } from "react-hook-form";

export const inputKlasse =
  "w-full rounded-lg border border-tinte/15 bg-white px-3 py-2 text-tinte shadow-sm outline-none transition-colors focus:border-akzent focus:ring-2 focus:ring-akzent/30";

export const selectKlasse = inputKlasse;

export const textareaKlasse = `${inputKlasse} min-h-[7rem] leading-relaxed`;

export const primaerBtn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-akzent px-5 py-2.5 font-semibold text-creme transition-colors hover:bg-akzent-dark disabled:cursor-not-allowed disabled:opacity-60";

export const sekundaerBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-tinte/20 px-5 py-2.5 font-semibold text-tinte transition-colors hover:bg-tinte/5 disabled:opacity-60";

export const gefahrBtn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60";

/** Beschriftetes Formularfeld mit optionalem Hinweis und Fehlermeldung. */
export function Feld({
  label,
  htmlFor,
  error,
  hint,
  pflicht,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  pflicht?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-tinte">
        {label}
        {pflicht && <span className="text-akzent"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-tinte/50">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

/** Seitenkopf mit Titel, optionaler Beschreibung und Aktions-Slot (rechts). */
export function AdminSeitenkopf({
  titel,
  beschreibung,
  children,
}: {
  titel: string;
  beschreibung?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl text-tinte">{titel}</h1>
        {beschreibung && <p className="mt-1 text-tinte/60">{beschreibung}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

/**
 * Toggle-Schalter für Ja/Nein-Felder (z. B. „Verfügbar", „Veröffentlicht").
 * Rein CSS über `peer`; die echte Checkbox bleibt erhalten (Screenreader +
 * react-hook-form via `feld={register(...)}`).
 */
export function Schalter({
  label,
  beschreibung,
  feld,
}: {
  label: string;
  beschreibung?: string;
  feld: UseFormRegisterReturn;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-tinte/10 bg-white px-4 py-3 shadow-sm transition-colors hover:border-tinte/20">
      <span>
        <span className="block text-sm font-semibold text-tinte">{label}</span>
        {beschreibung && <span className="mt-0.5 block text-xs text-tinte/50">{beschreibung}</span>}
      </span>
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" {...feld} />
        <span className="h-6 w-11 rounded-full bg-tinte/20 transition-colors peer-checked:bg-akzent peer-focus-visible:ring-2 peer-focus-visible:ring-akzent/40 peer-focus-visible:ring-offset-2" />
        <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

/** Weiße Inhaltskarte mit dezentem Rahmen/Schatten. */
export function Karte({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-tinte/10 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

/** Freundlicher Leerzustand: Icon, Titel, Hinweis und optionaler CTA. */
export function LeerZustand({
  icon,
  titel,
  text,
  cta,
}: {
  icon?: React.ReactNode;
  titel: string;
  text?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-tinte/20 bg-white/60 px-6 py-12 text-center">
      {icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-akzent/10 text-akzent">
          {icon}
        </span>
      )}
      <p className="font-display text-lg text-tinte">{titel}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-tinte/55">{text}</p>}
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
