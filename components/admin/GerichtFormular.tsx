"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gerichtSchema, GERICHT_BEREICHE, ALLERGENE, ZUSATZSTOFFE } from "@/lib/schemas";
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
    watch,
    setValue,
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
      allergene: [],
      zusatzstoffe: [],
      ...standard,
    },
  });

  // Allergene/Zusatzstoffe werden als String-Arrays gepflegt (Chip-Auswahl statt
  // klassischem Input) — daher watch/setValue statt register.
  const allergene = watch("allergene") ?? [];
  const zusatzstoffe = watch("zusatzstoffe") ?? [];
  const umschalten = (feld: "allergene" | "zusatzstoffe", code: string) => {
    const aktuell = (feld === "allergene" ? allergene : zusatzstoffe) as string[];
    const neu = aktuell.includes(code)
      ? aktuell.filter((c) => c !== code)
      : [...aktuell, code];
    setValue(feld, neu as never, { shouldDirty: true });
  };

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

      <Feld
        label="Allergene"
        hint="Zutreffende Allergene antippen (die 14 Hauptallergene nach LMIV)."
      >
        <div className="flex flex-wrap gap-2">
          {ALLERGENE.map((a) => {
            const aktiv = allergene.includes(a.code);
            return (
              <button
                key={a.code}
                type="button"
                onClick={() => umschalten("allergene", a.code)}
                aria-pressed={aktiv}
                title={a.label}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                  aktiv
                    ? "border-akzent bg-akzent text-creme"
                    : "border-tinte/15 bg-white text-tinte/70 hover:border-akzent"
                }`}
              >
                <span className="opacity-70">{a.kuerzel}</span>
                <span>{a.label}</span>
              </button>
            );
          })}
        </div>
      </Feld>

      <Feld
        label="Zusatzstoffe"
        hint="Kennzeichnungspflichtige Zusatzstoffe — nur antippen, was tatsächlich zutrifft."
      >
        <div className="flex flex-wrap gap-2">
          {ZUSATZSTOFFE.map((z) => {
            const aktiv = zusatzstoffe.includes(z.code);
            return (
              <button
                key={z.code}
                type="button"
                onClick={() => umschalten("zusatzstoffe", z.code)}
                aria-pressed={aktiv}
                title={z.label}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                  aktiv
                    ? "border-akzent bg-akzent text-creme"
                    : "border-tinte/15 bg-white text-tinte/70 hover:border-akzent"
                }`}
              >
                <span className="opacity-70">{z.kuerzel}</span>
                <span>{z.label}</span>
              </button>
            );
          })}
        </div>
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
