import { notFound } from "next/navigation";
import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import EventFormular from "@/components/admin/EventFormular";
import { eventById } from "@/lib/admin-data";
import { aktualisiereEvent } from "../actions";

export const metadata = { title: "Event bearbeiten" };

export default async function EventBearbeitenSeite({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await eventById(id);
  if (!event) notFound();

  const aktion = aktualisiereEvent.bind(null, event.id);

  return (
    <>
      <AdminSeitenkopf titel="Event bearbeiten" beschreibung={event.titel} />
      <Karte className="max-w-2xl">
        <EventFormular
          aktion={aktion}
          submitLabel="Änderungen speichern"
          standard={{
            titel: event.titel,
            slug: event.slug,
            beschreibung: event.beschreibung ?? "",
            datum: event.datum.toISOString().slice(0, 10),
            uhrzeit: event.uhrzeit,
            eintritt: event.eintritt ?? "",
            bild: event.bild ?? "",
            veroeffentlicht: event.veroeffentlicht,
          }}
        />
      </Karte>
    </>
  );
}
