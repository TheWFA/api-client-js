# @thewfa/api-client

## 1.3.0

### Minor Changes

- 2a08584: Added an `id` filter to `client.competitions.list()` and `client.teams.list()` for fetching multiple competitions or teams by id.

### Patch Changes

- 2a08584: Fixed array query parameters (e.g. `id`, `teamId`, `status`, `role`, `type`, `card`, `position`) being silently dropped by the API. They were serialized as `key[0]=1&key[1]=2`, which the server's query parser treats as literal, unrelated keys rather than an array — the filter was ignored with no error. Arrays are now serialized as repeated keys (`key=1&key=2`), which the server parses correctly.

## 1.2.0

### Minor Changes

- e61a285: Added an `id` filter to `client.matches.list()` for fetching multiple matches by id, and added `assister` to goal events returned by `client.matches.get()`.

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
