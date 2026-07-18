"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { eventSchema } from "@/lib/schemas";
import {
  Feld,
  Schalter,
  inputKlasse,
  primaerBtn,
  sekundaerBtn,
  textareaKlasse,
} from "@/components/admin/ui";
import BildUploadFeld from "@/components/admin/BildUploadFeld";
import type { FormErgebnis } from "@/app/(admin)/admin/(app)/events/actions";

// Eingabe = Formularwerte (Felder mit Default sind optional),
// Ausgabe = validierte Werte nach dem Resolver (alle Felder gesetzt).
type Eingabe = z.input<typeof eventSchema>;
type Ausgabe = z.output<typeof eventSchema>;

export default function EventFormular({
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Eingabe, unknown, Ausgabe>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      titel: "",
      slug: "",
      beschreibung: "",
      datum: "",
      uhrzeit: "",
      eintritt: "",
      bild: "",
      veroeffentlicht: false,
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

      <Feld label="Titel" htmlFor="titel" pflicht error={errors.titel?.message}>
        <input id="titel" className={inputKlasse} {...register("titel")} />
      </Feld>

      <Feld
        label="Slug"
        htmlFor="slug"
        pflicht
        error={errors.slug?.message}
        hint="Nur Kleinbuchstaben, Zahlen, Bindestriche — Teil der URL, z. B. schlager-nacht"
      >
        <input id="slug" className={inputKlasse} {...register("slug")} />
      </Feld>

      <Feld label="Beschreibung" htmlFor="beschreibung" error={errors.beschreibung?.message}>
        <textarea id="beschreibung" className={textareaKlasse} {...register("beschreibung")} />
      </Feld>

      <div className="grid gap-5 sm:grid-cols-2">
        <Feld label="Datum" htmlFor="datum" pflicht error={errors.datum?.message}>
          <input id="datum" type="date" className={inputKlasse} {...register("datum")} />
        </Feld>

        <Feld
          label="Uhrzeit"
          htmlFor="uhrzeit"
          pflicht
          error={errors.uhrzeit?.message}
          hint='z. B. "20:00 Uhr"'
        >
          <input id="uhrzeit" className={inputKlasse} {...register("uhrzeit")} />
        </Feld>
      </div>

      <Feld
        label="Eintritt (optional)"
        htmlFor="eintritt"
        error={errors.eintritt?.message}
        hint='z. B. "8,00 €" oder "Eintritt frei"'
      >
        <input id="eintritt" className={inputKlasse} {...register("eintritt")} />
      </Feld>

      <BildUploadFeld
        ordner="events"
        initialeUrl={standard?.bild}
        onHochgeladen={(url) => setValue("bild", url, { shouldValidate: true, shouldDirty: true })}
      />

      <Feld
        label="Bildpfad (optional)"
        htmlFor="bild"
        error={errors.bild?.message}
        hint="Wird beim Hochladen automatisch gesetzt. Alternativ manuell: z. B. /images/kotten/event-amerikanischer-abend.jpg oder eine vollständige https-Adresse."
      >
        <input id="bild" className={inputKlasse} {...register("bild")} />
      </Feld>

      <Schalter
        label="Veröffentlicht"
        beschreibung="Auf der Website sichtbar"
        feld={register("veroeffentlicht")}
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
