"use client";

import { useState } from "react";
import { Feld, inputKlasse } from "./ui";

/**
 * Wiederverwendbares Upload-Feld: Datei wählen → landet in R2 → ruft
 * `onHochgeladen(url)` mit der öffentlichen URL. Optionales „Dateiname"-Feld,
 * damit z. B. WhatsApp-/Handy-Bilder (IMG_1234.jpg) einen sprechenden Namen
 * bekommen. Das aufrufende Formular trägt die URL in sein Pfad-Feld ein.
 *
 * Entkoppelt vom konkreten Formular: kennt weder Galerie noch Event direkt,
 * nur den Zielordner (`ordner`) und den Rückgabe-Callback.
 */
export default function BildUploadFeld({
  initialeUrl = "",
  ordner,
  onHochgeladen,
}: {
  initialeUrl?: string;
  ordner: "galerie" | "events";
  onHochgeladen: (url: string) => void;
}) {
  const [vorschauUrl, setVorschauUrl] = useState(initialeUrl);
  const [wunschname, setWunschname] = useState("");
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string>();

  async function handleDatei(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    if (!datei) return;

    setFehler(undefined);
    setLaeuft(true);
    try {
      const daten = new FormData();
      daten.append("datei", datei);
      daten.append("ordner", ordner);
      if (wunschname.trim()) daten.append("name", wunschname.trim());

      const antwort = await fetch("/api/upload", { method: "POST", body: daten });
      const ergebnis = await antwort.json();
      if (!antwort.ok) {
        setFehler(ergebnis?.fehler ?? "Upload fehlgeschlagen.");
        return;
      }
      setVorschauUrl(ergebnis.url);
      onHochgeladen(ergebnis.url);
    } catch {
      setFehler("Upload fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setLaeuft(false);
      e.target.value = ""; // erlaubt erneutes Wählen derselben Datei
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-black/5 bg-black/[0.015] p-4">
      <Feld
        label="Dateiname (optional)"
        htmlFor="wunschname"
        hint="Sprechender Name für die Bild-URL, z. B. schlager-nacht. Nützlich bei WhatsApp-/Handy-Bildern ohne eindeutigen Namen. Leer = Originalname."
      >
        <input
          id="wunschname"
          className={inputKlasse}
          value={wunschname}
          onChange={(e) => setWunschname(e.target.value)}
          placeholder="z. B. schlager-nacht"
        />
      </Feld>

      <Feld
        label="Bild hochladen"
        htmlFor="datei"
        error={fehler}
        hint="JPG, PNG, WebP oder AVIF · max. 8 MB. Nach dem Hochladen wird das Pfad-Feld unten automatisch gefüllt."
      >
        <div className="flex flex-wrap items-center gap-4">
          <input
            id="datei"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleDatei}
            disabled={laeuft}
            className="block w-full text-sm text-tinte/80 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-wald file:px-4 file:py-2 file:text-sm file:font-medium file:text-creme hover:file:bg-wald-dark disabled:opacity-60 sm:w-auto"
          />
          {laeuft && <span className="text-sm text-tinte/60">Wird hochgeladen…</span>}
          {vorschauUrl && !laeuft && (
            // Vorschau im Admin bewusst als schlichtes <img> (keine next/image-Optimierung nötig)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vorschauUrl}
              alt="Vorschau"
              className="h-16 w-16 rounded-lg object-cover ring-1 ring-black/10"
            />
          )}
        </div>
      </Feld>
    </div>
  );
}
