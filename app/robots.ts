import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt für Suchmaschinen.
 * Öffentliche Seiten frei crawlbar; Admin-Bereich und API ausgeschlossen.
 * Verweist auf die Sitemap unter der kanonischen Live-Domain.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
