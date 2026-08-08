# WFA API Client (Powerchair Football) - COMING SOON

## THE API IS CURRENTLY UNRELEASED

A TypeScript/JavaScript client for accessing **Wheelchair Football Association (WFA)** Matchday data.

> This library aims to provide a clean, typed interface to the WFA Matchday API with first‑class TypeScript support, ESM/CJS builds, and friendly DX.

---

## Features

- ✅ TypeScript types for every request and response
- ✅ ESM & CommonJS builds
- ✅ API key auth (`x-api-key` header)
- ✅ Full coverage of matches, teams, clubs, competitions, organisations, seasons, persons, accreditations, suspensions, ties, kits, search and history
- ✅ Works in Node 18+ and modern browsers

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

Pass your API key to the client. It's sent as:

```
x-api-key: <your_api_key>
```

> **Never commit API keys** to source control. Prefer environment variables.

---

## Quick Start

### TypeScript / ESM

```ts
import { MatchDayClient } from '@thewfa/api-client';

const client = new MatchDayClient({
    apiKey: process.env.WFA_API_KEY!,
});

// List the latest matches
const matches = await client.matches.list({ itemsPerPage: 20, orderByDateDesc: true });

// Fetch a single match by ID
const match = await client.matches.get(matches.items[0].id);
console.log(match.homeTeam.name, match.awayTeam.name);
```

### CommonJS

```js
const { MatchDayClient } = require('@thewfa/api-client');

const client = new MatchDayClient({ apiKey: process.env.WFA_API_KEY });

client.matches
    .list({ itemsPerPage: 10 })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
```

---

## Options

```ts
type APIClientConfig = {
    /** Required: your API key */
    apiKey?: string;
    /** Optional: API base URL override (defaults to the official base) */
    baseURL?: string;
    /** Optional: API version path prefix, defaults to /v1 */
    version?: MatchDayAPIVersion;
};
```

---

## Resources

| Resource                | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `client.matches`        | List and fetch matches (lineups, events, penalties)                   |
| `client.teams`          | Teams, rosters, staff, registrations, seasons played, stats           |
| `client.clubs`          | Clubs and their teams                                                 |
| `client.competitions`   | Competitions, tables, match groups, stats                             |
| `client.organisations`  | Organisations and the competitions they run                           |
| `client.seasons`        | Seasons                                                               |
| `client.persons`        | People: registrations, appearances, stats, suspensions                |
| `client.accreditations` | Accreditations and their facets                                       |
| `client.suspensions`    | Suspensions (global list, split by origin/served-in match)            |
| `client.ties`           | Two-legged ties and aggregate scores                                  |
| `client.kits`           | Kit types and per-team kits                                           |
| `client.history`        | Superseded identities of teams, clubs, competitions and organisations |
| `client.search`         | Fuzzy search across persons, teams, clubs, competitions and matches   |
| `client.health()`       | API health status                                                     |

---

## Errors

Network and HTTP errors throw a subclass of `MatchDayAPIError` with:

- `message` — human‑readable
- `status` — the HTTP status code
- `code` — the API's error code, when available
- `jsonResponse` — the parsed error body

```ts
import { MatchDayNotFoundError } from '@thewfa/api-client';

try {
    await client.matches.get(999999);
} catch (e) {
    if (e instanceof MatchDayNotFoundError) {
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

# Tests
npm test
```

---

## License

MIT © WFA / Contributors
