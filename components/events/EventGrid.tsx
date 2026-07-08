import type { Event } from "@/types";
import EventKarte from "./EventKarte";
import Reveal from "@/components/ui/Reveal";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

/** Raster aus Event-Karten. Zeigt einen Hinweis, wenn keine Events vorliegen. */
export default async function EventGrid({
  events,
  locale,
  leerText,
}: {
  events: Event[];
  locale: Locale;
  /** Überschreibt den Standard-Hinweis; "" blendet ihn ganz aus (z. B. bei vergangenen Events). */
  leerText?: string;
}) {
  const dict = await getDictionary(locale);
  const labels = { mehrErfahren: dict.common.mehrErfahren, eintrittLeer: dict.events.eintrittLeer };

  if (events.length === 0) {
    const hinweis = leerText ?? dict.events.leer;
    return hinweis ? <p className="text-center text-tinte/70">{hinweis}</p> : null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, i) => (
        <Reveal key={event.id} delay={(i % 3) * 120} className="flex">
          <EventKarte event={event} locale={locale} labels={labels} />
        </Reveal>
      ))}
    </div>
  );
}
