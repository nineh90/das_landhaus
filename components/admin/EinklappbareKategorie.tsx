"use client";

import { useState } from "react";

/**
 * Einklappbarer Kategorie-Block für die Admin-Speisekarte.
 *
 * Standardmäßig zugeklappt: So bleibt bei langen Karten der Überblick (nur Name
 * + Anzahl je Kategorie) und ganze Kategorien lassen sich kompakt umsortieren.
 * Der Kopf ist eine Aufklapp-Schaltfläche; das Umbenennen sitzt bewusst DANEBEN
 * (nicht im Button), damit ein Klick darauf nicht auf-/zuklappt. Die Gerichte-
 * Liste wird nur im offenen Zustand gerendert.
 *
 * Der Offen-Zustand liegt lokal und übersteht Server-Updates (z. B. ein Gericht
 * sichtbar/versteckt schalten), weil der Block über seinen Kategorie-Namen stabil
 * an derselben Position bleibt.
 */
export default function EinklappbareKategorie({
  kategorie,
  anzahl,
  umbenennen,
  children,
  standardOffen = false,
}: {
  kategorie: string;
  anzahl: number;
  /** Slot für die Umbenennen-Aktion (bleibt außerhalb des Aufklapp-Buttons). */
  umbenennen: React.ReactNode;
  children: React.ReactNode;
  standardOffen?: boolean;
}) {
  const [offen, setOffen] = useState(standardOffen);

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => setOffen((o) => !o)}
          aria-expanded={offen}
          className="group flex items-center gap-2 rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-akzent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`size-4 shrink-0 text-tinte/40 transition-transform duration-200 group-hover:text-tinte/70 ${
              offen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span className="text-sm font-semibold uppercase tracking-wide text-akzent">
            {kategorie}
          </span>
          <span className="text-xs font-normal normal-case tracking-normal text-tinte/40">
            ({anzahl})
          </span>
        </button>
        {umbenennen}
      </div>
      {offen && children}
    </div>
  );
}
