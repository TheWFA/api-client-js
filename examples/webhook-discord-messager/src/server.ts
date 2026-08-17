import { createServer, IncomingMessage, ServerResponse } from 'node:http';

import { normalizePem, requiredEnv } from './env';
import { handleWebhookDelivery, HandlerConfig } from './handler';

const config: HandlerConfig = {
    webhookPublicKey: normalizePem(requiredEnv('WFA_WEBHOOK_PUBLIC_KEY')),
    discordWebhookUrl: requiredEnv('DISCORD_WEBHOOK_URL'),
};

const port = Number(process.env.PORT ?? 8080);

function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        req.on('error', reject);
    });
}

function flattenHeaders(headers: IncomingMessage['headers']): Record<string, string> {
    const flat: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
        if (typeof value === 'string') flat[key] = value;
        else if (Array.isArray(value)) flat[key] = value.join(', ');
    }

    return flat;
}

/**
 * A plain node:http server — no framework dependency, so it runs anywhere Node 18+
 * runs: a container, a VM, Fly.io/Render, etc. Swap this file out for your framework
 * of choice (Express, Fastify, ...) if you have one; handleWebhookDelivery doesn't care.
 */
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'text/plain' }).end('Method Not Allowed');
        return;
    }

    readBody(req)
        .then((body) =>
            handleWebhookDelivery({ headers: flattenHeaders(req.headers), body }, config),
        )
        .then((result) => {
            res.writeHead(result.statusCode, { 'Content-Type': 'text/plain' }).end(result.body);
        })
        .catch((err) => {
            console.error('Unhandled error while processing webhook delivery', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Internal Server Error');
        });
});

server.listen(port, () => {
    console.log(`WFA → Discord webhook relay listening on :${port}`);
});
