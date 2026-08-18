"use client";

/**
 * Bedienleiste über jeder Druckansicht: links die Optionen der jeweiligen Seite
 * (als `children`), rechts der Druck-Knopf, darunter der Hinweis zum
 * Druckdialog.
 *
 * Gemeinsam genutzt von Speisekarte und Flyer — der Hinweis zu Kopf-/Fußzeilen
 * und Hintergrundgrafiken gilt für jedes Druckstück und soll nicht in zwei
 * Fassungen auseinanderlaufen.
 *
 * Beim Drucken blendet sich die Leiste selbst aus (`print:hidden`).
 */
export default function DruckLeiste({
  children,
  gedimmt = false,
}: {
  children?: React.ReactNode;
  /** Während eines Server-Neuladens (Optionswechsel) abgeblendet. */
  gedimmt?: boolean;
}) {
  return (
    <div
      className={`mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-tinte/10 bg-white/80 p-4 shadow-sm print:hidden ${
        gedimmt ? "opacity-60" : ""
      }`}
    >
      {children}

      <button
        type="button"
        onClick={() => window.print()}
        className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-akzent px-5 py-2.5 font-semibold text-creme transition-colors hover:bg-akzent-dark"
      >
        Drucken / als PDF speichern
      </button>

      {/* Der Browser setzt von sich aus URL, Datum und Seitenzahl an den
          Seitenrand — das lässt sich nur im Druckdialog abschalten, nicht per
          CSS. Der Hinweis steht hier, damit das Druckstück auch dann sauber
          aussieht, wenn jemand anderes als der Entwickler es ausdruckt. */}
      <p className="w-full text-xs leading-relaxed text-tinte/55">
        Im Druckdialog unter <strong className="font-semibold">Weitere Einstellungen</strong> den
        Haken bei <strong className="font-semibold">Kopf- und Fußzeilen</strong> entfernen — sonst
        druckt der Browser die Adresse dieser Seite und das Datum mit.{" "}
        <strong className="font-semibold">Hintergrundgrafiken</strong> dagegen aktivieren, damit
        Logo und Überschriften ihre Farbe behalten. Der Browser merkt sich beides für das nächste
        Mal.
      </p>
    </div>
  );
}
