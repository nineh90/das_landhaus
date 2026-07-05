# CLAUDE.md — Das Landhaus Tecklenburg-Leeden
> Entwickelt von Nils-Digital | Langfristiges Projekt (5 Jahre) | Stand: 2025

---

## Projektüberblick

**Kunde:** Betreiber von "Das Landhaus" am Campingplatz Capfun in Tecklenburg-Leeden
**Agentur:** Nils-Digital
**Laufzeit:** 5 Jahre Retainer (Entwicklung + Pflege + Wartung)

Das Landhaus ist ein Gastronomiebetrieb bestehend aus drei Bereichen:
- **Restaurant** — gehobene Gastronomie, auch für externe Gäste
- **Imbiss** — separater Schnellbereich, primär Campinggäste
- **Der Kotten** — Event-Diele: Abendveranstaltungen, Live-Musik, Themenabende

Der Campingplatz wird aktuell zum Resort (Capfun) umgebaut. Das Lokal soll parallel dazu online sichtbar werden und externe Gäste aus der Region ansprechen (Tecklenburg-Leeden, Osnabrück, Münster, Bielefeld — ca. 50km Radius).

---

## Ziele

1. **Primär:** Online-Sichtbarkeit aufbauen — Google, Social Media, Karte
2. **Sekundär:** Externe Gäste ansprechen, nicht nur Campingplatz-Besucher
3. **Langfristig:** Digitale Infrastruktur die mit dem Resort mitwächst

---

## Tech-Stack

```
Frontend:     Next.js 14+ (App Router)
Styling:      Tailwind CSS
Datenbank:    PostgreSQL (via Prisma ORM)
Hosting:      Live-Gang → VPS/Root-Server bei Hostinger oder Strato (Node + selbst-gehostetes Postgres + Nginx + SSL). NICHT Vercel. Vercel+Neon nur als Wegwerf-Demo für Kunden-Review.
Bildupload:   VPS-tauglich (lokales Volume oder S3-kompatibel) — KEIN Vercel Blob, da Produktion nicht auf Vercel läuft
Auth (Admin): NextAuth.js (nur für Admin-Bereich)
```

**Kein fertiges CMS.** Nils-Digital baut und pflegt ein eigenes schlankes Admin-Panel.
Der Kunde soll selbst in der Lage sein, Speisekarten, Events und Bilder zu aktualisieren — ohne technisches Wissen.

---

## Projektstruktur

```
/
├── app/
│   ├── (public)/               # Öffentliche Website
│   │   ├── page.tsx            # Startseite
│   │   ├── restaurant/         # Restaurant-Seite inkl. Speisekarte
│   │   ├── imbiss/             # Imbiss-Seite inkl. Karte
│   │   ├── der-kotten/         # Der Kotten (Event-Diele) + Event-Kalender
│   │   ├── events/             # Alle Events (Übersicht + Detailseiten)
│   │   ├── galerie/            # Bildergalerie
│   │   ├── anfahrt/            # Kontakt, Karte, Öffnungszeiten
│   │   └── impressum/          # Impressum + Datenschutz (DSGVO)
│   │
│   └── admin/                  # Internes Admin-Panel (nur eingeloggt)
│       ├── login/
│       ├── speisekarte/        # Gerichte anlegen / bearbeiten / löschen
│       ├── events/             # Events anlegen / bearbeiten / löschen
│       ├── galerie/            # Bilder hochladen / verwalten
│       └── einstellungen/      # Öffnungszeiten, Kontaktdaten
│
├── components/
│   ├── ui/                     # Allgemeine UI-Komponenten
│   ├── restaurant/             # Speisekarten-Komponenten
│   ├── events/                 # Event-Karten, Kalender
│   └── admin/                  # Admin-Panel Komponenten
│
├── lib/
│   ├── db.ts                   # Prisma Client
│   ├── auth.ts                 # NextAuth Config
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma           # Datenbankschema
│
└── public/
    └── images/                 # Statische Assets
```

---

## Datenbankschema (Prisma)

