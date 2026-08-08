# @thewfa/api-client

## 1.0.0

### Major Changes

- bcfe711: Rebuilt the client against the new WFA Matchday API (public) OpenAPI spec.

    - All resource methods, request/response types and IDs (now numeric, except UUID accreditation IDs) have changed to match the new API.
    - Added `organisations`, `accreditations`, `history`, `suspensions`, `ties` and `kits` resources, plus `client.health()`.
    - Removed the `matchReport`/`matchSheet` match endpoints and the `users` resource — they no longer exist in the new API.
    - Removed the OAuth2 client (`MatchDayOAuthClient`) and Bearer/`accessToken` auth. The client now authenticates with an API key only, sent via the `x-api-key` header.
    - List responses are now flat (`{ items, totalItems, page, itemsPerPage }`) instead of nesting a `pagination` object.
    - Error responses now parse the API's `{ error: { code, message } }` body shape; `MatchDayAPIError` gained a `code` field and dropped `validationIssues`.
