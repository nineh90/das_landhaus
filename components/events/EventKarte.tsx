import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types";
import { formatDatumKurz } from "@/lib/utils";

/** Karte für ein einzelnes Event — verlinkt auf die Detailseite. */
export default function EventKarte({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-creme-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-creme-dark">
        {event.bild && (
          <Image
            src={event.bild}
            alt={event.titel}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-akzent-dark">
          {formatDatumKurz(event.datum)} · {event.uhrzeit}
        </p>
        <h3 className="mt-1 font-display text-xl text-wald-dark">{event.titel}</h3>
        {event.beschreibung && (
          <p className="mt-2 line-clamp-3 text-sm text-tinte/75">{event.beschreibung}</p>
        )}
        <div className="mt-4 flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-wald">{event.eintritt ?? "—"}</span>
          <span className="text-sm font-semibold text-akzent-dark group-hover:underline">
            Mehr erfahren →
          </span>
        </div>
      </div>
    </Link>
  );
}
