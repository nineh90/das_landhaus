"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon, type IconName } from "@/components/admin/icons";

const LINKS: { href: string; label: string; icon: IconName; exakt?: boolean }[] = [
  { href: "/admin", label: "Übersicht", icon: "uebersicht", exakt: true },
  { href: "/admin/speisekarte", label: "Speisekarte", icon: "speisekarte" },
  { href: "/admin/events", label: "Events", icon: "events" },
  { href: "/admin/galerie", label: "Galerie", icon: "galerie" },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: "einstellungen" },
  { href: "/admin/passwort", label: "Passwort", icon: "passwort" },
];

export default function AdminNav() {
  const pfad = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {LINKS.map((l) => {
        const aktiv = l.exakt ? pfad === l.href : pfad.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={aktiv ? "page" : undefined}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              aktiv
                ? "bg-creme text-wald-dark shadow-sm"
                : "text-creme/80 hover:bg-creme/10 hover:text-creme"
            }`}
          >
            <AdminIcon name={l.icon} className="h-4 w-4" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
