"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { istAktiverPfad } from "./nav-links";

/**
 * Navigations-Link mit Aktiv-Markierung. Vergleicht den Ziel-Pfad mit dem
 * aktuellen Pfad (`usePathname`) und wendet je nachdem `activeClassName` bzw.
 * `inactiveClassName` an. Bewusst dezent gehalten (nur Textfarbe, kein Kasten).
 * Wird von der Desktop- und der mobilen Navigation genutzt.
 */
export default function NavLink({
  href,
  className,
  activeClassName,
  inactiveClassName,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const aktiv = istAktiverPfad(pathname ?? "", href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={aktiv ? "page" : undefined}
      className={cn(className, aktiv ? activeClassName : inactiveClassName)}
    >
      {children}
    </Link>
  );
}
