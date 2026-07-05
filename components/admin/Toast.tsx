"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ToastKontext = { zeigeErfolg: (text?: string) => void };

const Kontext = createContext<ToastKontext | null>(null);

/** Erfolgs-Toast aus einer Client-Komponente auslösen. */
export function useAdminToast(): ToastKontext {
  const ctx = useContext(Kontext);
  if (!ctx) throw new Error("useAdminToast muss innerhalb von AdminToastProvider genutzt werden.");
  return ctx;
}

/**
 * Admin-weiter Erfolgs-Toast (fixe Position, blendet sich selbst aus).
 *
 * Zwei Wege lösen ihn aus:
 * 1. Direkt über `useAdminToast().zeigeErfolg()` (Formulare, die auf der Seite
 *    bleiben — z. B. Einstellungen, Passwort).
 * 2. Über den Redirect-Parameter `?gespeichert=1` (Formulare, die nach dem
 *    Speichern zur Liste weiterleiten — z. B. Speisekarte, Events, Galerie).
 */
export default function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [nachricht, setNachricht] = useState<string | null>(null);

  const zeigeErfolg = useCallback((text = "Gespeichert.") => setNachricht(text), []);

  // Nach einigen Sekunden automatisch ausblenden.
  useEffect(() => {
    if (!nachricht) return;
    const t = setTimeout(() => setNachricht(null), 3500);
    return () => clearTimeout(t);
  }, [nachricht]);

  // Flash aus Redirect übernehmen (Anpassung während des Renderns statt im Effect).
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const flash = params.get("gespeichert");
  const [letzterFlash, setLetzterFlash] = useState<string | null>(null);
  if (flash !== letzterFlash) {
    setLetzterFlash(flash);
    if (flash) setNachricht(flash === "1" ? "Gespeichert." : flash);
  }

  // Parameter aus der URL entfernen, sobald übernommen (kein setState hier).
  useEffect(() => {
    if (!flash) return;
    const rest = new URLSearchParams(Array.from(params.entries()));
    rest.delete("gespeichert");
    const qs = rest.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [flash, params, pathname, router]);

  return (
    <Kontext.Provider value={{ zeigeErfolg }}>
      {children}
      {nachricht && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
          <div
            role="status"
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-wald px-5 py-3 text-sm font-semibold text-creme shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0z"
                clipRule="evenodd"
              />
            </svg>
            {nachricht}
            <button
              type="button"
              onClick={() => setNachricht(null)}
              aria-label="Schließen"
              className="-mr-1 ml-1 text-lg leading-none text-creme/70 hover:text-creme"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </Kontext.Provider>
  );
}
