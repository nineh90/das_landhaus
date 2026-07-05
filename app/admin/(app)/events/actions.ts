"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { eventSchema } from "@/lib/schemas";

export type FormErgebnis = { fehler?: string };

async function pruefeAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Nicht autorisiert.");
}

/** Seiten neu berechnen, auf denen Events erscheinen. */
function revalidiere() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/der-kotten");
  revalidatePath("/admin/events");
}

function aufbereiten(d: ReturnType<typeof eventSchema.parse>) {
  return {
    titel: d.titel,
    slug: d.slug,
    beschreibung: d.beschreibung?.trim() || null,
    datum: new Date(d.datum),
    uhrzeit: d.uhrzeit,
    eintritt: d.eintritt?.trim() || null,
    bild: d.bild?.trim() || null,
    veroeffentlicht: d.veroeffentlicht,
  };
}

/** Prüft, ob der Fehler eine verletzte Unique-Constraint auf slug ist. */
function istSlugKonflikt(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function erstelleEvent(werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = eventSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    await prisma.event.create({ data: aufbereiten(parsed.data) });
  } catch (error) {
    if (istSlugKonflikt(error)) return { fehler: "Dieser Slug ist bereits vergeben." };
    console.error("erstelleEvent:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  redirect("/admin/events?gespeichert=1");
}

export async function aktualisiereEvent(id: string, werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = eventSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    await prisma.event.update({ where: { id }, data: aufbereiten(parsed.data) });
  } catch (error) {
    if (istSlugKonflikt(error)) return { fehler: "Dieser Slug ist bereits vergeben." };
    console.error("aktualisiereEvent:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere();
  redirect("/admin/events?gespeichert=1");
}

export async function toggleVeroeffentlicht(id: string, veroeffentlicht: boolean) {
  await pruefeAuth();
  await prisma.event.update({ where: { id }, data: { veroeffentlicht } });
  revalidiere();
}

export async function loescheEvent(id: string) {
  await pruefeAuth();
  await prisma.event.delete({ where: { id } });
  revalidiere();
}
