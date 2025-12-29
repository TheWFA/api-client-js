const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
// Matches ISO datetime with T or space separator, optional milliseconds, optional timezone (with or without colon, minutes optional)
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/;

function isIsoDateString(value: string): boolean {
    if (typeof value !== 'string') return false;
    return ISO_DATE.test(value) || ISO_DATETIME.test(value);
}

export function parseDates<T>(obj: T): T {
    if (obj == null) return obj;

    if (typeof obj === 'string' && isIsoDateString(obj)) {
        // Normalize for Date.parse compatibility:
        // - Replace space with T
        // - Add colon to timezone if missing (e.g., :00+00 -> :00+00:00)
        let normalized = obj.replace(' ', 'T');
        // Match timezone without minutes only when preceded by seconds (:\d{2})
        normalized = normalized.replace(/(:\d{2})([+-])(\d{2})$/, '$1$2$3:00');
        const ms = Date.parse(normalized);
        return (isNaN(ms) ? obj : new Date(ms)) as unknown as T;
    }

    if (Array.isArray(obj)) {
        return obj.map((v) => parseDates(v)) as unknown as T;
    }

    if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, parseDates(v)]),
        ) as T;
    }

    return obj;
}
