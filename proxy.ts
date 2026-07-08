import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Middleware (Next.js 16 „proxy"-Konvention, Nachfolger von middleware.ts).
 *
 * Vereint zwei Aufgaben:
 *  1. Admin-Schutz: /admin/* nur für eingeloggte Nutzer, /admin/login ist frei
 *     (leitet eingeloggte Nutzer auf /admin um).
 *  2. Mehrsprachigkeit: fehlt der öffentlichen URL das Locale-Präfix (/de|/en|/nl),
 *     wird die beste Sprache erkannt (Cookie → Accept-Language → Standard) und
 *     per Redirect ergänzt; die Wahl wird im Cookie NEXT_LOCALE gemerkt.
 */

const { auth } = NextAuth(authConfig);

const LOCALE_COOKIE = "NEXT_LOCALE";
const EIN_JAHR = 60 * 60 * 24 * 365;

/** Beste Sprache: Cookie > Accept-Language > Standard (Deutsch). */
function ermittleLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = req.headers.get("accept-language");
  if (header) {
    for (const teil of header.split(",")) {
      const basis = teil.split(";")[0].trim().toLowerCase().split("-")[0];
      if (isLocale(basis)) return basis;
    }
  }
  return defaultLocale;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // --- 1. Admin ---
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const eingeloggt = !!req.auth?.user;
    const istLogin = pathname === "/admin/login";

    if (istLogin) {
      return eingeloggt
        ? NextResponse.redirect(new URL("/admin", req.nextUrl))
        : NextResponse.next();
    }
    return eingeloggt
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  // --- 2. Öffentliche Website: Locale-Präfix erzwingen ---
  const ersteSegment = pathname.split("/")[1];
  if (isLocale(ersteSegment)) return NextResponse.next();

  const locale = ermittleLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: EIN_JAHR });
  return res;
});

export const config = {
  // Alles außer API, Next-Interna, statischen Assets und Dateien mit Endung.
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|icon.svg|apple-icon.png|.*\\..*).*)"],
};
