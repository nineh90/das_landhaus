"use client";

import { useTransition } from "react";

/**
 * Button, der eine (bereits gebundene) Server-Action auslöst — für Löschen,
 * Sichtbarkeit umschalten, Reihenfolge ändern etc. Optional mit Rückfrage.
 *
 * Beispiel:  <ServerAktionButton action={loescheGericht.bind(null, id)}
 *              bestaetigung="Gericht wirklich löschen?" className={gefahrBtn}>
 *              Löschen
 *            </ServerAktionButton>
 */
export default function ServerAktionButton({
  action,
  children,
  className,
  bestaetigung,
  title,
}: {
  action: () => Promise<unknown>;
  children: React.ReactNode;
  className?: string;
  bestaetigung?: string;
  title?: string;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      title={title}
      disabled={pending}
      onClick={() => {
        if (bestaetigung && !window.confirm(bestaetigung)) return;
        start(async () => {
          await action();
        });
      }}
      className={className}
    >
      {pending ? "…" : children}
    </button>
  );
}
