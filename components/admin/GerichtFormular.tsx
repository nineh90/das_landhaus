"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gerichtSchema, GERICHT_BEREICHE } from "@/lib/schemas";
import {
  Feld,
  Schalter,
  inputKlasse,
  primaerBtn,
  sekundaerBtn,
  selectKlasse,
  textareaKlasse,
} from "@/components/admin/ui";
import type { FormErgebnis } from "@/app/(admin)/admin/(app)/speisekarte/actions";

// Eingabe = Formularwerte (Felder mit Default sind optional),
// Ausgabe = validierte Werte nach dem Resolver (alle Felder gesetzt).
type Eingabe = z.input<typeof gerichtSchema>;
type Ausgabe = z.output<typeof gerichtSchema>;

const BEREICH_LABEL: Record<(typeof GERICHT_BEREICHE)[number], string> = {
  restaurant: "Restaurant",
  imbiss: "Imbiss",
};

export default function GerichtFormular({
  standard,
  aktion,
  submitLabel,
  kategorien = [],
}: {
  standard?: Partial<Eingabe>;
  aktion: (werte: Ausgabe) => Promise<FormErgebnis>;
  submitLabel: string;
  /** Bereits vorhandene Kategorien als Eingabe-Vorschläge (Datalist). */
  kategorien?: string[];
}) {
  const router = useRouter();
  const [serverFehler, setServerFehler] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Eingabe, unknown, Ausgabe>({
    resolver: zodResolver(gerichtSchema),
    defaultValues: {
      name: "",
      beschreibung: "",
      preis: 0,
      kategorie: "",
      bereich: "restaurant",
      verfuegbar: true,
      bild: "",
      reihenfolge: 0,
      ...standard,
    },
  });

  const onSubmit = handleSubmit(async (werte) => {
    setServerFehler(undefined);
    const ergebnis = await aktion(werte);
    if (ergebnis?.fehler) setServerFehler(ergebnis.fehler);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {serverFehler && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {serverFehler}
        </p>
      )}

      <Feld label="Name" htmlFor="name" pflicht error={errors.name?.message}>
        <input id="name" className={inputKlasse} {...register("name")} />
      </Feld>

      <Feld label="Beschreibung" htmlFor="beschreibung" error={errors.beschreibung?.message}>
        <textarea id="beschreibung" className={textareaKlasse} {...register("beschreibung")} />
      </Feld>

      <div className="grid gap-5 sm:grid-cols-2">
        <Feld label="Preis (€)" htmlFor="preis" pflicht error={errors.preis?.message}>
          <input
            id="preis"
            type="number"
            step="0.01"
            min="0"
            className={inputKlasse}
            {...register("preis", { valueAsNumber: true })}
          />
        </Feld>

        <Feld label="Reihenfolge" htmlFor="reihenfolge" error={errors.reihenfolge?.message} hint="Kleinere Zahl = weiter oben in der Kategorie.">
          <input
            id="reihenfolge"
            type="number"
            min="0"
            className={inputKlasse}
            {...register("reihenfolge", { valueAsNumber: true })}
          />
        </Feld>

        <Feld
          label="Kategorie"
          htmlFor="kategorie"
          pflicht
          error={errors.kategorie?.message}
          hint="Vorhandene wählen oder neue eintippen (z. B. Antipasti, Schnitzel)."
        >
          <input
            id="kategorie"
            list="kategorie-vorschlaege"
            className={inputKlasse}
            autoComplete="off"
            {...register("kategorie")}
          />
          <datalist id="kategorie-vorschlaege">
            {kategorien.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
        </Feld>

        <Feld label="Bereich" htmlFor="bereich" pflicht error={errors.bereich?.message}>
          <select id="bereich" className={selectKlasse} {...register("bereich")}>
            {GERICHT_BEREICHE.map((b) => (
              <option key={b} value={b}>
                {BEREICH_LABEL[b]}
              </option>
            ))}
          </select>
        </Feld>
      </div>

      <Feld
        label="Bildpfad (optional)"
        htmlFor="bild"
        error={errors.bild?.message}
        hint="z. B. /images/galerie/essen-burger.jpg"
      >
        <input id="bild" className={inputKlasse} {...register("bild")} />
      </Feld>

      <Schalter
        label="Verfügbar"
        beschreibung="Auf der Website sichtbar"
        feld={register("verfuegbar")}
      />

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={isSubmitting} className={primaerBtn}>
          {isSubmitting ? "Speichern…" : submitLabel}
        </button>
        <button type="button" onClick={() => router.back()} className={sekundaerBtn}>
          Abbrechen
        </button>
      </div>
    </form>
  );
}
