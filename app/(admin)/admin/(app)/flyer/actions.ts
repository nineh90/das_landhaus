"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { flyerSchema } from "@/lib/schemas";

export type FormErgebnis = { fehler?: string };

async function pruefeAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Nicht autorisiert.");
}

/** Verwaltung und Druckansicht neu berechnen. */
function revalidiere(id?: string) {
  revalidatePath("/admin/flyer");
  if (id) revalidatePath(`/admin/flyer/${id}/druck`);
}

type FlyerWerte = ReturnType<typeof flyerSchema.parse>;

/** Leerer Text bedeutet „nicht gepflegt" — in der DB ist das `null`, nicht "". */
function oderNull(wert: string | undefined): string | null {
  return wert?.trim() || null;
}

/** Leeres Datumsfeld ("") → null; sonst yyyy-mm-dd wie beim Event. */
function zuDatum(wert: string | undefined): Date | null {
  return wert ? new Date(wert) : null;
}

function aufbereiten(d: FlyerWerte) {
  return {
    titel: d.titel,
    ueberschrift: d.ueberschrift,
    unterzeile: oderNull(d.unterzeile),
    vorwort: oderNull(d.vorwort),
    grussformel: oderNull(d.grussformel),
    bild: oderNull(d.bild),
    mitEvents: d.mitEvents,
    mitOeffnungszeiten: d.mitOeffnungszeiten,
    gueltigVon: zuDatum(d.gueltigVon),
    gueltigBis: zuDatum(d.gueltigBis),
  };
}

/**
 * Aktionsblöcke fürs `create`-Nested-Write. Die Reihenfolge im Formular ist die
 * gedruckte Reihenfolge — sie wird als Index festgehalten, damit sie unabhängig
 * von der Sortierung in der DB erhalten bleibt.
 */
function aktionenDaten(aktionen: FlyerWerte["aktionen"]) {
  return aktionen.map((a, i) => ({
    titel: a.titel,
    text: oderNull(a.text),
    hinweis: oderNull(a.hinweis),
    bild: oderNull(a.bild),
    reihenfolge: i,
  }));
}

export async function erstelleFlyer(werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = flyerSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  let id: string;
  try {
    const flyer = await prisma.flyer.create({
      data: {
        ...aufbereiten(parsed.data),
        aktionen: { create: aktionenDaten(parsed.data.aktionen) },
      },
    });
    id = flyer.id;
  } catch (error) {
    console.error("erstelleFlyer:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere(id);
  // Direkt in die Vorschau: ein Flyer wird angelegt, um ihn zu drucken — und nur
  // auf dem A4-Blatt ist zu sehen, ob der Text passt.
  redirect(`/admin/flyer/${id}/druck?gespeichert=1`);
}

export async function aktualisiereFlyer(id: string, werte: unknown): Promise<FormErgebnis> {
  await pruefeAuth();
  const parsed = flyerSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte die Eingaben prüfen." };

  try {
    // Die Aktionsblöcke werden ersetzt, nicht abgeglichen: sie sind reiner
    // Inhalt dieses Flyers, auf den nichts anderes verweist. Beides in einer
    // Transaktion, damit kein Flyer ohne seine Blöcke zurückbleibt.
    await prisma.$transaction([
      prisma.flyerAktion.deleteMany({ where: { flyerId: id } }),
      prisma.flyer.update({
        where: { id },
        data: {
          ...aufbereiten(parsed.data),
          aktionen: { create: aktionenDaten(parsed.data.aktionen) },
        },
      }),
    ]);
  } catch (error) {
    console.error("aktualisiereFlyer:", error);
    return { fehler: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidiere(id);
  redirect(`/admin/flyer/${id}/druck?gespeichert=1`);
}

/**
 * Flyer duplizieren — der eigentliche Grund, Flyer überhaupt zu speichern: Das
 * Vorwort der nächsten Saison oder die Aktion des nächsten Monats entsteht aus
 * der letzten, statt neu getippt zu werden.
 */
export async function dupliziereFlyer(id: string) {
  await pruefeAuth();

  const vorlage = await prisma.flyer.findUnique({
    where: { id },
    include: { aktionen: { orderBy: { reihenfolge: "asc" } } },
  });
  if (!vorlage) return;

  const kopie = await prisma.flyer.create({
    data: {
      titel: `${vorlage.titel} (Kopie)`,
      ueberschrift: vorlage.ueberschrift,
      unterzeile: vorlage.unterzeile,
      vorwort: vorlage.vorwort,
      grussformel: vorlage.grussformel,
      bild: vorlage.bild,
      mitEvents: vorlage.mitEvents,
      mitOeffnungszeiten: vorlage.mitOeffnungszeiten,
      // Gültigkeitszeitraum bewusst NICHT übernommen: die Kopie ist für einen
      // neuen Zeitraum gedacht, und ein stehengebliebenes Datum wäre falsch
      // gedruckt.
      aktionen: {
        create: vorlage.aktionen.map((a) => ({
          titel: a.titel,
          text: a.text,
          hinweis: a.hinweis,
          bild: a.bild,
          reihenfolge: a.reihenfolge,
        })),
      },
    },
  });

  revalidiere();
  redirect(`/admin/flyer/${kopie.id}`);
}

export async function loescheFlyer(id: string) {
  await pruefeAuth();
  // Die Aktionsblöcke gehen per onDelete: Cascade mit.
  await prisma.flyer.delete({ where: { id } });
  revalidiere();
}
