import { generateKeyPairSync, sign as signEd25519 } from 'node:crypto';

import {
    constructWebhookEvent,
    constructWebhookEventFromHeaders,
    extractWebhookHeaders,
    MatchDayWebhookPayloadError,
    MatchDayWebhookSignatureError,
    parseWebhookPayload,
    verifyWebhookSignature,
} from '../webhooks';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const PUBLIC_KEY_PEM = publicKey.export({ type: 'spki', format: 'pem' }) as string;

function sign(timestamp: string, body: string): string {
    const signature = signEd25519(null, Buffer.from(`${timestamp}.${body}`), privateKey);
    return `ed25519=${signature.toString('base64')}`;
}

function buildDelivery(payload: object, timestamp = String(Date.now())) {
    const body = JSON.stringify(payload);
    const signature = sign(timestamp, body);

    return { body, timestamp, signature };
}

const pingPayload = { detailType: 'WebhookPing', occurredAt: '2026-08-17T12:00:00.000Z' };

describe('verifyWebhookSignature', () => {
    it('accepts a correctly signed, fresh delivery', () => {
        const { body, timestamp, signature } = buildDelivery(pingPayload);

        expect(() =>
            verifyWebhookSignature({ body, timestamp, signature, publicKey: PUBLIC_KEY_PEM }),
        ).not.toThrow();
    });

    it('throws when the signature is missing the ed25519= prefix', () => {
        const { body, timestamp } = buildDelivery(pingPayload);

        expect(() =>
            verifyWebhookSignature({
                body,
                timestamp,
                signature: 'deadbeef',
                publicKey: PUBLIC_KEY_PEM,
            }),
        ).toThrow(MatchDayWebhookSignatureError);
    });

    it('throws when the public key does not match the signing key', () => {
        const { body, timestamp, signature } = buildDelivery(pingPayload);
        const otherPublicKey = generateKeyPairSync('ed25519')
            .publicKey.export({ type: 'spki', format: 'pem' })
            .toString();

        expect(() =>
            verifyWebhookSignature({ body, timestamp, signature, publicKey: otherPublicKey }),
        ).toThrow(MatchDayWebhookSignatureError);
    });

    it('throws when the body has been tampered with', () => {
        const { timestamp, signature } = buildDelivery(pingPayload);

        expect(() =>
            verifyWebhookSignature({
                body: JSON.stringify({ ...pingPayload, occurredAt: '2099-01-01T00:00:00.000Z' }),
                timestamp,
                signature,
                publicKey: PUBLIC_KEY_PEM,
            }),
        ).toThrow(MatchDayWebhookSignatureError);
    });

    it('throws when the timestamp is outside the tolerance window', () => {
        const staleTimestamp = String(Date.now() - 10 * 60 * 1000);
        const body = JSON.stringify(pingPayload);
        const signature = sign(staleTimestamp, body);

        expect(() =>
            verifyWebhookSignature({
                body,
                timestamp: staleTimestamp,
                signature,
                publicKey: PUBLIC_KEY_PEM,
            }),
        ).toThrow(MatchDayWebhookSignatureError);
    });

    it('accepts a stale timestamp when the tolerance is widened', () => {
        const staleTimestamp = String(Date.now() - 10 * 60 * 1000);
        const body = JSON.stringify(pingPayload);
        const signature = sign(staleTimestamp, body);

        expect(() =>
            verifyWebhookSignature({
                body,
                timestamp: staleTimestamp,
                signature,
                publicKey: PUBLIC_KEY_PEM,
                toleranceSeconds: 24 * 60 * 60,
            }),
        ).not.toThrow();
    });
});

