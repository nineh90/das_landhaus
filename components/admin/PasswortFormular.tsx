"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwortAendernSchema } from "@/lib/schemas";
import { Feld, inputKlasse, primaerBtn } from "@/components/admin/ui";
import { useAdminToast } from "@/components/admin/Toast";
import type { PasswortErgebnis } from "@/app/admin/(app)/passwort/actions";

type Eingabe = z.input<typeof passwortAendernSchema>;
type Ausgabe = z.output<typeof passwortAendernSchema>;

export default function PasswortFormular({
  aktion,
}: {
  aktion: (werte: Ausgabe) => Promise<PasswortErgebnis>;
}) {
  const [status, setStatus] = useState<PasswortErgebnis>({});
  const { zeigeErfolg } = useAdminToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Eingabe, unknown, Ausgabe>({
    resolver: zodResolver(passwortAendernSchema),
    defaultValues: { aktuell: "", neu: "", wiederholung: "" },
  });

  const onSubmit = handleSubmit(async (werte) => {
    setStatus({});
    const ergebnis = await aktion(werte);
    if (ergebnis.ok) {
      zeigeErfolg("Passwort geändert.");
      reset();
    } else {
      setStatus(ergebnis);
    }
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

      <Feld label="Aktuelles Passwort" htmlFor="aktuell" pflicht error={errors.aktuell?.message}>
        <input
          id="aktuell"
          type="password"
          autoComplete="current-password"
          className={inputKlasse}
          {...register("aktuell")}
        />
      </Feld>

      <Feld label="Neues Passwort" htmlFor="neu" pflicht error={errors.neu?.message}>
        <input
          id="neu"
          type="password"
          autoComplete="new-password"
          className={inputKlasse}
          {...register("neu")}
        />
      </Feld>

      <Feld
        label="Neues Passwort wiederholen"
        htmlFor="wiederholung"
        pflicht
        error={errors.wiederholung?.message}
      >
        <input
          id="wiederholung"
          type="password"
          autoComplete="new-password"
          className={inputKlasse}
          {...register("wiederholung")}
        />
      </Feld>

      <button type="submit" disabled={isSubmitting} className={primaerBtn}>
        {isSubmitting ? "Speichern…" : "Passwort ändern"}
      </button>
    </form>
  );
}
