"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FormErgebnis } from "@/app/(admin)/admin/(app)/speisekarte/actions";

/**
 * Kleiner Inline-Umbenenner für eine Kategorie-Überschrift. Öffnet auf Klick ein
 * Textfeld, ruft die (bereits an Bereich + alten Namen gebundene) Server-Action
 * und aktualisiert danach die Ansicht.
 */
export default function KategorieUmbenennen({
  aktuell,
  aktion,
}: {
  aktuell: string;
  aktion: (neu: string) => Promise<FormErgebnis>;
}) {
  const router = useRouter();
  const [offen, setOffen] = useState(false);
  const [wert, setWert] = useState(aktuell);
  const [fehler, setFehler] = useState<string>();
  const [pending, start] = useTransition();

  function speichern() {
    setFehler(undefined);
    start(async () => {
      const ergebnis = await aktion(wert);
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
          setWert(aktuell);
          setFehler(undefined);
          setOffen(true);
        }}
        className="text-xs font-semibold text-tinte/40 underline decoration-dotted underline-offset-2 hover:text-akzent"
      >
        umbenennen
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <input
        autoFocus
        value={wert}
        onChange={(e) => setWert(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            speichern();
          }
          if (e.key === "Escape") setOffen(false);
        }}
        className="rounded-md border border-tinte/20 bg-white px-2 py-1 text-sm text-tinte shadow-sm outline-none focus:border-akzent focus:ring-2 focus:ring-akzent/30"
      />
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
