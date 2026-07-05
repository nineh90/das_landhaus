"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Hintergrund des Heros: stimmungsvolles Bild mit sanftem Ken-Burns-Zoom
 * (CSS, siehe .hero-zoom) plus dezentem Scroll-Parallax (JS).
 *
 * Der Zoom liegt auf dem <Image>, der Parallax auf dem umschließenden Wrapper —
 * so überlagern sich die beiden transform-Ebenen nicht. Bewegung wird per
 * requestAnimationFrame gedrosselt und bei `prefers-reduced-motion` komplett
 * ausgelassen. Der Wrapper ist absichtlich höher als der Hero (135%), damit beim
 * Nach-oben-Schieben unten keine Kante sichtbar wird.
 */
export default function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      // Hintergrund langsamer mitlaufen lassen als der Scroll → Tiefeneindruck
      el.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[135%] will-change-transform"
    >
      <Image
        src="/images/hero/landhaus-hero.jpeg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-zoom object-cover"
      />
    </div>
  );
}
