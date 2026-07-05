"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { bildSchema } from "@/lib/schemas";

export type FormErgebnis = { fehler?: string };

async function pruefeAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Nicht autorisiert.");
}

/** Seiten neu berechnen, auf denen Galerie-Bilder erscheinen. */
function revalidiere() {
  revalidatePath("/");
  revalidatePath("/galerie");
  revalidatePath("/restaurant");
  revalidatePath("/der-kotten");
  revalidatePath("/imbiss");
  revalidatePath("/admin/galerie");
}

function aufbereiten(d: ReturnType<typeof bildSchema.parse>) {
  return {
    url: d.url.trim(),
    alt: d.alt?.trim() || null,
    beschreibung: d.beschreibung?.trim() || null,
    bereich: d.bereich,
    reihenfolge: d.reihenfolge,
  };
}

export async function erstelleBild(werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = bildSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    await prisma.bild.create({ data: aufbereiten(parsed.data) });
  } catch (error) {
    console.error("erstelleBild:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  redirect("/admin/galerie?gespeichert=1");
}

export async function aktualisiereBild(id: string, werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = bildSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    await prisma.bild.update({ where: { id }, data: aufbereiten(parsed.data) });
  } catch (error) {
    console.error("aktualisiereBild:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  redirect("/admin/galerie?gespeichert=1");
}

export async function loescheBild(id: string) {
  await pruefeAuth();
  await prisma.bild.delete({ where: { id } });
  revalidiere();
}

/** Neue Reihenfolge der Galerie speichern (0..n gemäß Liste). */
export async function speichereBildReihenfolge(ids: string[]) {
  await pruefeAuth();
  await prisma.$transaction(
    ids.map((id, index) => prisma.bild.update({ where: { id }, data: { reihenfolge: index } })),
  );
  revalidiere();
}
