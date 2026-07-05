import { cn } from "@/lib/utils";
import Container from "./Container";

/**
 * Vertikaler Abschnitt mit großzügigem Abstand. Optional ein Hintergrund-Token
 * (z. B. "bg-creme-dark" oder "bg-wald") für abwechselnde Sektionen.
 */
export default function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-14 sm:py-20", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
