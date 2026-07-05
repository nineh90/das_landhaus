import { getKontakt } from "@/lib/content";
import LinkButton from "./Button";

/**
 * Aufruf zur Kontaktaufnahme / Reservierung.
 * Build 1: ausschließlich Telefon- und WhatsApp-Links (kein Formular).
 * Nummern kommen aus den Einstellungen → in Stufe 2 nahtlos über Admin pflegbar.
 */
export default async function KontaktCTA({
  titel = "Tisch reservieren",
  text = "Reservierungen nehmen wir gern telefonisch oder per WhatsApp entgegen.",
  hell = false,
}: {
  titel?: string;
  text?: string;
  hell?: boolean;
}) {
  const { telefon, whatsapp } = await getKontakt();

  return (
    <div className="text-center">
      <h3 className={hell ? "text-2xl font-medium text-creme" : "text-2xl font-medium text-wald-dark"}>
        {titel}
      </h3>
      <p className={hell ? "mx-auto mt-2 max-w-xl text-creme/80" : "mx-auto mt-2 max-w-xl text-tinte/75"}>
        {text}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {telefon && (
          <LinkButton href={`tel:${telefon.replace(/\s/g, "")}`} variante="primary">
            Anrufen: {telefon}
          </LinkButton>
        )}
        {whatsapp && (
          <LinkButton href={`https://wa.me/${whatsapp}`} variante="secondary">
            Per WhatsApp schreiben
          </LinkButton>
        )}
      </div>
    </div>
  );
}
