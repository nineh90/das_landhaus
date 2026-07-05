import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

/** Überschrift mit optionaler Kicker-Zeile und Einleitungstext. */
export default function SectionHeading({
  kicker,
  titel,
  text,
  zentriert = true,
  hell = false,
}: {
  kicker?: string;
  titel: string;
  text?: string;
  zentriert?: boolean;
  hell?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", zentriert && "mx-auto text-center")}>
      {kicker && (
        <p
          className={cn(
            "mb-2 text-sm font-semibold uppercase tracking-widest",
            hell ? "text-akzent" : "text-akzent-dark",
          )}
        >
          {kicker}
        </p>
      )}
      <h2 className={cn("text-3xl sm:text-4xl font-medium", hell ? "text-creme" : "text-wald-dark")}>
        {titel}
      </h2>
      {text && (
        <p className={cn("mt-4 text-lg leading-relaxed", hell ? "text-creme/80" : "text-tinte/75")}>
          {text}
        </p>
      )}
    </Reveal>
  );
}
