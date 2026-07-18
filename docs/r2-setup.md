# Bild-Upload einrichten — Cloudflare R2

Damit im Admin-Panel Galerie-Bilder **direkt hochgeladen** werden können, brauchen
wir einen Speicherort für die Dateien. Wir nutzen **Cloudflare R2** (S3-kompatibel):
läuft auf Vercel, kostenlos bis 10 GB, keine Traffic-Gebühren – und übersteht einen
späteren VPS-Umzug ohne Code-Änderung.

> **Wichtig:** In der Datenbank (Neon) ändert sich dadurch **nichts**. Dort steht am
> Ende nur die öffentliche Bild-URL als Text. Keine Migration nötig.

Zeitaufwand: ca. **10 Minuten**. Du brauchst nur einen (kostenlosen) Cloudflare-Account.

---

## 1. Cloudflare-Account + R2 aktivieren

1. Konto anlegen / einloggen unter <https://dash.cloudflare.com>
2. Links im Menü **R2 Object Storage** öffnen.
3. Einmalig **R2 aktivieren** (Zahlungsmethode wird abgefragt – der kostenlose
   Rahmen von 10 GB reicht für die Galerie locker; es entstehen keine Kosten,
   solange wir darunter bleiben).

## 2. Bucket erstellen

1. **Create bucket** klicken.
2. Name: **`landhaus-bilder`** (oder frei wählbar – merken für Schritt 5).
3. Region/Location: **Automatic** lassen.
4. **Create bucket**.

## 3. Öffentlichen Zugriff einschalten

Die Bilder sollen im Web sichtbar sein.

1. Im Bucket auf **Settings**.
2. Abschnitt **Public access → R2.dev subdomain**: **Allow Access** aktivieren
   (Sicherheitsabfrage mit „allow" bestätigen).
3. Es erscheint eine öffentliche URL wie
   `https://pub-xxxxxxxxxxxxxxxx.r2.dev` → **kopieren**, das ist gleich
   `R2_PUBLIC_BASE_URL`.

> Optional/später: statt der r2.dev-Adresse eine eigene Subdomain verbinden
> (z. B. `bilder.das-landhaus-capfun.de`). Dann einfach diese als
> `R2_PUBLIC_BASE_URL` eintragen. Nicht nötig für den Start.

## 4. API-Zugangsdaten (Access Key) erzeugen

1. In der R2-Übersicht rechts auf **Manage R2 API Tokens** (bzw. **API → Create API Token**).
2. **Create API token**.
3. Berechtigung: **Object Read & Write**.
4. Optional auf den einen Bucket `landhaus-bilder` einschränken (empfohlen).
5. **Create** – danach werden **einmalig** angezeigt:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`

   ⚠️ Der Secret erscheint **nur dieses eine Mal** – sofort kopieren.

## 5. Account-ID notieren

Die **Account ID** steht in der R2-Übersicht rechts (oder in der URL des
Dashboards). → `R2_ACCOUNT_ID`.

---

## 6. Werte eintragen

### Lokal (Datei `.env`)

```env
R2_ACCOUNT_ID="deine-account-id"
R2_ACCESS_KEY_ID="dein-access-key"
R2_SECRET_ACCESS_KEY="dein-secret"
R2_BUCKET="landhaus-bilder"
R2_PUBLIC_BASE_URL="https://pub-xxxxxxxx.r2.dev"
```

### Produktion (Vercel)

Vercel-Projekt → **Settings → Environment Variables** → dieselben 5 Werte für
**Production** (und ggf. Preview) anlegen → danach **einmal neu deployen**
(Deployments → ⋯ → Redeploy), damit sie greifen.

---

## Fertig – so sieht es dann aus

- Im Admin unter **Galerie → Bild anlegen/bearbeiten** gibt es das Feld
  **„Bild hochladen"**. Datei wählen → sie landet in R2, das Feld „Bildpfad / URL"
  füllt sich automatisch, eine Vorschau erscheint → speichern.
- Erlaubt: **JPG, PNG, WebP, AVIF**, bis **8 MB**.
- Solange die Env-Vars fehlen, bleibt der Upload deaktiviert und zeigt einen
  Hinweis – Bilder lassen sich dann weiterhin per URL eintragen. Nichts geht kaputt.

## Problembehebung

- **„Bild-Upload ist noch nicht eingerichtet"** → eine der 5 Env-Vars fehlt
  (lokal in `.env`, in Produktion in Vercel) oder Vercel wurde nach dem Eintragen
  nicht neu deployt.
- **Bild lädt hoch, wird aber nicht angezeigt** → öffentlicher Zugriff (Schritt 3)
  nicht aktiviert, oder `R2_PUBLIC_BASE_URL` stimmt nicht mit der r2.dev-Adresse
  überein.
- **Upload schlägt fehl (403)** → API-Token hat nicht **Read & Write** oder ist auf
  den falschen Bucket eingeschränkt.
