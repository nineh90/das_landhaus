"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Warnmarke „Ende Seite 1" — erscheint NUR, wenn der Flyer nicht auf eine Seite
 * passt.
 *
 * Ein Flyer ist ein einseitiges Blatt. Ob der Inhalt passt, weiß erst der
 * Browser, nachdem er ihn gesetzt hat — deshalb wird hier gemessen statt
 * geraten: Blattbreite entspricht 210 mm, daraus ergibt sich der Maßstab, und
 * damit die Inhaltshöhe in Millimetern. Bleibt sie unter der nutzbaren Höhe,
 * rendert die Komponente nichts; eine leere Restfläche soll die Vorschau nicht
 * mit sich herumtragen.
 */

/** A4-Höhe minus die 2 × 14 mm Druckrand aus `@page` (siehe druckRahmenCss). */
const NUTZBARE_HOEHE_MM = 297 - 28;

export default function DruckSeitenende() {
  const anker = useRef<HTMLDivElement>(null);
  const [zeigen, setZeigen] = useState(false);

  useEffect(() => {
    const blatt = anker.current?.closest<HTMLElement>(".druck-blatt");
    if (!blatt) return;

    const pruefen = () => {
      const rect = blatt.getBoundingClientRect();
      if (!rect.width) return;
      const mmProPx = 210 / rect.width; // das Blatt ist am Bildschirm 210 mm breit
      const stil = getComputedStyle(blatt);
      const innen =
        rect.height - parseFloat(stil.paddingTop) - parseFloat(stil.paddingBottom);
      setZeigen(innen * mmProPx > NUTZBARE_HOEHE_MM);
    };

    pruefen();
    // Schriften laden nach, Bilder auch — beides ändert die Höhe im Nachhinein.
    const beobachter = new ResizeObserver(pruefen);
    beobachter.observe(blatt);
    return () => beobachter.disconnect();
  }, []);

  return (
    <div ref={anker} className="druck-seitenende-anker" aria-hidden="true">
      {zeigen && (
        <div className="druck-seitenende">
          <span>Ende Seite 1 — der Rest kommt auf ein zweites Blatt</span>
        </div>
      )}
    </div>
  );
}
