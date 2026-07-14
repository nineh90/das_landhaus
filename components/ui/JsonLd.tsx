/**
 * Rendert strukturierte Daten (schema.org JSON-LD) als <script>-Tag.
 * `<` wird escaped, damit der JSON-Inhalt das Script nicht vorzeitig beenden kann.
 */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