```prisma
model Gericht {
  id          String   @id @default(cuid())
  name        String
  beschreibung String?
  preis       Float
  kategorie   String   // z.B. "Vorspeise", "Hauptgang", "Dessert", "Getränk"
  bereich     String   // "restaurant" | "imbiss"
  verfuegbar  Boolean  @default(true)
  bild        String?
  reihenfolge Int      @default(0)
  erstelltAm  DateTime @default(now())
  aktualisiertAm DateTime @updatedAt
}

model Event {
  id          String   @id @default(cuid())
  titel       String
  beschreibung String?
  datum       DateTime
  uhrzeit     String   // z.B. "20:00 Uhr"
  eintritt    String?  // z.B. "8,00 €" oder "Eintritt frei"
  bild        String?
  veroeffentlicht Boolean @default(false)
  erstelltAm  DateTime @default(now())
  aktualisiertAm DateTime @updatedAt
}

model Bild {
  id          String   @id @default(cuid())
  url         String
  alt         String?
  bereich     String   // "restaurant" | "kotten" | "imbiss" | "aussen"
  erstelltAm  DateTime @default(now())
}

model Einstellung {
  key         String   @id
  value       String
  // Beispiel-Keys: "oeffnungszeiten_restaurant", "telefon", "email", "adresse"
}
```

---

## Seiten & Inhalte im Detail

### Startseite (`/`)
- Hero mit stimmungsvollem Bild (Landhaus + Natur)
- Kurze Vorstellung der drei Bereiche (Restaurant, Imbiss, Der Kotten)
- Nächste Events (automatisch aus DB, max. 3)
- Öffnungszeiten-Übersicht
- Google Maps Embed
- CTA: "Tisch reservieren" (erstmal per Telefon/WhatsApp-Link)

### Restaurant (`/restaurant`)
- Beschreibung & Atmosphäre
- Speisekarte (aus DB, nach Kategorien gegliedert)
- Hinweis auf Reservierung

### Imbiss (`/imbiss`)
- Karte (aus DB)
- Öffnungszeiten Imbiss

### Der Kotten (`/der-kotten`)
- Beschreibung (Event-Diele)
- Nächste Veranstaltungen (aus DB)
- Bildergalerie Der Kotten

### Events (`/events`)
- Alle kommenden Events (aus DB)
- Detailseite je Event mit Bild, Beschreibung, Datum, Eintritt

### Admin-Panel (`/admin`)
- Login per E-Mail + Passwort (nur ein User: der Betreiber)
- Speisekarte: CRUD für Gerichte, drag & drop Reihenfolge
- Events: CRUD, Veröffentlichung ein/aus
- Galerie: Upload, Zuordnung zu Bereichen, löschen
- Einstellungen: Öffnungszeiten, Kontaktdaten

---

## Design-Richtlinien

- **Stil:** Warm, natürlich, einladend — passend zu Landhaus & Natur
- **Farben:** Erdtöne, Waldgrün, warmes Beige/Creme — kein Corporate-Look
- **Schrift:** Leserlich, leicht rustikal ohne kitschig zu sein
- **Bilder:** Spielen die Hauptrolle — ohne gute Fotos funktioniert nichts
- **Mobile First:** Campinggäste nutzen primär Smartphones
- **Ladezeit:** Bilder optimieren (next/image), Core Web Vitals im Blick

---

## Was Nils-Digital übernimmt (Retainer)

- Monatliche Pflege der Website
- Neue Events eintragen (wenn Betreiber es nicht selbst macht)
- Social Media (Instagram + Facebook): Content, Posting, Stories
- Meta-Ads bei Veranstaltungen
- Google Business Profil pflegen
- Technische Wartung, Updates, Backups
- Monatliches Reporting (Reichweite, Klicks, Google-Ranking)
- Mitwirkung bei größeren Veranstaltungen (Ankündigung, Dokumentation)

---

## Offene Punkte / ToDos

- [ ] Google Business Profil klären (alter Betreiber → Eigentumsanfrage oder Neuanlage)
- [ ] Erstes Foto-Shooting organisieren (Pflicht vor Launch)
- [ ] Restauranterweiterung: Pläne noch offen → Website muss das später abbilden können
- [ ] Reservierungssystem: Erstmal per Telefon/WhatsApp, später ggf. eigene Lösung
- [ ] Domain klären und registrieren
- [ ] Angebot / Vertrag mit Betreiber finalisieren

---

## Konventionen für Claude Code

- Sprache: Deutsch (UI + Kommentare + Commits)
- Komponenten: Server Components wo möglich, Client Components nur wenn nötig
- API Routes: `/app/api/` für Admin-Aktionen
- Fehlerbehandlung: Immer try/catch, sinnvolle Fehlermeldungen
- Bilder: Immer `next/image` mit `alt`-Text
- Formulare: React Hook Form + Zod für Validierung
- Keine unnötigen Dependencies — schlank halten
