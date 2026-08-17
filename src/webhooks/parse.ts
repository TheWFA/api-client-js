import { parseDates } from '../time';
import { MatchDayWebhookEvent, MatchDayWebhookEventType } from '../types/webhooks';

import { MatchDayWebhookPayloadError } from './errors';

const KNOWN_EVENT_TYPES: Set<string> = new Set(Object.values(MatchDayWebhookEventType));

/**
 * Parses a webhook delivery body into a typed {@link MatchDayWebhookEvent}, narrowed
 * by its `detailType`. Does not verify the signature — see {@link verifyWebhookSignature}.
 */
export function parseWebhookPayload(body: string | unknown): MatchDayWebhookEvent {
    let json: unknown;

    if (typeof body === 'string') {
        try {
            json = JSON.parse(body);
        } catch (err) {
            const detail = err instanceof Error ? err.message : String(err);
            throw new MatchDayWebhookPayloadError(`Webhook body is not valid JSON: ${detail}`);
        }
    } else {
        json = body;
    }

    if (!json || typeof json !== 'object' || Array.isArray(json)) {
        throw new MatchDayWebhookPayloadError('Webhook payload must be a JSON object');
    }

    const detailType = (json as Record<string, unknown>).detailType;

    if (typeof detailType !== 'string' || !KNOWN_EVENT_TYPES.has(detailType)) {
        throw new MatchDayWebhookPayloadError(`Unknown webhook event type: ${String(detailType)}`);
    }

    return parseDates(json) as MatchDayWebhookEvent;
}
