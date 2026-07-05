import Link from "next/link";
import { alleEvents } from "@/lib/admin-data";
import { AdminSeitenkopf, Karte, LeerZustand, primaerBtn, gefahrBtn } from "@/components/admin/ui";
import { AdminIcon } from "@/components/admin/icons";
import ServerAktionButton from "@/components/admin/ServerAktionButton";
import { loescheEvent, toggleVeroeffentlicht } from "./actions";

const datumFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function EventsSeite() {
  const events = await alleEvents();
  const jetzt = new Date();

  return (
    <>
      <AdminSeitenkopf
        titel="Events"
        beschreibung="Veranstaltungen anlegen, bearbeiten, veröffentlichen."
      >
        <Link href="/admin/events/neu" className={primaerBtn}>
          + Neues Event
        </Link>
      </AdminSeitenkopf>

      {events.length === 0 ? (
        <LeerZustand
          icon={<AdminIcon name="events" className="h-6 w-6" />}
          titel="Noch keine Events"
          text="Lege dein erstes Event an — nach dem Veröffentlichen erscheint es auf der Website."
          cta={
            <Link href="/admin/events/neu" className={primaerBtn}>
              + Neues Event
            </Link>
          }
        />
      ) : (
        <Karte className="!p-0">
          <ul className="divide-y divide-tinte/10">
            {events.map((e) => {
              const vergangen = e.datum < jetzt;
              return (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-tinte">{e.titel}</span>
                      {vergangen && (
                        <span className="text-xs text-tinte/40">vergangen</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-tinte/50">
                      {datumFormat.format(e.datum)} · {e.uhrzeit}
                    </p>
                  </div>

                  <ServerAktionButton
                    action={toggleVeroeffentlicht.bind(null, e.id, !e.veroeffentlicht)}
                    title="Veröffentlichung umschalten"
                    className={
                      e.veroeffentlicht
                        ? "rounded-full bg-wald/10 px-3 py-1 text-xs font-semibold text-wald hover:bg-wald/20"
                        : "rounded-full bg-tinte/10 px-3 py-1 text-xs font-semibold text-tinte/50 hover:bg-tinte/20"
                    }
                  >
                    {e.veroeffentlicht ? "Veröffentlicht" : "Entwurf"}
                  </ServerAktionButton>

                  <Link
                    href={`/admin/events/${e.id}`}
                    className="rounded-full border border-tinte/20 px-4 py-1.5 text-sm font-semibold text-tinte hover:bg-tinte/5"
                  >
                    Bearbeiten
                  </Link>

                  <ServerAktionButton
                    action={loescheEvent.bind(null, e.id)}
                    bestaetigung={`„${e.titel}" wirklich löschen?`}
                    className={gefahrBtn}
                  >
                    Löschen
                  </ServerAktionButton>
                </li>
              );
            })}
          </ul>
        </Karte>
      )}
    </>
  );
}
