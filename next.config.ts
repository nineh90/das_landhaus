import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Build 1: alle Bilder liegen lokal unter /public/images.
    // Stufe 2 (Bild-Upload via Vercel Blob / Cloudinary): hier die CDN-Domain ergänzen, z. B.
    // remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    remotePatterns: [],
    // Erlaubt die SVG-Platzhalter der Demo über next/image. Unbedenklich, da nur
    // eigene Assets aus /public ausgeliefert werden; echte Fotos (jpg/webp) später ebenfalls.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
