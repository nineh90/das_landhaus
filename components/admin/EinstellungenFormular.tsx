"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { einstellungenSchema, EINSTELLUNG_FELDER } from "@/lib/schemas";
import { Feld, inputKlasse, textareaKlasse, primaerBtn } from "@/components/admin/ui";
import { useAdminToast } from "@/components/admin/Toast";
import type { SpeicherErgebnis } from "@/app/admin/(app)/einstellungen/actions";

// Eingabe = Formularwerte (Felder mit Default sind optional),
// Ausgabe = validierte Werte nach dem Resolver (alle Felder gesetzt).
type Eingabe = z.input<typeof einstellungenSchema>;
type Ausgabe = z.output<typeof einstellungenSchema>;

export default function EinstellungenFormular({
  standard,
  aktion,
}: {
  standard: Record<string, string>;
  aktion: (werte: Ausgabe) => Promise<SpeicherErgebnis>;
}) {
  const [status, setStatus] = useState<SpeicherErgebnis>({});
  const { zeigeErfolg } = useAdminToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Eingabe, unknown, Ausgabe>({
    resolver: zodResolver(einstellungenSchema),
    defaultValues: standard as Eingabe,
  });

  const onSubmit = handleSubmit(async (werte) => {
    setStatus({});
    const ergebnis = await aktion(werte);
    if (ergebnis.ok) zeigeErfolg("Einstellungen gespeichert.");
    else setStatus(ergebnis);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {status.fehler && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {status.fehler}
        </p>
      )}

      {EINSTELLUNG_FELDER.map((f) => (
        <Feld key={f.key} label={f.label} htmlFor={f.key}>
          {f.typ === "textarea" ? (
            <textarea
              id={f.key}
              className={textareaKlasse}
              {...register(f.key as keyof Eingabe)}
            />
          ) : (
            <input
              id={f.key}
              className={inputKlasse}
              {...register(f.key as keyof Eingabe)}
            />
          )}
        </Feld>
      ))}

      <div className="pt-2">
        <button type="submit" disabled={isSubmitting} className={primaerBtn}>
          {isSubmitting ? "Speichern…" : "Speichern"}
        </button>
      </div>
    </form>
  );
}
