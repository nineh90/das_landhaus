"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { passwortAendernSchema } from "@/lib/schemas";

export type PasswortErgebnis = { ok?: boolean; fehler?: string };

export async function passwortAendern(werte: unknown): Promise<PasswortErgebnis> {
  const session = await auth();
  if (!session?.user?.email) return { fehler: "Nicht autorisiert." };

  const parsed = passwortAendernSchema.safeParse(werte);
  if (!parsed.success) {
    return { fehler: parsed.error.issues[0]?.message ?? "Bitte die Eingaben prüfen." };
  }

  const benutzer = await prisma.benutzer.findUnique({ where: { email: session.user.email } });
  if (!benutzer) return { fehler: "Benutzer nicht gefunden." };

  const aktuellStimmt = await bcrypt.compare(parsed.data.aktuell, benutzer.passwortHash);
  if (!aktuellStimmt) return { fehler: "Das aktuelle Passwort ist falsch." };

  try {
    const passwortHash = await bcrypt.hash(parsed.data.neu, 12);
    await prisma.benutzer.update({ where: { id: benutzer.id }, data: { passwortHash } });
  } catch (error) {
    console.error("passwortAendern:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  return { ok: true };
}
