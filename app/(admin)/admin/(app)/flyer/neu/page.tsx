import { AdminSeitenkopf } from "@/components/admin/ui";
import FlyerFormular from "@/components/admin/FlyerFormular";
import { erstelleFlyer } from "../actions";

export const metadata = { title: "Flyer erstellen" };

export default function NeuerFlyerSeite() {
  return (
    <>
      <AdminSeitenkopf
        titel="Flyer erstellen"
        beschreibung="Ein A4-Blatt im Stil der Speisekarte. Nach dem Speichern öffnet sich die Vorschau."
      />
      <div className="max-w-3xl">
        <FlyerFormular aktion={erstelleFlyer} submitLabel="Flyer anlegen" />
      </div>
    </>
  );
}
