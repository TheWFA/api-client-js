import {
    constructWebhookEventFromHeaders,
    MatchDayWebhookEventType,
    MatchDayWebhookPayloadError,
    MatchDayWebhookSignatureError,
} from '@thewfa/api-client';

import { postToDiscord } from './discord';
import { buildDiscordPayload } from './format-event';

export type IncomingRequest = {
    headers: Headers | Record<string, string>;
    body: string;
};

export type HandlerConfig = {
    /** The webhook subscription's Ed25519 public key (SPKI PEM). */
    webhookPublicKey: string;
    discordWebhookUrl: string;
    /** Max allowed age of the delivery's timestamp, in seconds. See verifyWebhookSignature. */
    toleranceSeconds?: number;
};

export type HandlerResponse = {
    statusCode: number;
    body: string;
};

/**
 * Verifies and parses an inbound WFA webhook delivery, then forwards it to Discord.
 * Framework-agnostic — both the Lambda and plain-Node-server adapters call this.
 *
 * Non-2xx responses cause WFA to retry the delivery (see the "Retries & delivery
 * guarantee" section of the webhook spec), so a failed Discord post is surfaced as
 * a 502 rather than swallowed.
 */
export async function handleWebhookDelivery(
    request: IncomingRequest,
    config: HandlerConfig,
): Promise<HandlerResponse> {
    let event;

    try {
        event = constructWebhookEventFromHeaders(
            request.body,
            request.headers,
            config.webhookPublicKey,
            {
                toleranceSeconds: config.toleranceSeconds,
            },
        );
    } catch (err) {
        if (err instanceof MatchDayWebhookSignatureError) {
            return { statusCode: 401, body: err.message };
        }
        if (err instanceof MatchDayWebhookPayloadError) {
            return { statusCode: 400, body: err.message };
        }
        throw err;
    }

    // Pings just verify the endpoint is alive — ack them without posting to Discord.
    if (event.detailType === MatchDayWebhookEventType.Ping) {
        return { statusCode: 200, body: 'ok' };
    }

    try {
        await postToDiscord(config.discordWebhookUrl, buildDiscordPayload(event));
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        return { statusCode: 502, body: `Failed to forward to Discord: ${detail}` };
    }

    return { statusCode: 200, body: 'ok' };
}
