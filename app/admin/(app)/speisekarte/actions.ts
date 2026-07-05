"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getKategorieReihenfolge } from "@/lib/content";
import { gerichtSchema } from "@/lib/schemas";
import type { Bereich } from "@/types";

export type FormErgebnis = { fehler?: string };

async function pruefeAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Nicht autorisiert.");
}

/** Seiten neu berechnen, auf denen Gerichte erscheinen. */
function revalidiere() {
  revalidatePath("/restaurant");
  revalidatePath("/imbiss");
  revalidatePath("/admin/speisekarte");
}

/** Kategorie-Reihenfolge eines Bereichs als JSON in der Einstellung ablegen. */
async function persistiereKategorieReihenfolge(bereich: string, namen: string[]) {
  const key = `kategorie_reihenfolge_${bereich}`;
  const value = JSON.stringify(namen);
  await prisma.einstellung.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

function aufbereiten(d: ReturnType<typeof gerichtSchema.parse>) {
  return {
    name: d.name,
    beschreibung: d.beschreibung?.trim() || null,
    preis: d.preis,
    kategorie: d.kategorie,
    bereich: d.bereich,
    verfuegbar: d.verfuegbar,
    bild: d.bild?.trim() || null,
    reihenfolge: d.reihenfolge,
  };
}

export async function erstelleGericht(werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = gerichtSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    await prisma.gericht.create({ data: aufbereiten(parsed.data) });
  } catch (error) {
    console.error("erstelleGericht:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  redirect("/admin/speisekarte?gespeichert=1");
}

export async function aktualisiereGericht(id: string, werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = gerichtSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    await prisma.gericht.update({ where: { id }, data: aufbereiten(parsed.data) });
  } catch (error) {
    console.error("aktualisiereGericht:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  redirect("/admin/speisekarte?gespeichert=1");
}

export async function toggleVerfuegbar(id: string, verfuegbar: boolean) {
  await pruefeAuth();
  await prisma.gericht.update({ where: { id }, data: { verfuegbar } });
  revalidiere();
}

export async function loescheGericht(id: string) {
  await pruefeAuth();
  await prisma.gericht.delete({ where: { id } });
  revalidiere();
}

/**
 * Kategorie umbenennen: Stellt alle Gerichte eines Bereichs mit der alten
 * Kategorie auf den neuen Namen um (z. B. „Antipasti" → „Vorspeise"). Existiert
 * der Zielname bereits, verschmelzen die Gerichte in diese Kategorie.
 */
export async function benenneKategorieUm(
  bereich: string,
  alt: string,
  neu: string,
): Promise<FormErgebnis> {
  await pruefeAuth();
  const neuName = neu.trim();
  if (!neuName) return { fehler: "Bitte einen Kategorienamen eingeben." };
  if (neuName.length > 60) return { fehler: "Kategoriename ist zu lang (max. 60 Zeichen)." };
  if (neuName === alt) return {};

  try {
    await prisma.gericht.updateMany({
      where: { bereich, kategorie: alt },
      data: { kategorie: neuName },
    });

    // Reihenfolge mitziehen: neuer Name erbt die Position des alten. Bei
    // Verschmelzung (Zielname existierte schon) bleibt nur ein Eintrag.
    const vorhandene = (
      await prisma.gericht.findMany({
        where: { bereich },
        distinct: ["kategorie"],
        select: { kategorie: true },
      })
    ).map((v) => v.kategorie);
    const gewuenscht = (await getKategorieReihenfolge(bereich as Bereich)).map((k) =>
      k === alt ? neuName : k,
    );
    const geordnet: string[] = [];
    const gesehen = new Set<string>();
    for (const k of [...gewuenscht, ...vorhandene]) {
      if (vorhandene.includes(k) && !gesehen.has(k)) {
        geordnet.push(k);
        gesehen.add(k);
      }
    }
    await persistiereKategorieReihenfolge(bereich, geordnet);
  } catch (error) {
    console.error("benenneKategorieUm:", error);
    return { fehler: "Umbenennen fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  return {};
}

/** Neue Kategorie-Reihenfolge eines Bereichs speichern (gemäß Drag & Drop). */
export async function speichereKategorieReihenfolge(bereich: string, namen: string[]) {
  await pruefeAuth();
  await persistiereKategorieReihenfolge(bereich, namen);
  revalidiere();
}

/** Neue Reihenfolge innerhalb einer Kategorie speichern (0..n gemäß Liste). */
export async function speichereGerichtReihenfolge(ids: string[]) {
  await pruefeAuth();
  await prisma.$transaction(
    ids.map((id, index) => prisma.gericht.update({ where: { id }, data: { reihenfolge: index } })),
  );
  revalidiere();
}
