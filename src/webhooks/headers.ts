import { MatchDayWebhookPayloadError } from './errors';

export type MatchDayWebhookHeaders = {
    signature: string;
    timestamp: string;
    eventType: string;
    deliveryId: string;
};

const HEADER_NAMES: Record<keyof MatchDayWebhookHeaders, string> = {
    signature: 'x-wfa-signature',
    timestamp: 'x-wfa-timestamp',
    eventType: 'x-wfa-event-type',
    deliveryId: 'x-wfa-delivery-id',
};

function readHeader(headers: Headers | Record<string, string>, name: string): string | undefined {
    if (typeof (headers as Headers).get === 'function') {
        return (headers as Headers).get(name) ?? undefined;
    }

    const record = headers as Record<string, string>;
    const key = Object.keys(record).find((k) => k.toLowerCase() === name);

    return key ? record[key] : undefined;
}

/**
 * Pulls the four `X-WFA-*` delivery headers off either a fetch `Headers` instance
 * or a plain lowercase-or-not record (e.g. `req.headers` from Node's http server).
 */
export function extractWebhookHeaders(
    headers: Headers | Record<string, string>,
): MatchDayWebhookHeaders {
    const entries = Object.entries(HEADER_NAMES).map(([key, headerName]) => [
        key,
        readHeader(headers, headerName),
    ]);
    const values = Object.fromEntries(entries) as Partial<MatchDayWebhookHeaders>;

    const missing = (Object.keys(HEADER_NAMES) as (keyof MatchDayWebhookHeaders)[]).filter(
        (key) => !values[key],
    );

    if (missing.length > 0) {
        throw new MatchDayWebhookPayloadError(
            `Missing required webhook header(s): ${missing.map((key) => HEADER_NAMES[key]).join(', ')}`,
        );
    }

    return values as MatchDayWebhookHeaders;
}
