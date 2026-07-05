import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminSeitenkopf, Karte } from "@/components/admin/ui";
import { AdminIcon, type IconName } from "@/components/admin/icons";

export default async function AdminDashboard() {
  const [gerichte, gerichteAktiv, events, eventsPubliziert, bilder] = await Promise.all([
    prisma.gericht.count(),
    prisma.gericht.count({ where: { verfuegbar: true } }),
    prisma.event.count(),
    prisma.event.count({ where: { veroeffentlicht: true } }),
    prisma.bild.count(),
  ]);

  const kacheln: { href: string; titel: string; wert: string; detail: string; icon: IconName }[] = [
    {
      href: "/admin/speisekarte",
      titel: "Speisekarte",
      wert: `${gerichte} Gerichte`,
      detail: `${gerichteAktiv} verfügbar`,
      icon: "speisekarte",
    },
    {
      href: "/admin/events",
      titel: "Events",
      wert: `${events} Events`,
      detail: `${eventsPubliziert} veröffentlicht`,
      icon: "events",
    },
    {
      href: "/admin/galerie",
      titel: "Galerie",
      wert: `${bilder} Bilder`,
      detail: "verwalten & sortieren",
      icon: "galerie",
    },
    {
      href: "/admin/einstellungen",
      titel: "Einstellungen",
      wert: "Kontakt & Zeiten",
      detail: "Öffnungszeiten, Telefon …",
      icon: "einstellungen",
    },
  ];

  return (
    <>
      <AdminSeitenkopf
        titel="Übersicht"
        beschreibung="Willkommen im Admin-Bereich. Hier pflegst du die Inhalte der Website."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kacheln.map((k) => (
          <Link key={k.href} href={k.href} className="group">
            <Karte className="h-full transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-akzent/10 text-akzent">
                  <AdminIcon name={k.icon} />
                </span>
                <span
                  aria-hidden="true"
                  className="text-tinte/25 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-akzent"
                >
                  →
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-akzent">{k.titel}</p>
              <p className="mt-1 font-display text-2xl text-tinte">{k.wert}</p>
              <p className="mt-1 text-sm text-tinte/50">{k.detail}</p>
            </Karte>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-tinte/50">
        Tipp: Änderungen sind sofort auf der{" "}
        <Link href="/" className="font-semibold text-akzent hover:underline" target="_blank">
          öffentlichen Website
        </Link>{" "}
        sichtbar.
      </p>
    </>
  );
}
