"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zielLocales, localeNames, type ZielLocale } from "@/lib/i18n/config";
import type { FormErgebnis } from "@/app/(admin)/admin/(app)/speisekarte/actions";

/**
 * Inline-Editor für die Übersetzungen einer Kategorie-Überschrift (EN/NL).
 * Sitzt neben „umbenennen" in der Admin-Speisekarte; leer gelassene Sprachen
 * zeigen auf der Website weiterhin den deutschen Namen.
 */
export default function KategorieUebersetzen({
  vorhanden,
  aktion,
}: {
  /** Bereits gespeicherte Übersetzungen: locale → Name. */
  vorhanden: Partial<Record<ZielLocale, string>>;
  aktion: (werte: Partial<Record<ZielLocale, string>>) => Promise<FormErgebnis>;
}) {
  const router = useRouter();
  const [offen, setOffen] = useState(false);
  const [werte, setWerte] = useState<Partial<Record<ZielLocale, string>>>(vorhanden);
  const [fehler, setFehler] = useState<string>();
  const [pending, start] = useTransition();

  const gepflegt = zielLocales.filter((l) => vorhanden[l]?.trim());

  function speichern() {
    setFehler(undefined);
    start(async () => {
      const ergebnis = await aktion(werte);
      if (ergebnis?.fehler) {
        setFehler(ergebnis.fehler);
        return;
      }
      setOffen(false);
      router.refresh();
    });
  }

  if (!offen) {
    return (
      <button
        type="button"
        onClick={() => {
          setWerte(vorhanden);
          setFehler(undefined);
          setOffen(true);
        }}
        className="text-xs font-semibold text-tinte/40 underline decoration-dotted underline-offset-2 hover:text-akzent"
      >
        übersetzen
        {gepflegt.length > 0 && (
          <span className="ml-1 no-underline text-tinte/30">
            ({gepflegt.map((l) => l.toUpperCase()).join("·")})
          </span>
        )}
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {zielLocales.map((locale) => (
        <span key={locale} className="inline-flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase text-tinte/40" title={localeNames[locale]}>
            {locale}
          </span>
          <input
            value={werte[locale] ?? ""}
            onChange={(e) => setWerte((w) => ({ ...w, [locale]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                speichern();
              }
              if (e.key === "Escape") setOffen(false);
            }}
            className="w-40 rounded-md border border-tinte/20 bg-white px-2 py-1 text-sm text-tinte shadow-sm outline-none focus:border-akzent focus:ring-2 focus:ring-akzent/30"
          />
        </span>
      ))}
      <button
        type="button"
        disabled={pending}
        onClick={speichern}
        className="rounded-full bg-akzent px-3 py-1 text-xs font-semibold text-creme hover:bg-akzent-dark disabled:opacity-60"
      >
        {pending ? "…" : "Speichern"}
      </button>
      <button
        type="button"
        onClick={() => setOffen(false)}
        className="rounded-full border border-tinte/20 px-3 py-1 text-xs font-semibold text-tinte hover:bg-tinte/5"
      >
        Abbrechen
      </button>
      {fehler && <span className="text-xs font-medium text-red-600">{fehler}</span>}
    </span>
  );
}
