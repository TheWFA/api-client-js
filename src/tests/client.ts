import { MatchDayClient, MatchDayOAuthClient } from '..';

// Global singleton type
declare global {
    // eslint-disable-next-line no-var
    var __matchDayClient: MatchDayClient | undefined;
    // eslint-disable-next-line no-var
    var _matchDayOAuthClient: MatchDayOAuthClient | undefined;
}

export function getTestClient(): MatchDayClient {
    if (!globalThis.__matchDayClient) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error('Missing API_KEY in environment');
        }
        globalThis.__matchDayClient = new MatchDayClient({
            apiKey,
            baseURL: process.env.MATCHDAY_API_URL,
        });
    }
    return globalThis.__matchDayClient;
}

export function getTestOAuthClient(): MatchDayOAuthClient {
    if (!globalThis._matchDayOAuthClient) {
        const clientId = process.env.CLIENT_ID;
        if (!clientId) {
            throw new Error('Missing CLIENT_ID in environment');
        }

        const clientSecret = process.env.CLIENT_SECRET;
        if (!clientId) {
            throw new Error('Missing CLIENT_SECRET in environment');
        }

        globalThis._matchDayOAuthClient = new MatchDayOAuthClient({
            clientId,
            clientSecret,
            authURL: process.env.MATCHDAY_AUTH_URL,
        });
    }
    return globalThis._matchDayOAuthClient;
}
