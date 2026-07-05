import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./db";
import { anmeldeSchema } from "./schemas";

/**
 * Vollständige Auth-Konfiguration (Node-Runtime).
 * Erweitert die edge-sichere Basis um den Credentials-Provider mit
 * bcrypt-Passwortprüfung gegen die Benutzer-Tabelle. Session als JWT, damit die
 * Middleware ohne DB-Zugriff (Edge) den Login-Status prüfen kann.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-Mail", type: "email" },
        passwort: { label: "Passwort", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = anmeldeSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, passwort } = parsed.data;
        const benutzer = await prisma.benutzer.findUnique({ where: { email } });
        if (!benutzer) return null;

        const stimmt = await bcrypt.compare(passwort, benutzer.passwortHash);
        if (!stimmt) return null;

        return { id: benutzer.id, email: benutzer.email, name: benutzer.name };
      },
    }),
  ],
});
