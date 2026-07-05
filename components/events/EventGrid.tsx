import type { Event } from "@/types";
import EventKarte from "./EventKarte";
import Reveal from "@/components/ui/Reveal";

/** Raster aus Event-Karten. Zeigt einen Hinweis, wenn keine Events vorliegen. */
export default function EventGrid({
  events,
  leerText = "Aktuell sind keine Termine geplant. Schau bald wieder vorbei!",
}: {
  events: Event[];
  leerText?: string;
}) {
  if (events.length === 0) {
    return <p className="text-center text-tinte/70">{leerText}</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <Reveal key={event.id} delay={(i % 3) * 120} className="flex">
          <EventKarte event={event} />
        </Reveal>
      ))}
    </div>
  );
}
