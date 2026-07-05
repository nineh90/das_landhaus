import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Route-Schutz (Next.js 16 „proxy"-Konvention, Nachfolger von middleware.ts).
 * Nutzt die edge-sichere Auth-Instanz; die eigentliche Zugriffslogik steckt in
 * der `authorized`-Callback von authConfig. Nur /admin/* wird geprüft.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
