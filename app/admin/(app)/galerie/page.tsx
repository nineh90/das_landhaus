import Link from "next/link";
import Image from "next/image";
import { alleBilder } from "@/lib/admin-data";
import { BILD_BEREICH_LABEL } from "@/lib/schemas";
import { AdminSeitenkopf, Karte, LeerZustand, primaerBtn, gefahrBtn } from "@/components/admin/ui";
import { AdminIcon } from "@/components/admin/icons";
import ServerAktionButton from "@/components/admin/ServerAktionButton";
import SortierbareListe from "@/components/admin/SortierbareListe";
import { loescheBild, speichereBildReihenfolge } from "./actions";

type Bild = Awaited<ReturnType<typeof alleBilder>>[number];

function BildInhalt({ b }: { b: Bild }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-creme-dark">
        <Image src={b.url} alt={b.alt ?? ""} fill unoptimized className="object-cover" sizes="80px" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-creme-dark px-2 py-0.5 text-xs text-tinte/60">
            {BILD_BEREICH_LABEL[b.bereich as keyof typeof BILD_BEREICH_LABEL]}
          </span>
          <span className="truncate text-sm font-medium text-tinte">
            {b.beschreibung || <span className="text-tinte/40">— keine Beschreibung —</span>}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-tinte/40">{b.url}</p>
      </div>

      <Link
        href={`/admin/galerie/${b.id}`}
        className="rounded-full border border-tinte/20 px-4 py-1.5 text-sm font-semibold text-tinte hover:bg-tinte/5"
      >
        Bearbeiten
      </Link>

      <ServerAktionButton
        action={loescheBild.bind(null, b.id)}
        bestaetigung="Dieses Bild wirklich aus der Galerie entfernen?"
        className={gefahrBtn}
      >
        Löschen
      </ServerAktionButton>
    </div>
  );
}

export default async function GalerieSeite() {
  const bilder = await alleBilder();

  return (
    <>
      <AdminSeitenkopf
        titel="Galerie"
        beschreibung="Bilder verwalten, beschriften und per Ziehgriff (⠿) sortieren."
      >
        <Link href="/admin/galerie/neu" className={primaerBtn}>
          + Neues Bild
        </Link>
      </AdminSeitenkopf>

      <Karte className="mb-6">
        <p className="text-sm text-tinte/60">
          Der echte Datei-Upload folgt später. Bilder werden derzeit als Pfad unter{" "}
          <code className="rounded bg-creme-dark px-1 py-0.5 text-xs text-tinte">/public/images</code>{" "}
          referenziert, z. B.{" "}
          <code className="rounded bg-creme-dark px-1 py-0.5 text-xs text-tinte">
            /images/galerie/essen-burger.jpg
          </code>
          .
        </p>
      </Karte>

      {bilder.length === 0 ? (
        <LeerZustand
          icon={<AdminIcon name="galerie" className="h-6 w-6" />}
          titel="Noch keine Bilder"
          text="Füge das erste Bild zur Galerie hinzu — es erscheint dann auf der Website."
          cta={
            <Link href="/admin/galerie/neu" className={primaerBtn}>
              + Neues Bild
            </Link>
          }
        />
      ) : (
        <Karte className="!p-0 !py-1">
          <SortierbareListe
            items={bilder.map((b) => ({ id: b.id, inhalt: <BildInhalt b={b} /> }))}
            onReorder={speichereBildReihenfolge}
          />
        </Karte>
      )}
    </>
  );
}
