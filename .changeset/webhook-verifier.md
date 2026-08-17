---
'@thewfa/api-client': minor
---

Added a webhook verifier and event parser for subscribers receiving WFA webhook deliveries.

- `constructWebhookEvent(request, publicKey, options?)` verifies and parses a delivery directly from a fetch `Request`, returning a typed `MatchDayWebhookEvent`.
- `constructWebhookEventFromHeaders(body, headers, publicKey, options?)` does the same from a raw body string and headers, for environments without a `Request` object (e.g. Express, raw Node http).
- `verifyWebhookSignature` and `parseWebhookPayload` are exposed separately for composing custom verification flows. Signatures are Ed25519 (`X-WFA-Signature: ed25519=<base64>`), verified against the subscription's public key with a timestamp-tolerance replay check.
- Added typed payloads for all six webhook event types (`MatchStatusChanged`, `GoalScored`, `CardIssued`, `SubstitutionMade`, `PenaltyShootoutAttempt`, `MatchScoreCorrected`) plus the synthetic `WebhookPing` event, with resolved `match`/`team`/`player` references that fall back to a bare id string if resolution failed.
