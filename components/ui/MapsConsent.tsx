"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Speicherort der Einwilligung — bewusst localStorage (kein Cookie, kein Server-Roundtrip). */
const SPEICHER_KEY = "landhaus:maps-consent";

/* ------- localStorage als externer Store (statt setState im Effect) ------- */

const zuhoerer = new Set<() => void>();

function abonniere(melden: () => void) {
  zuhoerer.add(melden);
  // `storage` feuert nur in ANDEREN Tabs — dort bleibt die Karte so synchron.
  window.addEventListener("storage", melden);
  return () => {
    zuhoerer.delete(melden);
    window.removeEventListener("storage", melden);
  };
}

function leseEinwilligung(): boolean {
  try {
    return localStorage.getItem(SPEICHER_KEY) === "ja";
  } catch {
    // Privater Modus / Speicher gesperrt: gilt als „nicht eingewilligt".
    return false;
  }
}

function speichereEinwilligung(erteilt: boolean) {
  try {
    if (erteilt) localStorage.setItem(SPEICHER_KEY, "ja");
    else localStorage.removeItem(SPEICHER_KEY);
  } catch {
    // Nicht speicherbar — die Einwilligung gilt dann nur für diesen Seitenaufruf.
  }
  zuhoerer.forEach((melden) => melden());
}

export type MapsConsentTexte = {
  titel: string;
  text: string;
  laden: string;
  merken: string;
  extern: string;
  widerrufen: string;
  datenschutz: string;
};

/**
 * Zwei-Klick-Lösung für die Google-Maps-Einbettung (DSGVO).
 *
 * Ohne Einwilligung wird KEIN iframe gerendert — es entsteht also keine Verbindung
 * zu Google und es fließen weder IP-Adresse noch Gerätedaten ab. Erst der Klick auf
 * „Karte laden" hängt das iframe in den DOM.
 *
 * Die Einwilligung gilt standardmäßig nur für den aktuellen Seitenaufruf; auf Wunsch
 * (Checkbox) wird sie im Browser gemerkt. Gemerkte Einwilligung ist jederzeit über
 * „Karte wieder sperren" widerrufbar — Art. 7 Abs. 3 DSGVO verlangt, dass der
 * Widerruf so einfach ist wie die Erteilung.
 *
 * Der Link zu Google Maps funktioniert auch ohne JavaScript und ohne Einwilligung,
 * weil er erst beim bewussten Klick des Nutzers zu Google führt.
 */
export default function MapsConsent({
  src,
  iframeTitel,
  texte,
  datenschutzHref,
  externHref,
  className,
}: {
  src: string;
  iframeTitel: string;
  texte: MapsConsentTexte;
  /** Interner Link zur Datenschutzerklärung (bereits lokalisiert). */
  datenschutzHref: string;
  /** Google-Maps-Link zum Öffnen in einem neuen Tab (Alternative zur Einbettung). */
  externHref: string;
  className?: string;
}) {
  // Der Server-Snapshot ist bewusst `false`: Server-Render und erster Client-Render
  // zeigen beide den Platzhalter, sonst gäbe es einen Hydration-Mismatch.
  const gemerkt = useSyncExternalStore(abonniere, leseEinwilligung, () => false);
  const [nurDieseSitzung, setNurDieseSitzung] = useState(false);
  const [merken, setMerken] = useState(true);
  const geladen = gemerkt || nurDieseSitzung;

  function karteLaden() {
    if (merken) speichereEinwilligung(true);
    // Immer auch für diesen Seitenaufruf freischalten — sonst bliebe die Karte
    // gesperrt, wenn der Browser das Speichern verweigert (privater Modus).
    setNurDieseSitzung(true);
  }

  function widerrufen() {
    speichereEinwilligung(false);
    setNurDieseSitzung(false);
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {geladen ? (
        <iframe
          src={src}
          title={iframeTitel}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="min-h-0 w-full flex-1 rounded-2xl border-0"
          style={{ minHeight: "320px" }}
        />
      ) : (
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-wald/15 bg-creme-dark/70 p-6 text-center">
          <p className="font-display text-lg text-wald-dark">{texte.titel}</p>
          <p className="max-w-md text-sm leading-relaxed text-tinte/75">
            {texte.text}{" "}
            <Link href={datenschutzHref} className="font-semibold text-akzent-dark hover:underline">
              {texte.datenschutz}
            </Link>
          </p>

          <button
            type="button"
            onClick={karteLaden}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-akzent px-6 py-3 text-base font-semibold text-creme transition-colors hover:bg-akzent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-akzent focus-visible:ring-offset-2"
          >
            {texte.laden}
          </button>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-tinte/70">
            <input
              type="checkbox"
              checked={merken}
              onChange={(e) => setMerken(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-akzent)]"
            />
            {texte.merken}
          </label>

          <a
            href={externHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-akzent-dark hover:underline"
          >
            {texte.extern}
          </a>
        </div>
      )}

      {/* Widerruf nur bei gemerkter Einwilligung — helle Pille, damit der Link auch
          auf der dunkelgrünen Startseiten-Sektion lesbar bleibt. */}
      {geladen && gemerkt && (
        <button
          type="button"
          onClick={widerrufen}
          className="mt-2 self-end rounded-full bg-creme/85 px-3 py-1 text-xs text-tinte/70 transition-colors hover:text-akzent-dark"
        >
          {texte.widerrufen}
        </button>
      )}
    </div>
  );
}
