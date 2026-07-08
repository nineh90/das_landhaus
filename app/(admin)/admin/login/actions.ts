"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { anmeldeSchema } from "@/lib/schemas";

export type AnmeldeStatus = { fehler?: string };

/**
 * Login-Server-Action (für useActionState). Bei Erfolg wirft signIn intern einen
 * Redirect (NEXT_REDIRECT) — der muss weitergereicht werden; nur echte
 * Auth-Fehler werden als Meldung zurückgegeben.
 */
export async function anmelden(
  _prev: AnmeldeStatus,
  formData: FormData,
): Promise<AnmeldeStatus> {
  const parsed = anmeldeSchema.safeParse({
    email: formData.get("email"),
    passwort: formData.get("passwort"),
  });
  if (!parsed.success) return { fehler: "Bitte E-Mail und Passwort eingeben." };

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) return { fehler: "E-Mail oder Passwort ist falsch." };
    throw error;
  }
  return {};
}
