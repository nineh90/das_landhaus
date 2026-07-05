import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import EventFormular from "@/components/admin/EventFormular";
import { erstelleEvent } from "../actions";

export const metadata = { title: "Neues Event" };

export default function NeuesEventSeite() {
  return (
    <>
      <AdminSeitenkopf titel="Neues Event" beschreibung="Eine Veranstaltung hinzufügen." />
      <Karte className="max-w-2xl">
        <EventFormular aktion={erstelleEvent} submitLabel="Event anlegen" />
      </Karte>
    </>
  );
}
