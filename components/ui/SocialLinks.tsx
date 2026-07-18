import { activeSocialChannels } from "@/lib/social";
import { SocialIcon } from "./SocialIcon";

/**
 * Reihe klickbarer Social-Media-Icons. Speist sich aus `lib/social.ts` und
 * rendert nur Kanäle mit hinterlegter URL — ohne aktive Kanäle kommt gar
 * nichts (kein leerer Rahmen, keine tote Überschrift).
 *
 * `tone` steuert die Farbwelt: `onLight` für die helle Kopfzeile,
 * `onDark` für die dunkle Fußzeile.
 */
export default function SocialLinks({
  tone = "onLight",
  size = "sm",
  heading,
  className = "",
  headingClassName = "",
}: {
  tone?: "onLight" | "onDark";
  /** `sm` für Kopf-/Fußzeile, `lg` als prominente Reihe (Social-Sektion). */
  size?: "sm" | "lg";
  heading?: string;
  className?: string;
  headingClassName?: string;
}) {
  if (activeSocialChannels.length === 0) return null;

  const toneCls =
    tone === "onDark"
      ? "text-creme/80 hover:bg-creme/10 hover:text-akzent"
      : "text-wald-dark hover:bg-creme-dark hover:text-akzent-dark";
  // Große Variante bekommt eine dezente Grundfläche, damit die Icons als Reihe „stehen"
  const restCls = size === "lg" ? (tone === "onDark" ? "bg-creme/10" : "bg-creme-dark/60") : "";
  const boxCls = size === "lg" ? "h-12 w-12" : "h-9 w-9";
  const iconCls = size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const gapCls = size === "lg" ? "gap-3" : "gap-1";

  return (
    <div className={className}>
      {heading && <p className={headingClassName}>{heading}</p>}
      <ul className={`flex items-center ${gapCls}`}>
        {activeSocialChannels.map((channel) => (
          <li key={channel.platform}>
            <a
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={channel.label}
              title={channel.label}
              className={`inline-flex ${boxCls} items-center justify-center rounded-full transition-colors ${toneCls} ${restCls}`}
            >
              <SocialIcon platform={channel.platform} className={iconCls} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
