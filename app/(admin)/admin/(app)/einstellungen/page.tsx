import type { Metadata } from "next";
import { einstellungenMap } from "@/lib/admin-data";
import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import EinstellungenFormular from "@/components/admin/EinstellungenFormular";
import { speichereEinstellungen } from "./actions";

export const metadata: Metadata = {
  title: "Einstellungen",
};

export default async function EinstellungenSeite() {
  const werte = await einstellungenMap();

  return (
    <>
      <AdminSeitenkopf
        titel="Einstellungen"
        beschreibung="Kontaktdaten, Öffnungszeiten und Karten-Einbindung."
      />

      <Karte className="max-w-2xl">
        <EinstellungenFormular standard={werte} aktion={speichereEinstellungen} />
      </Karte>
    </>
  );
}
