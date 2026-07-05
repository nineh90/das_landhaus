import type { NextAuthConfig } from "next-auth";

/**
 * Edge-sichere Auth-Basiskonfiguration (ohne Prisma/bcrypt).
 *
 * Auth.js v5 trennt bewusst: Diese Datei läuft auch in der Middleware (Edge-
 * Runtime) und darf daher KEINE Node-only-Abhängigkeiten importieren. Der
 * Credentials-Provider mit bcrypt/DB-Zugriff lebt in lib/auth.ts (Node-Runtime).
 *
 * Die `authorized`-Callback schützt alle /admin-Routen: nur eingeloggte Nutzer
 * kommen rein, /admin/login ist frei (und leitet eingeloggte Nutzer weiter).
 */
export const authConfig = {
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const eingeloggt = !!auth?.user;
      const istLogin = nextUrl.pathname === "/admin/login";

      if (istLogin) {
        if (eingeloggt) return Response.redirect(new URL("/admin", nextUrl));
        return true;
      }
      // Alle übrigen /admin-Routen erfordern Login (Matcher siehe middleware.ts).
      return eingeloggt;
    },
  },
} satisfies NextAuthConfig;
