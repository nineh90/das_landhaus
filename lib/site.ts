/**
 * Kanonische Basis-URL der öffentlichen Website.
 *
 * Bewusst zentral an EINER Stelle, damit Metadata (metadataBase), Sitemap und
 * robots.txt garantiert dieselbe Live-Domain verwenden. Beim Domain-Wechsel
 * (z. B. späterer Umzug oder zusätzliche Domain) nur hier ändern.
 */
import { activeSocialChannels } from "./social";

export const SITE_URL = "https://www.das-landhaus-capfun.de";

/** Standard-Sharing-Bild (OpenGraph/WhatsApp/Social) — 1200×630. */
export const OG_IMAGE = "/images/og/og-standard.jpg";

/** Anzeigename des Betriebs — für Titel und strukturierte Daten (JSON-LD). */
export const SITE_NAME = "Das Landhaus Tecklenburg-Leeden";

/**
 * Social-Media-/Google-Profile für JSON-LD `sameAs` — verknüpft
 * Website ↔ Instagram/Facebook ↔ Google Business für die lokale Suche.
 *
 * Wird automatisch aus den gepflegten Kanälen in `lib/social.ts` abgeleitet
 * (nur solche mit `sameAs: true`). Neue Profile also NICHT hier, sondern dort
 * eintragen — dann sind Anzeige und strukturierte Daten garantiert synchron.
 */
export const SOCIAL_LINKS: string[] = activeSocialChannels
  .filter((c) => c.sameAs)
  .map((c) => c.url);
