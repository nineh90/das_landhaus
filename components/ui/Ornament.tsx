import { cn } from "@/lib/utils";

/**
 * Dezenter, vollbreiter Zier-Trenner: Linie – Blatt/Raute-Motiv – Linie.
 * Die Linien füllen per Flexbox die gesamte verfügbare Breite, das Mittelmotiv
 * bleibt in natürlicher Größe (unverzerrt). Rein dekorativ, erbt die Farbe
 * per `currentColor`. Passt zur warmen Landhaus-/Natur-Anmutung und steht
 * gleichermaßen für Restaurant, Imbiss und Kotten.
 */
export default function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full items-center gap-4", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <svg
        viewBox="0 0 60 16"
        fill="currentColor"
        role="presentation"
        className="h-4 w-auto shrink-0"
      >
        {/* linkes Blatt */}
        <path d="M20 8 C 15 3, 9 3, 6 8 C 9 13, 15 13, 20 8 Z" />
        {/* Raute in der Mitte */}
        <path d="M30 1.5 L 34.5 8 L 30 14.5 L 25.5 8 Z" />
        {/* rechtes Blatt */}
        <path d="M40 8 C 45 3, 51 3, 54 8 C 51 13, 45 13, 40 8 Z" />
      </svg>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}