describe('parseWebhookPayload', () => {
    it('parses a WebhookPing payload and converts occurredAt to a Date', () => {
        const event = parseWebhookPayload(JSON.stringify(pingPayload));

        expect(event.detailType).toBe('WebhookPing');
        expect(event.occurredAt).toBeInstanceOf(Date);
    });

    it('parses a GoalScored payload with resolved match/team/player objects', () => {
        const payload = {
            detailType: 'GoalScored',
            match: {
                id: 1,
                status: 'second-half',
                scheduledFor: '2026-08-17T10:00:00.000Z',
                competition: { id: 10, name: 'Premier League' },
                homeTeam: { id: 2, name: 'Home FC', nickname: 'Home', badgeUrl: 'https://x/h.png' },
                awayTeam: { id: 3, name: 'Away FC', nickname: 'Away', badgeUrl: 'https://x/a.png' },
                score: { home: 1, away: 0, homePenalty: 0, awayPenalty: 0 },
            },
            team: { id: 2, name: 'Home FC', nickname: 'Home', badgeUrl: 'https://x/h.png' },
            scorer: { id: 5, name: 'J. Smith' },
            assister: null,
            goalType: 'goal',
            isPenalty: false,
            matchPeriod: 'first-half',
            matchTime: 12,
            occurredAt: '2026-08-17T12:00:00.000Z',
        };

        const event = parseWebhookPayload(JSON.stringify(payload));

        expect(event.detailType).toBe('GoalScored');
        expect(event.occurredAt).toBeInstanceOf(Date);

        if (event.detailType !== 'GoalScored') throw new Error('expected GoalScored');

        expect(event.scorer).toMatchObject({ id: 5, name: 'J. Smith' });
        expect(event.assister).toBeNull();
        expect(typeof event.match).toBe('object');

        if (typeof event.match !== 'object') throw new Error('expected resolved match');
        expect(event.match.scheduledFor).toBeInstanceOf(Date);
    });

    it('accepts bare id string fallbacks for unresolved match/player fields', () => {
        const payload = {
            detailType: 'CardIssued',
            match: '1',
            team: { id: 2, name: 'Home FC', nickname: 'Home', badgeUrl: 'https://x/h.png' },
            player: '5',
            cardType: 'yellow_card',
            matchPeriod: 'second-half',
            matchTime: 60,
            occurredAt: '2026-08-17T12:00:00.000Z',
        };

        const event = parseWebhookPayload(JSON.stringify(payload));

        if (event.detailType !== 'CardIssued') throw new Error('expected CardIssued');

        expect(event.match).toBe('1');
        expect(event.player).toBe('5');
    });

    it('accepts an already-parsed object', () => {
        const event = parseWebhookPayload(pingPayload);
        expect(event.detailType).toBe('WebhookPing');
    });

    it('throws on invalid JSON', () => {
        expect(() => parseWebhookPayload('not json')).toThrow(MatchDayWebhookPayloadError);
    });

    it('throws on an unknown detailType', () => {
        expect(() => parseWebhookPayload(JSON.stringify({ detailType: 'SomethingElse' }))).toThrow(
            MatchDayWebhookPayloadError,
        );
    });

    it('throws when the payload is not an object', () => {
        expect(() => parseWebhookPayload(JSON.stringify([1, 2, 3]))).toThrow(
            MatchDayWebhookPayloadError,
        );
    });
});

describe('extractWebhookHeaders', () => {
    const headerValues = {
        'X-WFA-Signature': 'ed25519=abc',
        'X-WFA-Timestamp': '123',
        'X-WFA-Event-Type': 'WebhookPing',
        'X-WFA-Delivery-Id': 'delivery-1',
    };

    it('reads headers from a fetch Headers instance', () => {
        const headers = extractWebhookHeaders(new Headers(headerValues));

        expect(headers).toEqual({
            signature: 'ed25519=abc',
            timestamp: '123',
            eventType: 'WebhookPing',
            deliveryId: 'delivery-1',
        });
    });

    it('reads headers from a plain record, case-insensitively', () => {
        const headers = extractWebhookHeaders(headerValues);

        expect(headers).toEqual({
            signature: 'ed25519=abc',
            timestamp: '123',
            eventType: 'WebhookPing',
            deliveryId: 'delivery-1',
        });
    });

    it('throws when a required header is missing', () => {
        const rest: Record<string, string> = { ...headerValues };
        delete rest['X-WFA-Signature'];

        expect(() => extractWebhookHeaders(rest)).toThrow(MatchDayWebhookPayloadError);
    });
});

describe('constructWebhookEventFromHeaders', () => {
    it('verifies and parses a valid delivery', () => {
        const { body, timestamp, signature } = buildDelivery(pingPayload);
        const headers = {
            'X-WFA-Signature': signature,
            'X-WFA-Timestamp': timestamp,
            'X-WFA-Event-Type': 'WebhookPing',
            'X-WFA-Delivery-Id': 'delivery-1',
        };

        const event = constructWebhookEventFromHeaders(body, headers, PUBLIC_KEY_PEM);

        expect(event.detailType).toBe('WebhookPing');
    });

    it('throws when the signature is invalid', () => {
        const { body, timestamp } = buildDelivery(pingPayload);
        const headers = {
            'X-WFA-Signature': 'ed25519=d3Jvbmc=',
            'X-WFA-Timestamp': timestamp,
            'X-WFA-Event-Type': 'WebhookPing',
            'X-WFA-Delivery-Id': 'delivery-1',
        };

        expect(() => constructWebhookEventFromHeaders(body, headers, PUBLIC_KEY_PEM)).toThrow(
            MatchDayWebhookSignatureError,
        );
    });
});

describe('constructWebhookEvent', () => {
    it('verifies and parses a delivery from a fetch Request', async () => {
        const { body, timestamp, signature } = buildDelivery(pingPayload);
        const request = new Request('https://example.com/webhooks/wfa', {
            method: 'POST',
            headers: {
                'X-WFA-Signature': signature,
                'X-WFA-Timestamp': timestamp,
                'X-WFA-Event-Type': 'WebhookPing',
                'X-WFA-Delivery-Id': 'delivery-1',
            },
            body,
        });

        const event = await constructWebhookEvent(request, PUBLIC_KEY_PEM);

        expect(event.detailType).toBe('WebhookPing');
    });
});
