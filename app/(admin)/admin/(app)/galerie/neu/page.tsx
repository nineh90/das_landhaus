import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import BildFormular from "@/components/admin/BildFormular";
import { erstelleBild } from "../actions";

export const metadata = { title: "Neues Bild" };

export default function NeuesBildSeite() {
  return (
    <>
      <AdminSeitenkopf titel="Neues Bild" beschreibung="Ein Bild zur Galerie hinzufügen." />
      <Karte className="max-w-2xl">
        <BildFormular aktion={erstelleBild} submitLabel="Bild hinzufügen" />
      </Karte>
    </>
  );
}
