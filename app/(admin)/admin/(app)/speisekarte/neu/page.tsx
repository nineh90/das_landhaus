import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import GerichtFormular from "@/components/admin/GerichtFormular";
import { alleKategorien } from "@/lib/admin-data";
import { erstelleGericht } from "../actions";

export const metadata = { title: "Neues Gericht" };

export default async function NeuesGerichtSeite() {
  const kategorien = await alleKategorien();
  return (
    <>
      <AdminSeitenkopf titel="Neues Gericht" beschreibung="Ein Gericht zur Speisekarte hinzufügen." />
      <Karte className="max-w-2xl">
        <GerichtFormular
          aktion={erstelleGericht}
          submitLabel="Gericht anlegen"
          kategorien={kategorien}
        />
      </Karte>
    </>
  );
}
