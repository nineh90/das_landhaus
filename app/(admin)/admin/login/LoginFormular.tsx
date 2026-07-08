"use client";

import { useActionState } from "react";
import { anmelden } from "./actions";
import { Feld, inputKlasse, primaerBtn } from "@/components/admin/ui";

export default function LoginFormular() {
  const [status, formAction, pending] = useActionState(anmelden, {});

  return (
    <form action={formAction} className="space-y-4">
      {status.fehler && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
        >
          {status.fehler}
        </p>
      )}

      <Feld label="E-Mail" htmlFor="email" pflicht>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputKlasse}
        />
      </Feld>

      <Feld label="Passwort" htmlFor="passwort" pflicht>
        <input
          id="passwort"
          name="passwort"
          type="password"
          autoComplete="current-password"
          required
          className={inputKlasse}
        />
      </Feld>

      <button type="submit" disabled={pending} className={`${primaerBtn} w-full`}>
        {pending ? "Anmelden…" : "Anmelden"}
      </button>
    </form>
  );
}
