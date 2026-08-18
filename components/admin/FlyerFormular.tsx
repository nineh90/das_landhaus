"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { flyerSchema } from "@/lib/schemas";
import {
  Feld,
  Karte,
  Schalter,
  gefahrBtn,
  inputKlasse,
  primaerBtn,
  sekundaerBtn,
  textareaKlasse,
} from "@/components/admin/ui";
import BildUploadFeld from "@/components/admin/BildUploadFeld";
import type { FormErgebnis } from "@/app/(admin)/admin/(app)/flyer/actions";

// Eingabe = Formularwerte (Felder mit Default sind optional),
// Ausgabe = validierte Werte nach dem Resolver (alle Felder gesetzt).
type Eingabe = z.input<typeof flyerSchema>;
type Ausgabe = z.output<typeof flyerSchema>;

export default function FlyerFormular({
  standard,
  aktion,
  submitLabel,
  vorschauHref,
}: {
  standard?: Partial<Eingabe>;
  aktion: (werte: Ausgabe) => Promise<FormErgebnis>;
  submitLabel: string;
  /** Nur beim Bearbeiten: Link zur Druckansicht des gespeicherten Stands. */
  vorschauHref?: string;
}) {
  const router = useRouter();
  const [serverFehler, setServerFehler] = useState<string>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Eingabe, unknown, Ausgabe>({
    resolver: zodResolver(flyerSchema),
    defaultValues: {
      titel: "",
      ueberschrift: "Herzlich willkommen",
      unterzeile: "",
      vorwort: "",
      grussformel: "",
      bild: "",
      aktionen: [],
      mitEvents: false,
      mitOeffnungszeiten: false,
      gueltigVon: "",
      gueltigBis: "",
      ...standard,
    },
  });

  // Aktionsblöcke sind eine variable Liste: die Reihenfolge im Formular ist die
  // gedruckte Reihenfolge (die Server-Action hält sie als Index fest).
  const { fields, append, remove, move } = useFieldArray({ control, name: "aktionen" });

  const onSubmit = handleSubmit(async (werte) => {
    setServerFehler(undefined);
    const ergebnis = await aktion(werte);
    if (ergebnis?.fehler) setServerFehler(ergebnis.fehler);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {serverFehler && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {serverFehler}
        </p>
      )}

      <Karte className="space-y-5">
        <Feld
          label="Bezeichnung (intern)"
          htmlFor="titel"
          pflicht
          error={errors.titel?.message}
          hint="Nur für diese Liste, steht nicht auf dem Blatt — z. B. „Vorwort Karte 2026“."
        >
          <input id="titel" className={inputKlasse} {...register("titel")} />
        </Feld>

        <div className="grid gap-5 sm:grid-cols-2">
          <Feld
            label="Überschrift"
            htmlFor="ueberschrift"
            pflicht
            error={errors.ueberschrift?.message}
            hint="Steht im Kopf an der Stelle, an der auf der Karte „Restaurant“ steht."
          >
            <input id="ueberschrift" className={inputKlasse} {...register("ueberschrift")} />
          </Feld>

          <Feld
            label="Unterzeile (optional)"
            htmlFor="unterzeile"
            error={errors.unterzeile?.message}
            hint='z. B. "Restaurant · Imbiss · Der Kotten"'
          >
            <input id="unterzeile" className={inputKlasse} {...register("unterzeile")} />
          </Feld>
        </div>

        <Feld
          label="Vorwort / Text (optional)"
          htmlFor="vorwort"
          error={errors.vorwort?.message}
          hint="Absätze durch eine Leerzeile trennen. Als Einlage in die gedruckte Karte: 2–3 kurze Absätze wirken am besten."
        >
          <textarea
            id="vorwort"
            rows={10}
            className={textareaKlasse}
            {...register("vorwort")}
          />
        </Feld>

        <Feld
          label="Grußformel (optional)"
          htmlFor="grussformel"
          error={errors.grussformel?.message}
          hint='Wird in der Schreibschrift des Logos gesetzt — z. B. "Ihre Familie Çalışkan"'
        >
          <input id="grussformel" className={inputKlasse} {...register("grussformel")} />
        </Feld>
      </Karte>

      <Karte className="space-y-5">
        <div>
          <h2 className="font-display text-lg text-tinte">Bild (optional)</h2>
          <p className="mt-1 text-sm text-tinte/55">
            Ein großes Foto unter dem Text — vor allem für Event-Flyer. Für ein reines Vorwort
            besser leer lassen: Text wirkt auf Papier ruhiger.
          </p>
        </div>

        <BildUploadFeld
          ordner="flyer"
          id="flyer-bild"
          initialeUrl={standard?.bild}
          onHochgeladen={(url) => setValue("bild", url, { shouldValidate: true, shouldDirty: true })}
        />

        <Feld
          label="Bildpfad"
          htmlFor="bild"
          error={errors.bild?.message}
          hint="Wird beim Hochladen automatisch gesetzt. Alternativ ein vorhandenes Bild, z. B. /images/galerie/essen-schnitzel.jpg"
        >
          <input id="bild" className={inputKlasse} {...register("bild")} />
        </Feld>
      </Karte>

      <Karte className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-tinte">Aktionen & Hinweise</h2>
            <p className="mt-1 text-sm text-tinte/55">
              Je Aktion ein Block auf dem Blatt: Titel, Zeitraum/Preis und optional ein Satz dazu.
            </p>
          </div>
          {fields.length < 8 && (
            <button
              type="button"
              onClick={() => append({ titel: "", hinweis: "", text: "", bild: "" })}
              className={sekundaerBtn}
            >
              + Aktion
            </button>
          )}
        </div>

        {fields.length === 0 ? (
          <p className="rounded-xl border border-dashed border-tinte/20 px-4 py-6 text-center text-sm text-tinte/50">
            Noch keine Aktion — für ein reines Vorwort ist das genau richtig.
          </p>
        ) : (
          <ul className="space-y-4">
            {fields.map((feld, i) => (
              <li key={feld.id} className="space-y-4 rounded-xl border border-tinte/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-tinte/45">
                    Aktion {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    {/* Hoch/Runter statt Drag & Drop: bei höchstens acht Blöcken
                        ist es das einfachere Mittel und funktioniert auch mit
                        Tastatur. */}
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      title="Nach oben"
                      className="rounded-full border border-tinte/15 px-2.5 py-1 text-sm text-tinte hover:bg-tinte/5 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === fields.length - 1}
                      title="Nach unten"
                      className="rounded-full border border-tinte/15 px-2.5 py-1 text-sm text-tinte hover:bg-tinte/5 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className={`${gefahrBtn} ml-2`}
                    >
                      Entfernen
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Feld
                    label="Titel"
                    htmlFor={`aktion-${i}-titel`}
                    pflicht
                    error={errors.aktionen?.[i]?.titel?.message}
                  >
                    <input
                      id={`aktion-${i}-titel`}
                      className={inputKlasse}
                      {...register(`aktionen.${i}.titel`)}
                    />
                  </Feld>

                  <Feld
                    label="Zeitraum / Preis (optional)"
                    htmlFor={`aktion-${i}-hinweis`}
                    error={errors.aktionen?.[i]?.hinweis?.message}
                    hint='z. B. "Di–Fr 11:30–14:00 · 9,90 €"'
                  >
                    <input
                      id={`aktion-${i}-hinweis`}
                      className={inputKlasse}
                      {...register(`aktionen.${i}.hinweis`)}
                    />
                  </Feld>
                </div>

                <Feld
                  label="Text (optional)"
                  htmlFor={`aktion-${i}-text`}
                  error={errors.aktionen?.[i]?.text?.message}
                >
                  <textarea
                    id={`aktion-${i}-text`}
                    rows={3}
                    className={textareaKlasse}
                    {...register(`aktionen.${i}.text`)}
                  />
                </Feld>

                <BildUploadFeld
                  ordner="flyer"
                  id={`aktion-${i}-bild`}
                  label="Foto (optional)"
                  kompakt
                  initialeUrl={watch(`aktionen.${i}.bild`) ?? ""}
                  onHochgeladen={(url) =>
                    setValue(`aktionen.${i}.bild`, url, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                />
                <input type="hidden" {...register(`aktionen.${i}.bild`)} />
              </li>
            ))}
          </ul>
        )}
      </Karte>

      <Karte className="space-y-5">
        <div>
          <h2 className="font-display text-lg text-tinte">Automatische Bausteine</h2>
          <p className="mt-1 text-sm text-tinte/55">
            Ziehen ihre Inhalte aus Events und Einstellungen — nichts davon wird hier doppelt
            erfasst. Kopf und Kontakt-Abbinder stehen immer auf dem Blatt.
          </p>
        </div>

        <Schalter
          label="Kommende Events"
          beschreibung="Die nächsten veröffentlichten Events aus der Datenbank"
          feld={register("mitEvents")}
        />

        <Schalter
          label="Öffnungszeiten"
          beschreibung="Restaurant, Imbiss und Der Kotten aus den Einstellungen"
          feld={register("mitOeffnungszeiten")}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Feld
            label="Aktionen gültig von (optional)"
            htmlFor="gueltigVon"
            error={errors.gueltigVon?.message}
          >
            <input id="gueltigVon" type="date" className={inputKlasse} {...register("gueltigVon")} />
          </Feld>

          <Feld
            label="gültig bis (optional)"
            htmlFor="gueltigBis"
            error={errors.gueltigBis?.message}
            hint="Wird als Gültigkeitshinweis mitgedruckt, sobald gesetzt."
          >
            <input id="gueltigBis" type="date" className={inputKlasse} {...register("gueltigBis")} />
          </Feld>
        </div>
      </Karte>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={isSubmitting} className={primaerBtn}>
          {isSubmitting ? "Speichern…" : submitLabel}
        </button>
        {vorschauHref && (
          <Link href={vorschauHref} className={sekundaerBtn}>
            Vorschau (gespeicherter Stand)
          </Link>
        )}
        <button type="button" onClick={() => router.back()} className={sekundaerBtn}>
          Abbrechen
        </button>
      </div>
    </form>
  );
}
