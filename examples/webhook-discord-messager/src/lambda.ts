import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

import { normalizePem, requiredEnv } from './env';
import { handleWebhookDelivery, HandlerConfig } from './handler';

// Read once per cold start so warm invocations reuse it.
const config: HandlerConfig = {
    webhookPublicKey: normalizePem(requiredEnv('WFA_WEBHOOK_PUBLIC_KEY')),
    discordWebhookUrl: requiredEnv('DISCORD_WEBHOOK_URL'),
};

function decodeBody(event: APIGatewayProxyEventV2): string {
    if (!event.body) return '';
    return event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
}

function flattenHeaders(headers: APIGatewayProxyEventV2['headers']): Record<string, string> {
    const flat: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
        if (value !== undefined) flat[key] = value;
    }

    return flat;
}

/**
 * Entry point for an AWS Lambda Function URL or an API Gateway HTTP API (v2 payload
 * format) — both use the same event shape. No API Gateway is required; a Function
 * URL with auth type NONE is enough, since deliveries are authenticated by their
 * Ed25519 signature rather than AWS IAM/SigV4.
 */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const result = await handleWebhookDelivery(
        { headers: flattenHeaders(event.headers), body: decodeBody(event) },
        config,
    );

    return { statusCode: result.statusCode, body: result.body };
}
