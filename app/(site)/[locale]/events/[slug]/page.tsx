import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Section from "@/components/ui/Section";
import LinkButton from "@/components/ui/Button";
import KontaktCTA from "@/components/ui/KontaktCTA";
import JsonLd from "@/components/ui/JsonLd";
import { getEvents, getEventBySlug } from "@/lib/content";
import { buildEventJsonLd } from "@/lib/jsonld";
import { formatDatum } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/config";

/** Erzeugt zur Build-Zeit eine statische Seite je veröffentlichtem Event (SSG). */
export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Veranstaltung nicht gefunden" };

  return {
    title: event.titel,
    description: event.beschreibung ?? undefined,
    openGraph: {
      title: event.titel,
      description: event.beschreibung ?? undefined,
      images: event.bild ? [event.bild] : undefined,
    },
  };
}

export default async function EventDetailSeite({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  const [event, dict] = await Promise.all([getEventBySlug(slug), getDictionary(locale)]);
  if (!event) notFound();
  const t = dict.eventDetail;
  const eventLd = await buildEventJsonLd(event, locale);

  return (
    <>
      <JsonLd data={eventLd} />
      {event.bild && (
        <div className="relative h-72 w-full sm:h-96">
          <Image
            src={event.bild}
            alt={event.titel}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wald-dark/70 to-transparent" />
        </div>
      )}

      <Section>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-akzent-dark">
            {formatDatum(event.datum)} · {event.uhrzeit}
          </p>
          <h1 className="mt-2 font-script font-bold leading-[0.9] text-wald-dark text-5xl sm:text-6xl">
            {event.titel}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-tinte/80">
            <span>
              <span className="font-semibold text-wald-dark">{t.eintritt}:</span>{" "}
              {event.eintritt ?? t.eintrittAnfrage}
            </span>
          </div>

          {event.beschreibung && (
            <p className="mt-8 text-lg leading-relaxed text-tinte/80">{event.beschreibung}</p>
          )}

          <div className="mt-10">
            <LinkButton href={localizedHref(locale, "/events")} variante="secondary">
              {t.zurueck}
            </LinkButton>
          </div>
        </div>
      </Section>

      <Section className="bg-creme-dark/40">
        <KontaktCTA locale={locale} titel={t.ctaTitel} text={t.ctaText} />
      </Section>
    </>
  );
}
