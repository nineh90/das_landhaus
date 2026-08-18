import Link from "next/link";
import { alleFlyer } from "@/lib/admin-data";
import { AdminSeitenkopf, Karte, LeerZustand, primaerBtn, gefahrBtn } from "@/components/admin/ui";
import { AdminIcon } from "@/components/admin/icons";
import ServerAktionButton from "@/components/admin/ServerAktionButton";
import { dupliziereFlyer, loescheFlyer } from "./actions";

export const metadata = { title: "Flyer" };

const datumFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function FlyerSeite() {
  const flyer = await alleFlyer();
  const heute = new Date();

  return (
    <>
      <AdminSeitenkopf
        titel="Flyer"
        beschreibung="Einseitige A4-Blätter im Stil der Speisekarte: Vorwort, Aktionen, Event-Ankündigungen."
      >
        <Link href="/admin/flyer/neu" className={primaerBtn}>
          + Flyer erstellen
        </Link>
      </AdminSeitenkopf>

      {flyer.length === 0 ? (
        <LeerZustand
          icon={<AdminIcon name="flyer" className="h-6 w-6" />}
          titel="Noch kein Flyer"
          text="Ein Flyer ist ein A4-Blatt zum Ausdrucken — mit demselben Kopf und Abbinder wie die Speisekarte. Ideal für das Vorwort als Einlage in die gedruckte Karte."
          cta={
            <Link href="/admin/flyer/neu" className={primaerBtn}>
              + Flyer erstellen
            </Link>
          }
        />
      ) : (
        <Karte className="!p-0">
          <ul className="divide-y divide-tinte/10">
            {flyer.map((f) => {
              const abgelaufen = !!f.gueltigBis && f.gueltigBis < heute;
              const bausteine = [
                f._count.aktionen > 0 &&
                  `${f._count.aktionen} ${f._count.aktionen === 1 ? "Aktion" : "Aktionen"}`,
                f.bild && "Bild",
                f.mitEvents && "Events",
                f.mitOeffnungszeiten && "Öffnungszeiten",
              ].filter(Boolean) as string[];

              return (
                <li
                  key={f.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-tinte">{f.titel}</span>
                      <span className="text-sm text-tinte/45">„{f.ueberschrift}“</span>
                      {abgelaufen && (
                        <span className="rounded-full bg-tinte/10 px-2 py-0.5 text-xs text-tinte/50">
                          abgelaufen
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-tinte/50">
                      {bausteine.length > 0 ? bausteine.join(" · ") : "nur Text"}
                      {f.gueltigBis && ` · gültig bis ${datumFormat.format(f.gueltigBis)}`}
                    </p>
                  </div>

                  <Link
                    href={`/admin/flyer/${f.id}/druck`}
                    className="rounded-full bg-akzent/10 px-4 py-1.5 text-sm font-semibold text-akzent hover:bg-akzent/20"
                  >
                    Vorschau / Drucken
                  </Link>

                  <Link
                    href={`/admin/flyer/${f.id}`}
                    className="rounded-full border border-tinte/20 px-4 py-1.5 text-sm font-semibold text-tinte hover:bg-tinte/5"
                  >
                    Bearbeiten
                  </Link>

                  {/* Der eigentliche Nutzen gespeicherter Flyer: die nächste
                      Aktion entsteht aus der letzten. */}
                  <ServerAktionButton
                    action={dupliziereFlyer.bind(null, f.id)}
                    title="Als Vorlage kopieren und bearbeiten"
                    className="rounded-full border border-tinte/20 px-4 py-1.5 text-sm font-semibold text-tinte hover:bg-tinte/5"
                  >
                    Duplizieren
                  </ServerAktionButton>

                  <ServerAktionButton
                    action={loescheFlyer.bind(null, f.id)}
                    bestaetigung={`„${f.titel}" wirklich löschen?`}
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
