import { getKontakt } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";
import LinkButton from "./Button";

/**
 * Aufruf zur Kontaktaufnahme / Reservierung.
 * Build 1: ausschließlich Telefon- und WhatsApp-Links (kein Formular).
 * Nummern kommen aus den Einstellungen → in Stufe 2 nahtlos über Admin pflegbar.
 *
 * `titel`/`text` überschreiben die (localisierten) Standardtexte, wenn eine Seite
 * einen eigenen Aufruf braucht (z. B. „Feier anfragen").
 */
export default async function KontaktCTA({
  locale,
  titel,
  text,
  hell = false,
}: {
  locale: Locale;
  titel?: string;
  text?: string;
  hell?: boolean;
}) {
  const [{ telefon, whatsapp }, dict] = await Promise.all([getKontakt(), getDictionary(locale)]);
  const k = dict.kontakt;

  return (
    <div className="text-center">
      <h3 className={hell ? "text-2xl font-medium text-creme" : "text-2xl font-medium text-wald-dark"}>
        {titel ?? k.reservierenTitel}
      </h3>
      <p className={hell ? "mx-auto mt-2 max-w-xl text-creme/80" : "mx-auto mt-2 max-w-xl text-tinte/75"}>
        {text ?? k.reservierenText}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {telefon && (
          <LinkButton href={`tel:${telefon.replace(/\s/g, "")}`} variante="primary">
            {k.anrufen}: {telefon}
          </LinkButton>
        )}
        {whatsapp && (
          <LinkButton href={`https://wa.me/${whatsapp}`} variante="secondary">
            {k.whatsapp}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
