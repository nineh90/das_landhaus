"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bildSchema, BILD_BEREICHE, BILD_BEREICH_LABEL } from "@/lib/schemas";
import {
  Feld,
  inputKlasse,
  primaerBtn,
  sekundaerBtn,
  selectKlasse,
} from "@/components/admin/ui";
import type { FormErgebnis } from "@/app/admin/(app)/galerie/actions";

// Eingabe = Formularwerte (Felder mit Default sind optional),
// Ausgabe = validierte Werte nach dem Resolver (alle Felder gesetzt).
type Eingabe = z.input<typeof bildSchema>;
type Ausgabe = z.output<typeof bildSchema>;

export default function BildFormular({
  standard,
  aktion,
  submitLabel,
}: {
  standard?: Partial<Eingabe>;
  aktion: (werte: Ausgabe) => Promise<FormErgebnis>;
  submitLabel: string;
}) {
  const router = useRouter();
  const [serverFehler, setServerFehler] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Eingabe, unknown, Ausgabe>({
    resolver: zodResolver(bildSchema),
    defaultValues: {
      url: "",
      alt: "",
      beschreibung: "",
      bereich: "essen",
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

      <Feld
        label="Bildpfad / URL"
        htmlFor="url"
        pflicht
        error={errors.url?.message}
        hint="Pfad zum Bild, z. B. /images/galerie/essen-burger.jpg (Datei muss unter /public liegen)"
      >
        <input id="url" className={inputKlasse} {...register("url")} />
      </Feld>

      <Feld
        label="Alt-Text"
        htmlFor="alt"
        error={errors.alt?.message}
        hint="Bildbeschreibung für Screenreader/SEO"
      >
        <input id="alt" className={inputKlasse} {...register("alt")} />
      </Feld>

      <Feld
        label="Beschreibung"
        htmlFor="beschreibung"
        error={errors.beschreibung?.message}
        hint="Kurze sichtbare Bildunterschrift in der Galerie"
      >
        <input id="beschreibung" className={inputKlasse} {...register("beschreibung")} />
      </Feld>

      <div className="grid gap-5 sm:grid-cols-2">
        <Feld label="Bereich" htmlFor="bereich" pflicht error={errors.bereich?.message}>
          <select id="bereich" className={selectKlasse} {...register("bereich")}>
            {BILD_BEREICHE.map((b) => (
              <option key={b} value={b}>
                {BILD_BEREICH_LABEL[b]}
              </option>
            ))}
          </select>
        </Feld>

        <Feld
          label="Reihenfolge"
          htmlFor="reihenfolge"
          error={errors.reihenfolge?.message}
          hint="Kleinere Zahl = weiter vorne"
        >
          <input
            id="reihenfolge"
            type="number"
            min="0"
            className={inputKlasse}
            {...register("reihenfolge", { valueAsNumber: true })}
          />
        </Feld>
      </div>

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
