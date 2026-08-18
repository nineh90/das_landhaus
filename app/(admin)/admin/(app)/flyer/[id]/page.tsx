import { notFound } from "next/navigation";
import { AdminSeitenkopf } from "@/components/admin/ui";
import FlyerFormular from "@/components/admin/FlyerFormular";
import { flyerById } from "@/lib/admin-data";
import { aktualisiereFlyer } from "../actions";

export const metadata = { title: "Flyer bearbeiten" };

/** yyyy-mm-dd für <input type="date"> — leeres Feld bei fehlendem Datum. */
function datumFeld(datum: Date | null): string {
  return datum ? datum.toISOString().slice(0, 10) : "";
}

export default async function FlyerBearbeitenSeite({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const flyer = await flyerById(id);
  if (!flyer) notFound();

  const aktion = aktualisiereFlyer.bind(null, flyer.id);

  return (
    <>
      <AdminSeitenkopf titel="Flyer bearbeiten" beschreibung={flyer.titel} />
      <div className="max-w-3xl">
        <FlyerFormular
          aktion={aktion}
          submitLabel="Änderungen speichern"
          vorschauHref={`/admin/flyer/${flyer.id}/druck`}
          standard={{
            titel: flyer.titel,
            ueberschrift: flyer.ueberschrift,
            unterzeile: flyer.unterzeile ?? "",
            vorwort: flyer.vorwort ?? "",
            grussformel: flyer.grussformel ?? "",
            bild: flyer.bild ?? "",
            mitEvents: flyer.mitEvents,
            mitOeffnungszeiten: flyer.mitOeffnungszeiten,
            gueltigVon: datumFeld(flyer.gueltigVon),
            gueltigBis: datumFeld(flyer.gueltigBis),
            aktionen: flyer.aktionen.map((a) => ({
              titel: a.titel,
              text: a.text ?? "",
              hinweis: a.hinweis ?? "",
              bild: a.bild ?? "",
            })),
          }}
        />
      </div>
    </>
  );
}
