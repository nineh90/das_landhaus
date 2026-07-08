"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { einstellungenSchema, EINSTELLUNG_KEYS } from "@/lib/schemas";

export type SpeicherErgebnis = { ok?: boolean; fehler?: string };

async function pruefeAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Nicht autorisiert.");
}

export async function speichereEinstellungen(werte: unknown): Promise<SpeicherErgebnis> {
  await pruefeAuth();

  const parsed = einstellungenSchema.safeParse(werte);
  if (!parsed.success) return { fehler: "Bitte Eingaben prüfen." };

  const daten = parsed.data as Record<string, string | undefined>;

  try {
    await prisma.$transaction(
      EINSTELLUNG_KEYS.map((key) => {
        const value = (daten[key] ?? "").trim();
        return prisma.einstellung.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }),
    );
  } catch (error) {
    console.error("speichereEinstellungen:", error);
    return { fehler: "Speichern fehlgeschlagen." };
  }

  revalidatePath("/");
  revalidatePath("/anfahrt");
  revalidatePath("/restaurant");
  revalidatePath("/imbiss");
  revalidatePath("/der-kotten");
  revalidatePath("/admin/einstellungen");

  return { ok: true };
}
