/**
 * Seed — befüllt die Datenbank mit den bestehenden Demo-Inhalten aus lib/data/*.
 *
 * Diese Arrays bleiben die Quelle der Erst-Daten (Single Source of Truth für den
 * Seed); im laufenden Betrieb werden Inhalte über das kommende Admin-Panel
 * gepflegt. Das Skript ist idempotent (upsert): mehrfaches Ausführen ist gefahrlos.
 *
 * Ausführen:  npx prisma db seed   (oder:  npm run db:seed)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { gerichte } from "../lib/data/gerichte";
import { events } from "../lib/data/events";
import { bilder } from "../lib/data/bilder";
import { einstellungen } from "../lib/data/einstellungen";

const prisma = new PrismaClient();

async function main() {
  for (const g of gerichte) {
    await prisma.gericht.upsert({
      where: { id: g.id },
      update: { ...g },
      create: { ...g },
    });
  }
  console.log(`✓ ${gerichte.length} Gerichte`);

  for (const e of events) {
    const daten = { ...e, datum: new Date(e.datum) };
    await prisma.event.upsert({
      where: { id: e.id },
      update: daten,
      create: daten,
    });
  }
  console.log(`✓ ${events.length} Events`);

  for (const [i, b] of bilder.entries()) {
    const daten = { ...b, reihenfolge: i };
    await prisma.bild.upsert({
      where: { id: b.id },
      update: daten,
      create: daten,
    });
  }
  console.log(`✓ ${bilder.length} Bilder`);

  for (const s of einstellungen) {
    await prisma.einstellung.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { ...s },
    });
  }
  console.log(`✓ ${einstellungen.length} Einstellungen`);

  // Admin-Benutzer aus den Env-Variablen anlegen/aktualisieren.
  const email = process.env.ADMIN_EMAIL;
  const passwort = process.env.ADMIN_PASSWORD;
  if (email && passwort) {
    const passwortHash = await bcrypt.hash(passwort, 12);
    await prisma.benutzer.upsert({
      where: { email },
      update: { passwortHash },
      create: { email, passwortHash, name: "Betreiber", rolle: "admin" },
    });
    console.log(`✓ Admin-Benutzer (${email})`);
  } else {
    console.warn("⚠ ADMIN_EMAIL/ADMIN_PASSWORD fehlen — kein Admin-Benutzer angelegt.");
  }
}

main()
  .then(() => console.log("Seed abgeschlossen."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
