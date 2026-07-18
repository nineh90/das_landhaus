import type { NextConfig } from "next";

/**
 * Öffentlicher Host des R2-Buckets (aus R2_PUBLIC_BASE_URL) — damit next/image
 * die hochgeladenen Galerie-Bilder optimieren/ausliefern darf. Ohne konfiguriertes
 * R2 bleibt die Liste leer (nur lokale Bilder aus /public).
 */
function r2RemotePatterns() {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) return [];
  try {
    return [{ protocol: "https" as const, hostname: new URL(base).hostname }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    // Lokale Bilder liegen unter /public/images; hochgeladene Bilder kommen aus R2.
    remotePatterns: r2RemotePatterns(),
    // Erlaubt die SVG-Platzhalter der Demo über next/image. Unbedenklich, da nur
    // eigene Assets aus /public ausgeliefert werden; echte Fotos (jpg/webp) später ebenfalls.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
