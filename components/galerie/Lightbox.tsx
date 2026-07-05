"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalerieGruppe } from "@/lib/content";

/**
 * Nach Bereichen gruppiertes Bild-Raster mit Vollbild-Lightbox.
 * Einzige Interaktivität der Galerie → bewusst als Client Component isoliert.
 *
 * Die Gruppen werden zu einer flachen Liste zusammengeführt, damit sich die
 * Lightbox gruppenübergreifend durchblättern lässt (Pfeile / ← →).
 */
export default function Lightbox({ gruppen }: { gruppen: GalerieGruppe[] }) {
  const flach = gruppen.flatMap((g) => g.bilder);
  const [index, setIndex] = useState<number | null>(null);

  const schliessen = useCallback(() => setIndex(null), []);
  const weiter = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % flach.length)),
    [flach.length],
  );
  const zurueck = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + flach.length) % flach.length)),
    [flach.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") schliessen();
      if (e.key === "ArrowRight") weiter();
      if (e.key === "ArrowLeft") zurueck();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, schliessen, weiter, zurueck]);

  return (
    <>
      <div className="space-y-12">
        {gruppen.map((gruppe, gi) => {
          // Startindex dieser Gruppe in der flachen Liste (für die globale
          // Lightbox-Navigation) — ohne Mutation berechnet.
          const start = gruppen.slice(0, gi).reduce((n, g) => n + g.bilder.length, 0);
          return (
            <section key={gruppe.label || start}>
              {gruppe.label && (
                <h2 className="mb-4 font-serif text-2xl text-tinte">{gruppe.label}</h2>
              )}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {gruppe.bilder.map((bild, i) => (
                  <button
                    key={bild.id}
                    type="button"
                    onClick={() => setIndex(start + i)}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-creme-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-akzent"
                  >
                    <Image
                      src={bild.url}
                      alt={bild.alt ?? ""}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {bild.beschreibung && (
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-tinte/80 to-transparent p-2 text-left text-xs text-creme opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm">
                        {bild.beschreibung}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-tinte/90 p-4"
          onClick={schliessen}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Schließen"
            onClick={schliessen}
            className="absolute right-4 top-4 text-3xl text-creme"
          >
            ×
          </button>
          <button
            type="button"
            aria-label="Vorheriges Bild"
            onClick={(e) => {
              e.stopPropagation();
              zurueck();
            }}
            className="absolute left-4 text-4xl text-creme/80 hover:text-creme"
          >
            ‹
          </button>
          <div
            className="relative flex h-[80vh] w-[90vw] max-w-4xl flex-col items-center justify-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-0 w-full flex-1">
              <Image
                src={flach[index].url}
                alt={flach[index].alt ?? ""}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {flach[index].beschreibung && (
              <p className="text-center text-sm text-creme sm:text-base">
                {flach[index].beschreibung}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Nächstes Bild"
            onClick={(e) => {
              e.stopPropagation();
              weiter();
            }}
            className="absolute right-4 text-4xl text-creme/80 hover:text-creme"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
