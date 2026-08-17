import { MatchDayWebhookEvent } from '../types/webhooks';

import { extractWebhookHeaders } from './headers';
import { parseWebhookPayload } from './parse';
import { verifyWebhookSignature } from './signature';

export type ConstructWebhookEventOptions = {
    /** Maximum allowed age of the delivery's timestamp, in seconds. Defaults to 300 (5 minutes). */
    toleranceSeconds?: number;
};

/**
 * Verifies and parses a webhook delivery from its raw body and headers. Use this when
 * a `Request` object isn't available — e.g. a Node http server or Express handler that
 * has already read the raw body and holds headers as a plain record.
 */
export function constructWebhookEventFromHeaders(
    body: string,
    headers: Headers | Record<string, string>,
    publicKey: string,
    options?: ConstructWebhookEventOptions,
): MatchDayWebhookEvent {
    const { timestamp, signature } = extractWebhookHeaders(headers);

    verifyWebhookSignature({
        body,
        timestamp,
        signature,
        publicKey,
        toleranceSeconds: options?.toleranceSeconds,
    });

    return parseWebhookPayload(body);
}

/**
 * Verifies and parses a webhook delivery directly from a fetch `Request` — the shape
 * used by Next.js route handlers, Cloudflare Workers, Deno, and undici-based servers.
 */
export async function constructWebhookEvent(
    request: Request,
    publicKey: string,
    options?: ConstructWebhookEventOptions,
): Promise<MatchDayWebhookEvent> {
    const body = await request.text();

    return constructWebhookEventFromHeaders(body, request.headers, publicKey, options);
}
