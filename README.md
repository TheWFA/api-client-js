# WFA API Client (Powerchair Football) - COMING SOON

## THE API IS CURRENTLY UNRELEASED

A TypeScript/JavaScript client for accessing **Wheelchair Football Association (WFA)** data.

* **Docs:** [https://docs.thewfa.org.uk](https://docs.thewfa.org.uk)
* **Developer portal (tokens):** [https://developers.thewfa.org.uk](https://developers.thewfa.org.uk)

> This library aims to provide a clean, typed interface to the WFA API with first‑class TypeScript support, ESM/CJS builds, and friendly DX.

---

## Features

* ✅ TypeScript types for requests and responses
* ✅ ESM & CommonJS builds
* ✅ Token-based auth (`Authorization: Token <token>`)
* ✅ Built-in helpers for common queries (matches, teams, competitions, etc.)
* ✅ Works in Node 18+ and modern browsers

---

## Installation

```bash
# npm
npm install @thewfa/api-client

# or pnpm
pnpm add @thewfa/api-client

# or yarn
yarn add @thewfa/api-client

# or bun
bun add @thewfa/api-client
```

---

## Authentication

1. Create an application and generate an access token in the **Developer Portal**:

   * [https://developers.thewfa.org.uk](https://developers.thewfa.org.uk)
2. Pass your token to the client. The client will send it as:

```
Authorization: Token <your_access_token>
```

> **Never commit tokens** to source control. Prefer environment variables.

---

## Quick Start

### TypeScript / ESM

```ts
import { MatchDayClient } from '@thewfa/api-client';

// Prefer loading the token from env vars or your secret store
const client = new MatchDayClient({
  token: process.env.WFA_API_TOKEN!,
});

// List the latest matches
await client.matches.list({
  orderBy: { date: 'desc' },
  limit: 20,
});

// Fetch a single match by ID
const match = await client.matches.get('match_123');
console.log(match.details.homeTeam.name, match.details.awayTeam.name);
```

### CommonJS

```js
const { MatchDayClient } = require('@thewfa/api-client');

const client = new MatchDayClient({ token: process.env.WFA_API_TOKEN });

client.matches
  .list({ limit: 10 })
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

---

## Options

```ts
type WfaClientOptions = {
  /** Required: access token from the developer portal */
  token: string;
  /** Optional: API base URL override (defaults to the official base) */
  baseUrl?: string;
};
```

---

## Errors & Retries

* Network and HTTP errors throw `APIError` with:

* `message` (human‑readable)
* `data` (parsed error body when available)
* Add your own retry policy with a wrapper (e.g., `p-retry`).

```ts
try {
  await client.matches.get('bad_id');
} catch (e) {
  if (e instanceof NotFoundError) {
    // not found
  }
}
```


---

## Development

```bash
# Build
npm run build

# Lint & format
npm run lint
npm run format

# Tests (if present)
npm test
```

---

## FAQ

**Q: Where do I get a token?**
A: From the Developer Portal → [https://developers.thewfa.org.uk](https://developers.thewfa.org.uk).

**Q: Which header should I send?**
A: `Authorization: Token <access_token>`.

**Q: Which Node versions are supported?**
A: Node 18+ natively (for built‑in `fetch`)

**Q: What’s the base URL?**
A: The client defaults to the official WFA API base. You can override it via `baseUrl` if the docs specify a different environment. This can be useful for testing.

---

## Links

* API docs: [https://docs.thewfa.org.uk](https://docs.thewfa.org.uk)
* Developer portal: [https://developers.thewfa.org.uk](https://developers.thewfa.org.uk)

---

## License

MIT © WFA / Contributors
