# @thewfa/api-client

## 1.1.0

### Minor Changes

- 9143364: Added a webhook verifier and event parser for subscribers receiving WFA webhook deliveries.
  
  - `constructWebhookEvent(request, publicKey, options?)` verifies and parses a delivery directly from a fetch `Request`, returning a typed `MatchDayWebhookEvent`.
  - `constructWebhookEventFromHeaders(body, headers, publicKey, options?)` does the same from a raw body string and headers, for environments without a `Request` object (e.g. Express, raw Node http).
  - `verifyWebhookSignature` and `parseWebhookPayload` are exposed separately for composing custom verification flows. Signatures are Ed25519 (`X-WFA-Signature: ed25519=<base64>`), verified against the subscription's public key with a timestamp-tolerance replay check.
  - Added typed payloads for all six webhook event types (`MatchStatusChanged`, `GoalScored`, `CardIssued`, `SubstitutionMade`, `PenaltyShootoutAttempt`, `MatchScoreCorrected`) plus the synthetic `WebhookPing` event, with resolved `match`/`team`/`player` references that fall back to a bare id string if resolution failed.

## 1.0.0

### Major Changes

- bcfe711: Rebuilt the client against the new WFA Matchday API (public) OpenAPI spec.

    - All resource methods, request/response types and IDs (now numeric, except UUID accreditation IDs) have changed to match the new API.
    - Added `organisations`, `accreditations`, `history`, `suspensions`, `ties` and `kits` resources, plus `client.health()`.
    - Removed the `matchReport`/`matchSheet` match endpoints and the `users` resource — they no longer exist in the new API.
    - Removed the OAuth2 client (`MatchDayOAuthClient`) and Bearer/`accessToken` auth. The client now authenticates with an API key only, sent via the `x-api-key` header.
    - List responses are now flat (`{ items, totalItems, page, itemsPerPage }`) instead of nesting a `pagination` object.
    - Error responses now parse the API's `{ error: { code, message } }` body shape; `MatchDayAPIError` gained a `code` field and dropped `validationIssues`.
