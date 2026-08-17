import { verify as verifyEd25519 } from 'node:crypto';

import { MatchDayWebhookSignatureError } from './errors';

const SIGNATURE_PREFIX = 'ed25519=';
const DEFAULT_TOLERANCE_SECONDS = 300;

export type VerifyWebhookSignatureParams = {
    /** Raw request body, exactly as received — must not be re-serialized JSON. */
    body: string;
    /** Value of the `X-WFA-Timestamp` header (ms since epoch, as a string). */
    timestamp: string;
    /** Value of the `X-WFA-Signature` header, e.g. `ed25519=<base64>`. */
    signature: string;
    /** The subscription's Ed25519 public key, SPKI PEM format. */
    publicKey: string;
    /** Maximum allowed age of the timestamp, in seconds. Defaults to 300 (5 minutes). */
    toleranceSeconds?: number;
};

/**
 * Verifies a webhook delivery's Ed25519 signature and timestamp freshness.
 * Throws {@link MatchDayWebhookSignatureError} if either check fails.
 */
export function verifyWebhookSignature(params: VerifyWebhookSignatureParams): void {
    const {
        body,
        timestamp,
        signature,
        publicKey,
        toleranceSeconds = DEFAULT_TOLERANCE_SECONDS,
    } = params;

    if (!signature.startsWith(SIGNATURE_PREFIX)) {
        throw new MatchDayWebhookSignatureError(
            `Signature must be prefixed with "${SIGNATURE_PREFIX}"`,
        );
    }

    const signatureBytes = Buffer.from(signature.slice(SIGNATURE_PREFIX.length), 'base64');
    const message = Buffer.from(`${timestamp}.${body}`);

    let isValid: boolean;

    try {
        // Ed25519 has no separate digest step, so the algorithm is null.
        isValid = verifyEd25519(null, message, publicKey, signatureBytes);
    } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        throw new MatchDayWebhookSignatureError(`Could not verify signature: ${detail}`);
    }

    if (!isValid) {
        throw new MatchDayWebhookSignatureError('Signature does not match expected value');
    }

    const timestampMs = Number(timestamp);

    if (!Number.isFinite(timestampMs)) {
        throw new MatchDayWebhookSignatureError('Timestamp header is not a valid number');
    }

    const ageSeconds = Math.abs(Date.now() - timestampMs) / 1000;

    if (ageSeconds > toleranceSeconds) {
        throw new MatchDayWebhookSignatureError('Timestamp is outside the allowed tolerance');
    }
}
