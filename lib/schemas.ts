import { z } from "zod";

/**
 * Zentrale Validierungs-Schemas (Zod).
 *
 * Bewusst EINMAL definiert und doppelt genutzt: im Client-Formular (React Hook
 * Form via zodResolver) UND in der jeweiligen Server-Action (erneute Prüfung —
 * Client-Eingaben werden serverseitig nie blind vertraut).
 */

/* ------------------------------ Login ------------------------------- */

export const anmeldeSchema = z.object({
  email: z.email("Bitte eine gültige E-Mail-Adresse eingeben."),
  passwort: z.string().min(1, "Bitte das Passwort eingeben."),
});
export type AnmeldeDaten = z.infer<typeof anmeldeSchema>;

export const passwortAendernSchema = z
  .object({
    aktuell: z.string().min(1, "Bitte das aktuelle Passwort eingeben."),
    neu: z.string().min(8, "Neues Passwort: mindestens 8 Zeichen."),
    wiederholung: z.string().min(1, "Bitte das neue Passwort wiederholen."),
  })
  .refine((d) => d.neu === d.wiederholung, {
    message: "Die neuen Passwörter stimmen nicht überein.",
    path: ["wiederholung"],
  });
export type PasswortAendernFormular = z.input<typeof passwortAendernSchema>;

/* ----------------------------- Gerichte ----------------------------- */

export const GERICHT_BEREICHE = ["restaurant", "imbiss"] as const;

// Kategorien sind bewusst FREI wählbar (keine feste Liste): Die Speisekarte
// entwickelt sich, und der Betreiber soll Kategorien selbst anlegen und
// umbenennen können. Das Formular schlägt die bereits vorhandenen Kategorien
// per Datalist vor — pflegt aber keine Zwangsauswahl.
export const gerichtSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich.").max(120),
  beschreibung: z.string().trim().max(500).optional().default(""),
  preis: z
    .number({ error: "Preis muss eine Zahl sein." })
    .min(0, "Preis darf nicht negativ sein.")
    .max(9999),
  kategorie: z.string().trim().min(1, "Bitte eine Kategorie angeben.").max(60),
  bereich: z.enum(GERICHT_BEREICHE, { error: "Bitte einen Bereich wählen." }),
  verfuegbar: z.boolean().default(true),
  bild: z.string().trim().max(500).optional().default(""),
  reihenfolge: z.number().int("Ganze Zahl erwartet.").min(0).max(9999).default(0),
});
export type GerichtFormular = z.input<typeof gerichtSchema>;

/* ------------------------------ Events ------------------------------ */

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const eventSchema = z.object({
  titel: z.string().trim().min(1, "Titel ist erforderlich.").max(160),
  slug: z
    .string()
    .trim()
    .min(1, "Slug ist erforderlich.")
    .max(160)
    .regex(SLUG_REGEX, "Nur Kleinbuchstaben, Zahlen und Bindestriche (z. B. schlager-nacht)."),
  beschreibung: z.string().trim().max(2000).optional().default(""),
  datum: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte ein gültiges Datum wählen."),
  uhrzeit: z.string().trim().min(1, "Uhrzeit ist erforderlich.").max(40),
  eintritt: z.string().trim().max(80).optional().default(""),
  bild: z.string().trim().max(500).optional().default(""),
  veroeffentlicht: z.boolean().default(false),
});
export type EventFormular = z.input<typeof eventSchema>;

/* ------------------------------ Bilder ------------------------------ */

export const BILD_BEREICHE = [
  "aussen",
  "restaurant",
  "imbiss",
  "kotten",
  "essen",
  "events",
] as const;

export const BILD_BEREICH_LABEL: Record<(typeof BILD_BEREICHE)[number], string> = {
  aussen: "Das Landhaus (außen)",
  restaurant: "Restaurant",
  imbiss: "Imbiss",
  kotten: "Der Kotten",
  essen: "Essen",
  events: "Events",
};

export const bildSchema = z.object({
  url: z.string().trim().min(1, "Bildpfad/URL ist erforderlich.").max(500),
  alt: z.string().trim().max(300).optional().default(""),
  beschreibung: z.string().trim().max(300).optional().default(""),
  bereich: z.enum(BILD_BEREICHE, { error: "Bitte einen Bereich wählen." }),
  reihenfolge: z.number().int().min(0).max(9999).default(0),
});
export type BildFormular = z.input<typeof bildSchema>;

/* --------------------------- Einstellungen -------------------------- */

/**
 * Bekannte Einstellungs-Schlüssel mit Label und Eingabetyp fürs Admin-Formular.
 * Neue Keys hier ergänzen — Formular und Validierung ziehen automatisch nach.
 */
export const EINSTELLUNG_FELDER = [
  { key: "telefon", label: "Telefon", typ: "text" },
  { key: "whatsapp", label: "WhatsApp (nur Ziffern, z. B. 4954820000000)", typ: "text" },
  { key: "email", label: "E-Mail", typ: "text" },
  { key: "adresse", label: "Adresse", typ: "text" },
  { key: "oeffnungszeiten_restaurant", label: "Öffnungszeiten Restaurant", typ: "textarea" },
  { key: "oeffnungszeiten_imbiss", label: "Öffnungszeiten Imbiss", typ: "textarea" },
  { key: "oeffnungszeiten_kotten", label: "Öffnungszeiten Der Kotten", typ: "textarea" },
  { key: "maps_embed", label: "Google-Maps Embed-URL", typ: "textarea" },
] as const;

export const EINSTELLUNG_KEYS = EINSTELLUNG_FELDER.map((f) => f.key);

// Alle Felder sind optionale Strings (leer = Wert löschen/leeren).
export const einstellungenSchema = z.object(
  Object.fromEntries(
    EINSTELLUNG_FELDER.map((f) => [f.key, z.string().trim().max(2000).optional().default("")]),
  ) as Record<(typeof EINSTELLUNG_FELDER)[number]["key"], z.ZodDefault<z.ZodOptional<z.ZodString>>>,
);
export type EinstellungenFormular = z.input<typeof einstellungenSchema>;
