/**
 * Serializes a query object into a query string.
 *
 * Array values are serialized as repeated keys (`id=1&id=2`) rather than
 * bracket-index notation (`id[0]=1&id[1]=2`), since the API's query parser
 * treats bracketed keys as literal, distinct keys rather than array syntax
 * and silently drops them.
 */
export function stringifyQuery(query: Record<string, unknown>): string {
    const parts: string[] = [];

    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) {
            continue;
        }

        for (const item of Array.isArray(value) ? value : [value]) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
        }
    }

    return parts.join('&');
}
