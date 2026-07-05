# Platzhalterbilder — Austausch vor dem Launch

Alle Bilder unter `public/images/` sind aktuell **temporäre, lizenzfreie Stockfotos von
Unsplash** (.jpg). Sie zeigen passende Motive, damit die Seite nicht leer wirkt — vor dem
finalen Launch werden sie durch **eigene Fotos vom Shooting** ersetzt.

> Hinweis: Unsplash-Fotos sind kostenlos kommerziell nutzbar und benötigen keinen Bildnachweis.
> Trotzdem sind die Quellen unten dokumentiert. Für die echte Außendarstellung des Lokals sind
> eigene Fotos Pflicht (siehe ToDo „Foto-Shooting" in CLAUDE.md).

## So tauschst du ein Bild

1. Echtes Foto als optimiertes **JPG oder WebP** speichern (Querformat, ca. 1600×1067 px reicht).
2. Unter **demselben Pfad und Dateinamen** ablegen (gleichnamige Datei ersetzen) — dann ist
   keine Code-Änderung nötig. Bei anderer Endung zusätzlich die Pfade anpassen in:
   - `lib/data/bilder.ts` (Galerie)
   - `lib/data/events.ts` (Event-Bilder)
   - `components/home/Hero.tsx` und `components/home/BereicheTeaser.tsx` (fest verlinkt)

## Benötigte Motive

| Datei | Gewünschtes Motiv |
|---|---|
| `hero/landhaus-aussen.jpg` | Stimmungsvolle Außenansicht des Landhauses in der Natur (Hero) |
| `galerie/aussen-landhaus.jpg` | Gebäude von außen |
| `galerie/aussen-terrasse.jpg` | Terrasse / Außenbestuhlung |
| `galerie/aussen-abend.jpg` | Landhaus in der Abenddämmerung |
| `galerie/restaurant-tisch.jpg` | Gedeckter Tisch / Innenraum Restaurant |
| `galerie/restaurant-gericht.jpg` | Angerichtetes Gericht (Nahaufnahme) |
| `galerie/imbiss-theke.jpg` | Imbiss-Theke / Snacks |
| `galerie/kotten-buehne.jpg` | Bühne / Lichtstimmung im Kotten |
| `galerie/kotten-tanzflaeche.jpg` | Volle Tanzfläche bei einer Veranstaltung |
| `kotten/event-*.jpg` | Passende Event-Motive (Schlagernacht, Live-Musik, Oktoberfest, Tanzabend) |
| `restaurant/event-weinabend.jpg` | Weingläser / Verkostung |

## Aktuelle Bildquellen (temporär, Unsplash)

| Datei | Quelle |
|---|---|
| `hero/landhaus-aussen.jpg` | https://unsplash.com/photos/1449158743715-0a90ebb6d2d8 |
| `galerie/aussen-landhaus.jpg` | https://unsplash.com/photos/1568605114967-8130f3a36994 |
| `galerie/aussen-terrasse.jpg` | https://unsplash.com/photos/1559339352-11d035aa65de |
| `galerie/aussen-abend.jpg` | https://unsplash.com/photos/1500534623283-312aade485b7 |
| `galerie/restaurant-tisch.jpg` | https://unsplash.com/photos/1517248135467-4c7edcad34c4 |
| `galerie/restaurant-gericht.jpg` | https://unsplash.com/photos/1467003909585-2f8a72700288 |
| `galerie/imbiss-theke.jpg` | https://unsplash.com/photos/1630384060421-cb20d0e0649d |
| `galerie/kotten-buehne.jpg` | https://unsplash.com/photos/1470229722913-7c0e2dbbafd3 |
| `galerie/kotten-tanzflaeche.jpg` | https://unsplash.com/photos/1514525253161-7a46d19cd819 |
| `kotten/event-schlager.jpg` | https://unsplash.com/photos/1492684223066-81342ee5ff30 |
| `kotten/event-livemusik.jpg` | https://unsplash.com/photos/1511192336575-5a79af67a629 |
| `kotten/event-oktoberfest.jpg` | https://unsplash.com/photos/1600788886242-5c96aabe3757 |
| `kotten/event-tanz-in-den-mai.jpg` | https://unsplash.com/photos/1516450360452-9312f5e86fc7 |
| `restaurant/event-weinabend.jpg` | https://unsplash.com/photos/1474722883778-792e7990302f |

## Lizenz

Nur Fotos verwenden, an denen die Rechte vorliegen (eigene Fotos vom Shooting oder lizenzfreie
Stockfotos mit kommerzieller Nutzung, z. B. Unsplash/Pexels). Stockfotos **herunterladen**, nicht
per Hotlink einbinden.
