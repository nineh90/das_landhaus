"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import DruckLeiste from "@/components/admin/DruckLeiste";

/**
 * Bedienleiste über der druckbaren Speisekarte.
 *
 * Die Optionen leben bewusst in der URL (Query-Parameter) statt im Client-State:
 * Die Karte selbst bleibt dadurch reines Server-HTML aus der Datenbank — was
 * gedruckt wird, ist exakt das, was live auf der Website steht. Ein Lesezeichen
 * auf z. B. `?bereich=restaurant&spalten=2` reproduziert dieselbe Karte jederzeit.
 *
 * Leiste, Druck-Knopf und der Hinweis zum Druckdialog kommen aus DruckLeiste —
 * dieselbe Leiste trägt die Flyer-Ansicht.
 */

const inputKlasse =
  "rounded-lg border border-tinte/15 bg-white px-3 py-2 text-sm text-tinte shadow-sm outline-none transition-colors focus:border-akzent focus:ring-2 focus:ring-akzent/30";

function Auswahl({
  label,
  name,
  wert,
  optionen,
  onChange,
}: {
  label: string;
  name: string;
  wert: string;
  optionen: { wert: string; label: string }[];
  onChange: (name: string, wert: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-tinte/50">{label}</span>
      <select
        className={inputKlasse}
        value={wert}
        onChange={(e) => onChange(name, e.target.value)}
      >
        {optionen.map((o) => (
          <option key={o.wert} value={o.wert}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function DruckOptionen({
  bereich,
  sprache,
  spalten,
  beschreibungen,
  preise,
}: {
  bereich: string;
  sprache: string;
  spalten: string;
  beschreibungen: boolean;
  preise: boolean;
}) {
  const router = useRouter();
  const suchparameter = useSearchParams();
  const [laedt, starteUebergang] = useTransition();

  /** Setzt einen Query-Parameter und lädt die Seite serverseitig neu. */
  function setze(name: string, wert: string) {
    const params = new URLSearchParams(suchparameter.toString());
    params.set(name, wert);
    starteUebergang(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <DruckLeiste gedimmt={laedt}>
      <Auswahl
        label="Bereich"
        name="bereich"
        wert={bereich}
        onChange={setze}
        optionen={[
          { wert: "restaurant", label: "Restaurant" },
          { wert: "imbiss", label: "Imbiss" },
          { wert: "beide", label: "Beide (getrennte Seiten)" },
        ]}
      />

      <Auswahl
        label="Sprache"
        name="sprache"
        wert={sprache}
        onChange={setze}
        optionen={[
          { wert: "de", label: "Deutsch" },
          { wert: "en", label: "English" },
          { wert: "nl", label: "Nederlands" },
        ]}
      />

      <Auswahl
        label="Spalten"
        name="spalten"
        wert={spalten}
        onChange={setze}
        optionen={[
          { wert: "1", label: "1 – großzügig" },
          { wert: "2", label: "2 – kompakt" },
        ]}
      />

      <label className="flex items-center gap-2 pb-2.5 text-sm text-tinte">
        <input
          type="checkbox"
          checked={beschreibungen}
          onChange={(e) => setze("beschreibungen", e.target.checked ? "1" : "0")}
          className="h-4 w-4 accent-akzent"
        />
        Beschreibungen
      </label>

      <label className="flex items-center gap-2 pb-2.5 text-sm text-tinte">
        <input
          type="checkbox"
          checked={preise}
          onChange={(e) => setze("preise", e.target.checked ? "1" : "0")}
          className="h-4 w-4 accent-akzent"
        />
        Preise
      </label>

    </DruckLeiste>
  );
}
