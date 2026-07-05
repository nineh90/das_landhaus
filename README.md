# Das Landhaus Tecklenburg-Leeden

Website & Admin für „Das Landhaus" am Ferienpark Tecklenburg-Leeden (Restaurant · Imbiss · Der Kotten).
Next.js 16 (App Router) · Tailwind v4 · PostgreSQL via Prisma.

## Entwicklung starten

### 1. Datenbank (lokal)

Die App braucht eine PostgreSQL-Datenbank. Lokal läuft sie als Container (podman oder docker):

```bash
podman run -d --name landhaus-postgres \
  -e POSTGRES_USER=landhaus \
  -e POSTGRES_PASSWORD=landhaus \
  -e POSTGRES_DB=landhaus \
  -p 5432:5432 \
  docker.io/library/postgres:16
```

Läuft der Container schon, genügt beim nächsten Mal: `podman start landhaus-postgres`.

Die Verbindungs-URL steht in `.env` (Vorlage: `.env.example`).

### 2. Abhängigkeiten, Schema & Seed

```bash
npm install                # installiert Pakete + generiert den Prisma-Client (postinstall)
npm run db:migrate         # legt die Tabellen an (prisma migrate dev)
npm run db:seed            # befüllt die DB mit den Demo-Inhalten aus lib/data/*
```

### 3. Dev-Server

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Nützliche Skripte

| Befehl | Zweck |
|---|---|
| `npm run dev` | Dev-Server (Turbopack) |
| `npm run build` | Produktions-Build |
| `npm run db:migrate` | Migration erstellen/anwenden |
| `npm run db:seed` | Demo-Daten einspielen (idempotent) |
| `npm run db:studio` | Prisma Studio (DB im Browser ansehen/bearbeiten) |

## Admin-Bereich

Erreichbar unter **`/admin`** (geschützt via Auth.js v5 / `proxy.ts`). Der erste
Admin-Benutzer wird beim Seed aus `ADMIN_EMAIL` / `ADMIN_PASSWORD` (siehe `.env`)
angelegt — das Passwort liegt als bcrypt-Hash in der `Benutzer`-Tabelle.

Module:
- **Speisekarte** — Gerichte anlegen/bearbeiten/löschen, sichtbar/versteckt schalten
- **Events** — anlegen/bearbeiten/löschen, veröffentlichen (Draft ↔ live)
- **Galerie** — Bilder verwalten, beschriften, sortieren, löschen (echter Datei-Upload via Vercel Blob folgt; aktuell werden Pfade unter `/public/images` referenziert)
- **Einstellungen** — Kontaktdaten, Öffnungszeiten, Google-Maps-Embed

Änderungen sind dank `revalidatePath` sofort auf der öffentlichen Website sichtbar.
Passwort ändern: `ADMIN_PASSWORD` in `.env` setzen und `npm run db:seed` erneut
ausführen (idempotent).

## Architektur-Notiz

Alle Seiten holen Inhalte **ausschließlich** über die Fassade `lib/content.ts`.
Deren Funktionen lesen jetzt aus der Datenbank (Prisma); die Signaturen sind
identisch zur früheren statischen Variante geblieben, daher musste kein Aufrufer
angepasst werden. `lib/data/*` bleibt als Quelle für den Seed erhalten.

Details zu Zielen, Design und Roadmap: siehe `CLAUDE.md`.

## Deployment (Vercel)

`DATABASE_URL` in den Vercel-Projekt-Umgebungsvariablen auf die gehostete DB
(Vercel Postgres / Neon) setzen. Migrationen via `prisma migrate deploy` im
Build-Schritt. Bild-Uploads (Vercel Blob / Cloudinary) folgen mit dem Admin-Panel.
