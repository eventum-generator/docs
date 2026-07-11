type JsonLdData = Record<string, unknown>;

/**
 * Render one or more Schema.org objects as a JSON-LD script tag.
 *
 * Accepts a single object or an array of objects; an array is
 * emitted as a single script holding a JSON array, which is valid
 * JSON-LD.
 */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
