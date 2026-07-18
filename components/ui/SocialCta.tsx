import { activeSocialChannels } from "@/lib/social";
import Container from "./Container";
import SocialLinks from "./SocialLinks";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * Social-Sektion als eigenes Band direkt über dem Footer — auf jeder Seite
 * (im Layout eingehängt). Lädt Gäste sichtbar ein, den Kanälen zu folgen.
 *
 * Hält sich selbst zurück, solange keine Kanäle gepflegt sind: ohne aktive
 * Links wird gar nichts gerendert (keine leere Überschrift).
 */
export default function SocialCta({ dict }: { dict: Dictionary }) {
  if (activeSocialChannels.length === 0) return null;

  const c = dict.socialCta;

  return (
    <section className="bg-wald text-creme">
      <Container className="flex flex-col items-center gap-7 py-14 text-center">
        <div>
          <h2 className="font-display text-2xl text-creme sm:text-3xl">{c.titel}</h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-creme/85">{c.text}</p>
        </div>
        <SocialLinks tone="onDark" size="lg" />
      </Container>
    </section>
  );
}
