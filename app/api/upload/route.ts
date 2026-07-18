import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ladeNachR2Hoch, r2Konfiguriert } from "@/lib/storage";

/** Node-Runtime: wir arbeiten mit ArrayBuffer und laden serverseitig zu R2 hoch. */
export const runtime = "nodejs";

/** Maximale Dateigröße (8 MB) — genug für hochauflösende Fotos, schützt vor Missbrauch. */
const MAX_BYTES = 8 * 1024 * 1024;

/** Erlaubte Bildtypen → Dateiendung. Bewusst nur Web-taugliche Formate. */
const ERLAUBTE_TYPEN: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Erlaubte Zielordner im Bucket — verhindert beliebige Pfade aus dem Formular. */
const ERLAUBTE_ORDNER = new Set(["galerie", "events"]);

/**
 * Nimmt eine Bilddatei (multipart/form-data) entgegen, prüft Login/Typ/Größe und
 * speichert sie in R2. Felder:
 *   datei   – die Bilddatei (Pflicht)
 *   ordner  – "galerie" | "events" (optional, Standard "galerie")
 *   name    – Wunsch-Dateiname (optional; sonst Originalname)
 * Antwort: `{ url }` mit der öffentlichen Bild-URL fürs Formular.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ fehler: "Nicht autorisiert." }, { status: 401 });
  }

  if (!r2Konfiguriert()) {
    return NextResponse.json(
      { fehler: "Bild-Upload ist noch nicht eingerichtet. Bitte vorerst eine Bild-URL eintragen." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ fehler: "Ungültige Anfrage." }, { status: 400 });
  }

  const datei = form.get("datei");
  if (!(datei instanceof File) || datei.size === 0) {
    return NextResponse.json({ fehler: "Keine Datei erhalten." }, { status: 400 });
  }

  const ext = ERLAUBTE_TYPEN[datei.type];
  if (!ext) {
    return NextResponse.json(
      { fehler: "Nur JPG, PNG, WebP oder AVIF erlaubt." },
      { status: 415 },
    );
  }

  if (datei.size > MAX_BYTES) {
    return NextResponse.json({ fehler: "Datei zu groß (max. 8 MB)." }, { status: 413 });
  }

  const ordnerRoh = form.get("ordner");
  const ordner = typeof ordnerRoh === "string" && ERLAUBTE_ORDNER.has(ordnerRoh) ? ordnerRoh : "galerie";
  const nameRoh = form.get("name");
  const wunschname = typeof nameRoh === "string" ? nameRoh : undefined;

  try {
    const daten = await datei.arrayBuffer();
    const url = await ladeNachR2Hoch({
      daten,
      contentType: datei.type,
      ext,
      originalName: datei.name,
      wunschname,
      ordner,
    });
    return NextResponse.json({ url });
  } catch (error) {
    console.error("upload:", error);
    return NextResponse.json(
      { fehler: "Upload fehlgeschlagen. Bitte erneut versuchen." },
      { status: 500 },
    );
  }
}
