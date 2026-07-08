import { notFound } from "next/navigation";
import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import GerichtFormular from "@/components/admin/GerichtFormular";
import { alleKategorien, gerichtById } from "@/lib/admin-data";
import { GERICHT_BEREICHE } from "@/lib/schemas";
import { aktualisiereGericht } from "../actions";

export const metadata = { title: "Gericht bearbeiten" };

export default async function GerichtBearbeitenSeite({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [gericht, kategorien] = await Promise.all([gerichtById(id), alleKategorien()]);
  if (!gericht) notFound();

  const aktion = aktualisiereGericht.bind(null, gericht.id);

  return (
    <>
      <AdminSeitenkopf titel="Gericht bearbeiten" beschreibung={gericht.name} />
      <Karte className="max-w-2xl">
        <GerichtFormular
          aktion={aktion}
          submitLabel="Änderungen speichern"
          kategorien={kategorien}
          standard={{
            name: gericht.name,
            beschreibung: gericht.beschreibung ?? "",
            preis: gericht.preis,
            kategorie: gericht.kategorie,
            bereich: gericht.bereich as (typeof GERICHT_BEREICHE)[number],
            verfuegbar: gericht.verfuegbar,
            bild: gericht.bild ?? "",
            reihenfolge: gericht.reihenfolge,
          }}
        />
      </Karte>
    </>
  );
}
