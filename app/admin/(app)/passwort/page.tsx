import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import PasswortFormular from "@/components/admin/PasswortFormular";
import { passwortAendern } from "./actions";

export const metadata = { title: "Passwort ändern" };

export default function PasswortSeite() {
  return (
    <>
      <AdminSeitenkopf
        titel="Passwort ändern"
        beschreibung="Wähle ein neues Passwort für deinen Admin-Zugang."
      />
      <Karte className="max-w-md">
        <PasswortFormular aktion={passwortAendern} />
      </Karte>
    </>
  );
}
