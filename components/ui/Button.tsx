import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "primary" | "secondary" | "ghost";

const varianten: Record<Variante, string> = {
  primary: "bg-akzent text-creme hover:bg-akzent-dark",
  secondary: "bg-wald text-creme hover:bg-wald-dark",
  ghost: "border border-creme/40 text-creme hover:bg-creme/10",
};

const basis =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-akzent focus-visible:ring-offset-2";

/**
 * Link-Button (interner Link oder externe URL / tel: / mailto: / wa.me).
 * Externe bzw. Protokoll-Links werden als <a> gerendert, interne als next/link.
 */
export default function LinkButton({
  href,
  children,
  variante = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variante?: Variante;
  className?: string;
}) {
  const klasse = cn(basis, varianten[variante], className);
  const istExtern = /^(https?:|tel:|mailto:)/.test(href);

  if (istExtern) {
    return (
      <a
        href={href}
        className={klasse}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={klasse}>
      {children}
    </Link>
  );
}
