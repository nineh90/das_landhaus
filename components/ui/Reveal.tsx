"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Blendet seine Kinder sanft ein, sobald sie in den Viewport scrollen.
 * Schlank per IntersectionObserver (keine Animations-Library). Die eigentliche
 * Animation liegt in globals.css (.reveal) und respektiert `prefers-reduced-motion`.
 * Ohne JavaScript bleiben die Inhalte dank <noscript>-Fallback (siehe layout.tsx) sichtbar.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Verzögerung in ms für gestaffelte Effekte (z. B. Karten nacheinander). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown={shown}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
