import Link from "next/link";
import { alleGerichte } from "@/lib/admin-data";
import { getKategorieReihenfolge, sortiereKategorien } from "@/lib/content";
import { AdminSeitenkopf, Karte, LeerZustand, primaerBtn, gefahrBtn } from "@/components/admin/ui";
import { AdminIcon } from "@/components/admin/icons";
import ServerAktionButton from "@/components/admin/ServerAktionButton";
import SortierbareListe from "@/components/admin/SortierbareListe";
import SortierbareKategorien from "@/components/admin/SortierbareKategorien";
import KategorieUmbenennen from "@/components/admin/KategorieUmbenennen";
import EinklappbareKategorie from "@/components/admin/EinklappbareKategorie";
import {
  benenneKategorieUm,
  loescheGericht,
  speichereGerichtReihenfolge,
  speichereKategorieReihenfolge,
  toggleVerfuegbar,
} from "./actions";

const BEREICH_LABEL: Record<string, string> = { restaurant: "Restaurant", imbiss: "Imbiss" };

function preisFormat(preis: number) {
  return `${preis.toFixed(2).replace(".", ",")} €`;
}

type Gericht = Awaited<ReturnType<typeof alleGerichte>>[number];

function GerichtInhalt({ g }: { g: Gericht }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
      <div className="min-w-0 flex-1">
        <span className="font-semibold text-tinte">{g.name}</span>
        {g.beschreibung && (
          <p className="mt-0.5 truncate text-sm text-tinte/50">{g.beschreibung}</p>
        )}
      </div>

      <span className="tabular-nums font-semibold text-tinte">{preisFormat(g.preis)}</span>

      <ServerAktionButton
        action={toggleVerfuegbar.bind(null, g.id, !g.verfuegbar)}
        title="Sichtbarkeit umschalten"
        className={
          g.verfuegbar
            ? "rounded-full bg-wald/10 px-3 py-1 text-xs font-semibold text-wald hover:bg-wald/20"
            : "rounded-full bg-tinte/10 px-3 py-1 text-xs font-semibold text-tinte/50 hover:bg-tinte/20"
        }
      >
        {g.verfuegbar ? "Sichtbar" : "Versteckt"}
      </ServerAktionButton>

      <Link
        href={`/admin/speisekarte/${g.id}`}
        className="rounded-full border border-tinte/20 px-4 py-1.5 text-sm font-semibold text-tinte hover:bg-tinte/5"
      >
        Bearbeiten
      </Link>

      <ServerAktionButton
        action={loescheGericht.bind(null, g.id)}
        bestaetigung={`„${g.name}" wirklich löschen?`}
        className={gefahrBtn}
      >
        Löschen
      </ServerAktionButton>
    </div>
  );
}

export default async function SpeisekarteSeite() {
  const bereiche = ["restaurant", "imbiss"] as const;
  const [gerichte, reihenfolgeEintraege] = await Promise.all([
    alleGerichte(),
    Promise.all(bereiche.map(async (b) => [b, await getKategorieReihenfolge(b)] as const)),
  ]);
  const reihenfolgen = Object.fromEntries(reihenfolgeEintraege) as Record<
    (typeof bereiche)[number],
    string[]
  >;

  return (
    <>
      <AdminSeitenkopf
        titel="Speisekarte"
        beschreibung="Gerichte anlegen, bearbeiten, ein-/ausblenden. Kategorie anklicken zum Auf-/Zuklappen. Gerichte innerhalb einer Kategorie und ganze Kategorien per Ziehgriff (⠿) sortieren."
      >
        <Link href="/admin/speisekarte/neu" className={primaerBtn}>
          + Neues Gericht
        </Link>
      </AdminSeitenkopf>

      <div className="space-y-10">
        {bereiche.map((bereich) => {
          const inBereich = gerichte.filter((g) => g.bereich === bereich);
          const kategorien = sortiereKategorien(
            Array.from(new Set(inBereich.map((g) => g.kategorie))),
            reihenfolgen[bereich],
          );

          return (
            <section key={bereich}>
              <h2 className="mb-3 font-display text-xl text-tinte">
                {BEREICH_LABEL[bereich]}{" "}
                <span className="text-sm font-normal text-tinte/40">({inBereich.length})</span>
              </h2>

              {inBereich.length === 0 ? (
                <LeerZustand
                  icon={<AdminIcon name="speisekarte" className="h-6 w-6" />}
                  titel="Noch keine Gerichte"
                  text={`Für den Bereich ${BEREICH_LABEL[bereich]} ist noch nichts angelegt.`}
                  cta={
                    <Link href="/admin/speisekarte/neu" className={primaerBtn}>
                      + Neues Gericht
                    </Link>
                  }
                />
              ) : (
                <SortierbareKategorien
                  onReorder={speichereKategorieReihenfolge.bind(null, bereich)}
                  items={kategorien.map((kategorie) => {
                    const liste = inBereich.filter((g) => g.kategorie === kategorie);
                    return {
                      id: kategorie,
                      inhalt: (
                        <EinklappbareKategorie
                          kategorie={kategorie}
                          anzahl={liste.length}
                          umbenennen={
                            <KategorieUmbenennen
                              aktuell={kategorie}
                              aktion={benenneKategorieUm.bind(null, bereich, kategorie)}
                            />
                          }
                        >
                          <Karte className="!p-0 !py-1">
                            <SortierbareListe
                              items={liste.map((g) => ({
                                id: g.id,
                                inhalt: <GerichtInhalt g={g} />,
                              }))}
                              onReorder={speichereGerichtReihenfolge}
                            />
                          </Karte>
                        </EinklappbareKategorie>
                      ),
                    };
                  })}
                />
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
