import { notFound } from "next/navigation";
import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import BildFormular from "@/components/admin/BildFormular";
import { bildById } from "@/lib/admin-data";
import { BILD_BEREICHE } from "@/lib/schemas";
import { aktualisiereBild } from "../actions";

export const metadata = { title: "Bild bearbeiten" };

export default async function BildBearbeitenSeite({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bild = await bildById(id);
  if (!bild) notFound();

  const aktion = aktualisiereBild.bind(null, bild.id);

  return (
    <>
      <AdminSeitenkopf titel="Bild bearbeiten" beschreibung={bild.beschreibung ?? bild.url} />
      <Karte className="max-w-2xl">
        <BildFormular
          aktion={aktion}
          submitLabel="Änderungen speichern"
          standard={{
            url: bild.url,
            alt: bild.alt ?? "",
            beschreibung: bild.beschreibung ?? "",
            bereich: bild.bereich as (typeof BILD_BEREICHE)[number],
            reihenfolge: bild.reihenfolge,
          }}
        />
      </Karte>
    </>
  );
}
