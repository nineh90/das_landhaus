import { AwsClient } from "aws4fetch";

/**
 * Objektspeicher für hochgeladene Bilder — Cloudflare R2 (S3-kompatibel).
 *
 * Bewusst vom Host entkoppelt: läuft heute auf Vercel und übersteht einen
 * späteren VPS-Umzug ohne Code-Änderung (nur andere Zugangsdaten). In der DB
 * steht am Ende nur die öffentliche URL des Bildes.
 *
 * Konfiguration über Env-Vars (siehe docs/r2-setup.md):
 *   R2_ACCOUNT_ID          Cloudflare-Account-ID
 *   R2_ACCESS_KEY_ID       R2-API-Token (Access Key)
 *   R2_SECRET_ACCESS_KEY   R2-API-Token (Secret)
 *   R2_BUCKET              Bucket-Name
 *   R2_PUBLIC_BASE_URL     öffentliche Basis-URL des Buckets (r2.dev oder eigene Domain)
 */

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_BASE_URL,
} = process.env;

/** true, sobald alle nötigen Env-Vars gesetzt sind. Sonst bleibt der Upload deaktiviert. */
export function r2Konfiguriert(): boolean {
  return Boolean(
    R2_ACCOUNT_ID &&
      R2_ACCESS_KEY_ID &&
      R2_SECRET_ACCESS_KEY &&
      R2_BUCKET &&
      R2_PUBLIC_BASE_URL,
  );
}

/** Öffentliche Host-Domain des Buckets — für next.config `images.remotePatterns`. */
export function r2PublicHost(): string | null {
  if (!R2_PUBLIC_BASE_URL) return null;
  try {
    return new URL(R2_PUBLIC_BASE_URL).hostname;
  } catch {
    return null;
  }
}

/** Dateiname → URL-sicherer Slug (Umlaute/Sonderzeichen raus). */
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "") // Endung abschneiden (setzen wir selbst)
    .normalize("NFKD")
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "bild";
}

/**
 * Lädt einen Bild-Buffer nach R2 und gibt die öffentliche URL zurück.
 * Schlüssel: galerie/JJJJ/<slug>-<zufall>.<ext> — sprechend und kollisionsfrei.
 */
export async function ladeNachR2Hoch({
  daten,
  contentType,
  ext,
  originalName,
  wunschname,
  ordner = "galerie",
}: {
  daten: ArrayBuffer;
  contentType: string;
  ext: string;
  originalName: string;
  /** Vom Nutzer gewählter Name (optional) — sonst wird der Originaldateiname genutzt. */
  wunschname?: string;
  /** Zielordner im Bucket — trennt z. B. Galerie- von Event-Bildern. */
  ordner?: string;
}): Promise<string> {
  if (!r2Konfiguriert()) {
    throw new Error("R2 ist nicht konfiguriert.");
  }

  const client = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
    region: "auto",
    service: "s3",
  });

  const jahr = new Date().getFullYear();
  const basis = slug(wunschname?.trim() || originalName);
  const key = `${ordner}/${jahr}/${basis}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`;

  const antwort = await client.fetch(endpoint, {
    method: "PUT",
    body: daten,
    headers: {
      "Content-Type": contentType,
      // R2 verlangt eine bekannte Länge: ohne Content-Length streamt Next/undici
      // größere Bodys chunked → R2 lehnt mit 411 („Length Required") ab.
      "Content-Length": String(daten.byteLength),
      // Ein Jahr cachebar — die URL ist durch den Zufallsteil unveränderlich
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });

  if (!antwort.ok) {
    throw new Error(`R2-Upload fehlgeschlagen (${antwort.status}).`);
  }

  return `${R2_PUBLIC_BASE_URL!.replace(/\/$/, "")}/${key}`;
}
