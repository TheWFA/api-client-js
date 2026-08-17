# webhook-discord-messager

Verifies an incoming WFA webhook delivery and forwards it as a message to a Discord
channel via an [incoming webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).

The verification/parsing logic lives in [`@thewfa/api-client`](../..)'s `webhooks`
module ([`constructWebhookEventFromHeaders`](../../src/webhooks/construct-event.ts)).
This example is just:

- `src/handler.ts` — the framework-agnostic core: verify → parse → format → post to
  Discord. Everything else in this example is a thin adapter around it.
- `src/lambda.ts` — an AWS Lambda adapter (Function URL / API Gateway HTTP API v2
  payload format).
- `src/server.ts` — a plain `node:http` adapter that runs anywhere Node 18+ runs.
- `src/discord.ts` / `src/format-event.ts` — posts to a Discord webhook, and turns
  each `MatchDayWebhookEvent` into a Discord embed.

`WebhookPing` deliveries (the platform's liveness check — sent on demand via
`POST .../ping` and on a daily schedule) are acknowledged with `200` but not
forwarded to Discord, so the channel isn't spammed with verification noise.

A failed Discord post returns `502`, which causes WFA's delivery pipeline to retry
the delivery — see "Retries & delivery guarantee" in the webhook spec.

## Setup

```bash
# Build the library this example depends on, first
cd ../.. && npm run build && cd examples/webhook-discord-messager

npm install
cp .env.example .env
```

Fill in `.env`:

- `WFA_WEBHOOK_PUBLIC_KEY` — the `publicKey` (SPKI PEM) from the `WebhookSubscription`
  you created against the webhook management API.
- `DISCORD_WEBHOOK_URL` — a Discord channel's incoming webhook URL.

## Run locally

```bash
npm run dev
```

Starts an HTTP server on `:8080` (`POST /` accepts a delivery). To receive real
deliveries locally, put it behind a tunnel (e.g. `ngrok http 8080`) and point the
`WebhookSubscription.url` at the tunnel's HTTPS URL, then use `POST .../ping` to
send a test delivery.

## Deploy to AWS Lambda

```bash
npm run build:lambda   # bundles src/lambda.ts -> dist/lambda.js (single file, no node_modules needed)
cd dist && zip lambda.zip lambda.js
```

Create a Node 18+ Lambda function from `lambda.zip`, handler `lambda.handler`, with
`WFA_WEBHOOK_PUBLIC_KEY` and `DISCORD_WEBHOOK_URL` set as environment variables.
Attach a **Function URL** with auth type `NONE` — deliveries are authenticated by
their Ed25519 signature, not AWS IAM, so no SigV4/API Gateway auth is needed. Point
the `WebhookSubscription.url` at the Function URL.

(An API Gateway HTTP API in front of the same handler works too, unchanged — it
uses the same v2 payload format as Function URLs.)

## Deploy elsewhere

```bash
npm run build
WFA_WEBHOOK_PUBLIC_KEY=... DISCORD_WEBHOOK_URL=... node dist/server.js
```

`server.ts` has no AWS or framework dependency, so the built output runs in a
container, on a VM, on Fly.io/Render, or anywhere else Node 18+ runs. Swap it for
Express/Fastify/etc. if you have a preferred framework — `handleWebhookDelivery`
just needs a body string and headers, so it drops into any HTTP layer.
